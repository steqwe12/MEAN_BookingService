import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SmestajService } from '../services/smestaj.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import Smestaj from '../models/smestaj';
import Preporuka from '../models/preporuka';
import { PreporukaService } from '../services/preporuka.service';
import * as L from 'leaflet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';

@Component({
  selector: 'app-vlasnik-unesi-preporuku',
  templateUrl: './vlasnik-unesi-preporuku.component.html',
  styleUrls: ['./vlasnik-unesi-preporuku.component.css']
})
export class VlasnikUnesiPreporukuComponent {

  constructor(private slikaPreporukeService:SlikaPreporukeService,private preporukaService:PreporukaService ,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;
  smestaji:Smestaj[]=[]
  selectedSmestajNaziv: string='';
  selectedSmestaj:Smestaj;
  preporuke:Preporuka[]=[]
  preporukeMENJANE:Preporuka[]=[]

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private marker2: L.Marker | undefined;
  selectedCoords: { lat: number, lng: number } | undefined;

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1 == null) this.router.navigate(['']); // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;
      this.smestajService.dohvatiSmestajeZaVlasnika(this.korisnik.korisnickoIme).subscribe((s1: Smestaj[]) => {
        this.smestaji = s1;

        if (this.smestaji.length > 0) {
          this.selectedSmestaj = this.smestaji[0]; // postavi prvi smestaj kao default
          this.selectedSmestajNaziv = this.smestaji[0].nazivSmestaja
          this.initializeMap(); // pozovi mapu samo ako je selectedSmestaj postavljen
        }

        this.preporukaService.dohvatiPreporukeZaVlasnika(this.korisnik.korisnickoIme).subscribe((p1: Preporuka[]) => {
          this.preporuke=p1;
          this.preporukeMENJANE=p1;
        });
      });
    });
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }


  pomocInitializeMap() {
    this.smestajService.dohvatiSmestaj(this.korisnik.korisnickoIme,this.selectedSmestajNaziv).subscribe((s1: Smestaj) => {
      this.selectedSmestaj=s1;

      this.selectedCoords=undefined;
      if (this.marker2) {
        this.marker2.remove(); // Uklanja marker2 sa mape
        this.marker2 = undefined; // Resetovanje reference na marker
      }

      if (this.selectedSmestaj && this.selectedSmestaj.lat !== undefined && this.selectedSmestaj.lng !== undefined) {
        if (this.map) {
          this.map.setView([this.selectedSmestaj.lat, this.selectedSmestaj.lng], 13);

          // Ako marker vec postoji, azuriraj njegovu poziciju
          if (this.marker) {
            this.marker.setLatLng([this.selectedSmestaj.lat, this.selectedSmestaj.lng]);
          } else {
            // Ako marker ne postoji, kreiraj novi
            this.marker = L.marker([this.selectedSmestaj.lat, this.selectedSmestaj.lng], { draggable: false }).addTo(this.map);
          }

        }
      } else {
        console.error("LatLng vrednosti za selectedSmestaj nisu definisane");
      }
    });
  }


  initializeMap(): void {
    if (!this.selectedSmestaj || !this.selectedSmestaj.lat || !this.selectedSmestaj.lng) {
      console.error('selectedSmestaj is not properly defined');
      return;
    }

    if (!this.map) {
      this.map = L.map('map').setView([this.selectedSmestaj.lat, this.selectedSmestaj.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map);

      const pinBlue = new L.Icon({
        iconUrl: '../../assets/pinBlue.png',
        iconSize: [25, 41],  // Prilagodi velicinu ikone
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],  // Prilagodi tacku za popup prozor
      });

      const pinRed = new L.Icon({
        iconUrl: '../../assets/pinRed.png',
        iconSize: [25, 41],  // Prilagodi velicinu ikone
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],  // Prilagodi tacku za popup prozor
      });

      this.marker = L.marker([this.selectedSmestaj.lat, this.selectedSmestaj.lng], { draggable: false, icon:pinRed  }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.selectedCoords = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };
        if (this.marker2) {
          this.marker2.setLatLng([this.selectedCoords.lat, this.selectedCoords.lng]);
        } else {
          this.marker2 = L.marker([this.selectedCoords.lat, this.selectedCoords.lng], { icon:pinBlue }).addTo(this.map);
        }
        console.log('Selected coordinates:', this.selectedCoords);
      });

      this.map.invalidateSize();
    }
  }


  /*currentPage: number = 1;
  rowsPerPage: number = 5;

  get paginatedPreporuke() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.preporuke.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.smestaji.length / this.rowsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get maxPage(): number {
    return Math.ceil(this.smestaji.length / this.rowsPerPage);
  }*/

  detaljanPrikazPreporuke(nazivSmestaja:string,nazivPreporuke:string){
    sessionStorage.setItem("nazivSmestaja", nazivSmestaja)
    sessionStorage.setItem("nazivPreporuke", nazivPreporuke)
    this.router.navigate(['vlasnikDetaljPreporuke'])
  }



  nazivPreporuke=''
  opisPreporuke=''
  tipPreporuke=''

  dodajPreporuku(){
    this.preporukaService.dodajPreporuku(this.korisnik.korisnickoIme,this.selectedSmestajNaziv,this.selectedCoords.lat,this.selectedCoords.lng,this.nazivPreporuke,this.opisPreporuke,this.tipPreporuke).subscribe((resp) => {

      let count = 0;
      const totalImages = this.selectedImages.length;
      if (totalImages===0){
        return;
      }

      this.selectedImages.forEach(slika => {
        let novoImeSlike=`${Date.now()}-${slika.name}`;
        this.slikaPreporukeService.unesiNovuSlikuPreporuke(this.korisnik.korisnickoIme, this.selectedSmestajNaziv,this.nazivPreporuke,novoImeSlike).subscribe((resp) => {
          this.slikaPreporukeService.sacuvajSlikuNaServeru(novoImeSlike,slika).subscribe((resp) => {
            count++;
            if (count === totalImages){
              console.log("Slike uspešno sačuvane:", novoImeSlike);
              location.reload();
            }
          });
        });
      });


    });
  }

  selectedImages : File[] = [];

  selectImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages  = Array.from(input.files);
    }
  }


  ////////////////////////////////////////////

  filterNazSmest:string='';
  filterNazPrep:string='';
  filterOpisPrep:string='';
  filterTipPrep:string='';

  filter_preporuke(){
    this.preporukeMENJANE=this.preporuke;
    if (this.filterNazSmest!="")
    this.preporukeMENJANE=this.preporukeMENJANE.filter(kor=>kor.nazivSmestaja.includes(this.filterNazSmest));
    if (this.filterNazPrep!="")
    this.preporukeMENJANE=this.preporukeMENJANE.filter(kor=>kor.nazivPreporuke.includes(this.filterNazPrep));
    if (this.filterOpisPrep!="")
    this.preporukeMENJANE=this.preporukeMENJANE.filter(kor=>kor.opisPreporuke.includes(this.filterOpisPrep));
    if (this.filterTipPrep!="")
    this.preporukeMENJANE=this.preporukeMENJANE.filter(kor=>kor.tip.includes(this.filterTipPrep));
  }

  sortDesc0() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.nazivSmestaja < kor2.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.nazivSmestaja == kor2.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc0() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.nazivSmestaja > kor2.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.nazivSmestaja == kor2.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc1() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.nazivPreporuke < kor2.nazivPreporuke) {
        return -1;
      }
      else {
        if (kor1.nazivPreporuke == kor2.nazivPreporuke) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.nazivPreporuke > kor2.nazivPreporuke) {
        return -1;
      }
      else {
        if (kor1.nazivPreporuke == kor2.nazivPreporuke) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.opisPreporuke < kor2.opisPreporuke) {
        return -1;
      }
      else {
        if (kor1.opisPreporuke == kor2.opisPreporuke) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.opisPreporuke > kor2.opisPreporuke) {
        return -1;
      }
      else {
        if (kor1.opisPreporuke == kor2.opisPreporuke) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.tip < kor2.tip) {
        return -1;
      }
      else {
        if (kor1.tip == kor2.tip) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc3() {
    this.preporukeMENJANE.sort((kor1, kor2) => {
      if (kor1.tip > kor2.tip) {
        return -1;
      }
      else {
        if (kor1.tip == kor2.tip) {
          return 0;
        }
        else return 1;
      }
    })
  }





}
