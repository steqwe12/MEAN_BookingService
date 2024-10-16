import { Component } from '@angular/core';
import User from '../models/user';
import { RezervacijaService } from '../services/rezervacija.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import * as L from 'leaflet';
import { UserService } from '../services/user.service';
import { SmestajService } from '../services/smestaj.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Kupon from '../models/kupon';
import { KuponService } from '../services/kupon.service';
import Preporuka from '../models/preporuka';
import { PreporukaService } from '../services/preporuka.service';
import Smestaj from '../models/smestaj';
import SlikaPreporuke from '../models/slikaPreporuke';
import SlikaSmestaja from '../models/slikaSmestaja';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';

@Component({
  selector: 'app-turista-detalji-rezervacije',
  templateUrl: './turista-detalji-rezervacije.component.html',
  styleUrls: ['./turista-detalji-rezervacije.component.css']
})
export class TuristaDetaljiRezervacijeComponent {

  constructor(private slikaPreporukeService:SlikaPreporukeService,private preporukaService:PreporukaService,private kuponService:KuponService,private rezervacijaService: RezervacijaService,private sanitizer: DomSanitizer,private slikaSmestajaService:SlikaSmestajaService,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;
  vlasnik: User;
  smestaj:Smestaj;
  kuponi: Kupon[]=[];
  preporuke: Preporuka[]=[]
  selectedPreporukaNaziv:string=''
  selectedPreporuka:Preporuka;

  slike: SlikaSmestaja[]=[];
  slikeFajlovi: File[] = [];

  slikePrep: SlikaPreporuke[]=[];
  slikePrepFajlovi: File[] = [];


  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private marker2: L.Marker | undefined;


  ngOnInit(): void {
    let vlasnik=sessionStorage.getItem("vlasnik")
    let nazivSmestaja=sessionStorage.getItem("nazivSmestaja")
    let datumOd=sessionStorage.getItem("datumOd")
    let datumDo=sessionStorage.getItem("datumDo")

    this.userService.dohvatiKorisnikaZaUsername(vlasnik).subscribe((u2: User) => {
      this.vlasnik=u2;
    })

    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='turista') this.router.navigate([''])
      this.korisnik = u1;
    })

    this.ucitajSlike();

    this.kuponService.dohvatiKuponeZaVlasnika(vlasnik).subscribe((k1: Kupon[]) => {
      this.kuponi=k1;
    })

    this.smestajService.dohvatiSmestaj(vlasnik,nazivSmestaja).subscribe((s1: Smestaj) => {
      this.smestaj=s1;
    })

    this.preporukaService.dohvatiPreporukeZaSmestajVlasnika(vlasnik,nazivSmestaja).subscribe((p1: Preporuka[]) => {
      this.preporuke=p1;

      if (this.preporuke.length > 0) {
        this.selectedPreporuka = this.preporuke[0]; // ili postavi prvi smestaj kao default
        this.selectedPreporukaNaziv = this.preporuke[0].nazivPreporuke
        // ovde za slike
        this.ucitajSlikePreporuke();
        this.initializeMap(); // pozovi mapu samo ako je selectedSmestaj postavljen
      }
    })


  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }
//////////////////////////////////
ucitajSlike(): void {
  this.slikaSmestajaService.dohvatiSlikeZaSmestajKorisnika(sessionStorage.getItem("vlasnik"),sessionStorage.getItem("nazivSmestaja")).subscribe((slike: SlikaSmestaja[]) => {
    this.slike = slike;

    const promises = this.slike.map(sl =>
      this.slikaSmestajaService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
        .then(slikaBlob => {
          const slika = new File([slikaBlob], sl.nazivSlike, { type: slikaBlob.type });
          this.slikeFajlovi.push(slika);
        })
    );

    Promise.all(promises).then(() => {
      console.log('Sve slike su učitane.');
    }).catch(error => {
      console.error('Greška prilikom učitavanja slika:', error);
    });
  });
}

ucitajSlikePreporuke(): void {
  this.slikePrepFajlovi=[]
  this.slikaPreporukeService.dohvatiSlikeZaPreporukuKorisnika(sessionStorage.getItem("vlasnik"),sessionStorage.getItem("nazivSmestaja"),this.selectedPreporukaNaziv).subscribe((slike: SlikaPreporuke[]) => {
    this.slikePrep = slike;

    const promises = this.slikePrep.map(sl =>
      this.slikaPreporukeService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
        .then(slikaBlob => {
          const slika = new File([slikaBlob], sl.nazivSlike, { type: slikaBlob.type });
          this.slikePrepFajlovi.push(slika);
        })
    );

    Promise.all(promises).then(() => {
      console.log('Sve slike su učitane.');
    }).catch(error => {
      console.error('Greška prilikom učitavanja slika:', error);
    });
  });
}

sanitizedImageUrl(file: File): SafeUrl {
  const objectUrl = URL.createObjectURL(file);
  return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
}

pomocInitMapPlusSlike(){
  this.pomocInitializeMap();
  this.ucitajSlikePreporuke();
}


pomocInitializeMap() {
  this.preporukaService.dohvatiJednuPreporuku(sessionStorage.getItem("vlasnik"),this.smestaj.nazivSmestaja,this.selectedPreporukaNaziv).subscribe((p1: Preporuka) => {
    this.selectedPreporuka=p1;

    if (this.marker2) {
      this.marker2.remove(); // Uklanja marker2 sa mape
      this.marker2 = undefined; // Resetovanje reference na marker
    }

    const pinBlue = new L.Icon({
      iconUrl: '../../assets/pinBlue.png',
      iconSize: [25, 41],  // Prilagodi veličinu ikone
      iconAnchor: [12, 41],  // Prilagodi tačku sidrišta
      popupAnchor: [1, -34],  // Prilagodi tačku za popup prozor
    });

    if (this.selectedPreporuka && this.selectedPreporuka.lat !== undefined && this.selectedPreporuka.lng !== undefined) {
      if (this.map) {
        // Ako marker vec postoji, azuriraj njegovu poziciju
        if (this.marker2) {
          this.marker2.setLatLng([this.selectedPreporuka.lat, this.selectedPreporuka.lng]);
        } else {
          // Ako marker ne postoji, kreiraj novi
          this.marker2 = L.marker([this.selectedPreporuka.lat, this.selectedPreporuka.lng], { draggable: false, icon:pinBlue }).addTo(this.map);
        }

      }
    } else {
      console.error("LatLng vrednosti za selectedPreporuka nisu definisane");
    }
  });
}


initializeMap(): void {
  if (!this.selectedPreporuka || !this.selectedPreporuka.lat || !this.selectedPreporuka.lng) {
    console.error('selectedPreporuka is not properly defined');
    return;
  }

  if (!this.map) {
    this.map = L.map('map').setView([this.smestaj.lat, this.smestaj.lng], 13);

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

    this.marker = L.marker([this.smestaj.lat, this.smestaj.lng], { draggable: false, icon:pinRed  }).addTo(this.map);
    this.marker2 = L.marker([this.selectedPreporuka.lat, this.selectedPreporuka.lng], { draggable: false, icon:pinBlue  }).addTo(this.map);

    this.map.invalidateSize();
  }
}
////////////////////////////////////
  currentPage: number = 1;
  rowsPerPage: number = 5;

  get paginatedCoupons() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.kuponi.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.kuponi.length / this.rowsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  preuzmiFajl(fajlIme: string) {
    const url = `http://localhost:4000/files/${fajlIme}`;
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fajlIme; // This will trigger the download
    // Append link to the body and simulate a click
    document.body.appendChild(link);
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);
  }



  //preuzmiFajl(fajlIme: string) {
  //  const url = `http://localhost:4000/files/${fajlIme}`;
  //  const link = document.createElement('a');
  //  link.href = url;
  //  link.download = fajlIme; // Postavi ime fajla za preuzimanje
  //  document.body.appendChild(link); // Dodaj link u DOM
  //  link.click(); // Programski klikni na link da pokreneš preuzimanje
  //  document.body.removeChild(link); // Ukloni link iz DOM-a
  //}


  get maxPage(): number {
    return Math.ceil(this.kuponi.length / this.rowsPerPage);
  }








}
