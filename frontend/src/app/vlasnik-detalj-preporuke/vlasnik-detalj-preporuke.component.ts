import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SmestajService } from '../services/smestaj.service';
import { Router } from '@angular/router';
import { PreporukaService } from '../services/preporuka.service';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';
import User from '../models/user';
import { UserService } from '../services/user.service';
import Preporuka from '../models/preporuka';
import SlikaPreporuke from '../models/slikaPreporuke';
import * as L from 'leaflet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Smestaj from '../models/smestaj';

@Component({
  selector: 'app-vlasnik-detalj-preporuke',
  templateUrl: './vlasnik-detalj-preporuke.component.html',
  styleUrls: ['./vlasnik-detalj-preporuke.component.css']
})
export class VlasnikDetaljPreporukeComponent {

  constructor(private sanitizer: DomSanitizer,private slikaPreporukeService:SlikaPreporukeService,private preporukaService:PreporukaService ,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;
  preporuka: Preporuka;
  slike : SlikaPreporuke[] = [];
  slikeFajlovi: File[] = [];
  nazSmestaja:string=''
  smestaj:Smestaj;


  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private marker2: L.Marker | undefined;


  ngOnInit(): void {
    this.nazSmestaja=sessionStorage.getItem("nazivSmestaja")
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1 == null) this.router.navigate(['']); // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;

      this.preporukaService.dohvatiJednuPreporuku(this.korisnik.korisnickoIme,sessionStorage.getItem("nazivSmestaja"),sessionStorage.getItem("nazivPreporuke")).subscribe((p1: Preporuka) => {
        this.preporuka=p1

        this.smestajService.dohvatiSmestaj(this.korisnik.korisnickoIme,this.nazSmestaja).subscribe((s1: Smestaj) => {
          this.smestaj=s1;

          this.ucitajSlike();

          this.nazivPreporukeUpdate=this.preporuka.nazivPreporuke;
          this.opisPreporukeUpdate=this.preporuka.opisPreporuke;
          this.tipUpdate=this.preporuka.tip;
          this.initializeMap();

        });
      });
    });
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }


  initializeMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([this.preporuka.lat, this.preporuka.lng], 13);

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

      if (this.preporuka.lat && this.preporuka.lng) {
        this.marker = L.marker([this.preporuka.lat, this.preporuka.lng], { draggable: false, icon:pinBlue}).bindPopup(this.preporuka.nazivPreporuke).addTo(this.map);
      }
      if (this.smestaj.lat && this.smestaj.lng) {
        this.marker2 = L.marker([this.smestaj.lat, this.smestaj.lng], { draggable: false, icon:pinRed }).bindPopup(this.smestaj.nazivSmestaja).addTo(this.map);
      }
    }
  }

  ucitajSlike(): void {
    this.slikaPreporukeService.dohvatiSlikeZaPreporukuKorisnika(this.preporuka.korisnickoIme, this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke).subscribe((slike: SlikaPreporuke[]) => {
      this.slike = slike;

      const promises = this.slike.map(sl =>
        this.slikaPreporukeService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
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


  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  selectedImages : File[] = [];

  selectImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages  = Array.from(input.files);
    }
  }

  unesiNoveSlike() {
    let count = 0;
    const totalImages = this.selectedImages.length;
    if (totalImages===0){
      return;
    }

    this.selectedImages.forEach(slika => {
      let novoImeSlike=`${Date.now()}-${slika.name}`;
      this.slikaPreporukeService.unesiNovuSlikuPreporuke(this.korisnik.korisnickoIme, this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke,novoImeSlike).subscribe((resp) => {
        this.slikaPreporukeService.sacuvajSlikuNaServeru(novoImeSlike,slika).subscribe((resp) => {
          count++;
          if (count === totalImages){
            console.log("Slike uspešno sačuvane:", novoImeSlike);
            alert('Slike uspešno dodate!');
            location.reload();
          }
        });
      });
    });
  }

  deleteImage(imageName: string): void {
    this.slikaPreporukeService.obrisiSliku(this.preporuka.korisnickoIme, this.preporuka.nazivSmestaja, imageName).subscribe((resp) => {
        alert('deleted '+imageName)
        location.reload();
    });
  }

  izbrisiPreporuku(): void {
    if (confirm('OVA AKCIJA JE NEPOVRATNA! Da li želite da izbrišete smeštaj?')) {
      // Pozovi funkciju za brisanje smestaja
      this.obrisiPreporuku();
    }
  }

  obrisiPreporuku(){
    this.slikeFajlovi.forEach((slika: File) => {
      this.slikaPreporukeService.obrisiSliku(this.preporuka.korisnickoIme, this.preporuka.nazivSmestaja, slika.name).subscribe((resp) => {

      });
    });

    this.preporukaService.izbrisiPreporuku(this.preporuka.korisnickoIme,this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke).subscribe((resp) => {

    });

    alert("preporuka obrisan")
    this.router.navigate(['vlasnikUnesiPreporuku'])
  }


  nazivPreporukeUpdate=''
  opisPreporukeUpdate=''
  tipUpdate=''

  sacuvaj(nazivPreporukeUpdate:string,opisPreporukeUpdate:string,tipUpdate:string){
    this.slikaPreporukeService.izmeniNaSlikamaNazivPreporuke(this.preporuka.korisnickoIme,this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke,nazivPreporukeUpdate).subscribe((resp) => {
      this.preporukaService.izmeniInfoPreporuke(this.preporuka.korisnickoIme,this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke,nazivPreporukeUpdate,opisPreporukeUpdate,tipUpdate).subscribe((resp) => {
        sessionStorage.setItem("nazivPreporuke", nazivPreporukeUpdate)
        location.reload();
      })
    })
  }





}
