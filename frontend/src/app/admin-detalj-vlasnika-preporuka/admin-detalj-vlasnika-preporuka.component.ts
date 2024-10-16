import { Component } from '@angular/core';
import Preporuka from '../models/preporuka';
import User from '../models/user';
import { EmailService } from '../services/email.service';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { KuponService } from '../services/kupon.service';
import { PreporukaService } from '../services/preporuka.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { SmestajService } from '../services/smestaj.service';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';
import * as L from 'leaflet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import SlikaPreporuke from '../models/slikaPreporuke';
import Smestaj from '../models/smestaj';


@Component({
  selector: 'app-admin-detalj-vlasnika-preporuka',
  templateUrl: './admin-detalj-vlasnika-preporuka.component.html',
  styleUrls: ['./admin-detalj-vlasnika-preporuka.component.css']
})
export class AdminDetaljVlasnikaPreporukaComponent {

  constructor(private slikaPreporukeService:SlikaPreporukeService,private sanitizer: DomSanitizer,private emailService:EmailService,private slikeSmestajaService:SlikaSmestajaService,private slikePreporukaService:SlikaPreporukeService,private smestajService:SmestajService,private rezervacijaService:RezervacijaService,private preporukaService:PreporukaService,private kuponService:KuponService,private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;
  vlasnik: User;

  preporuka: Preporuka;

  slike : SlikaPreporuke[] = [];
  slikeFajlovi: File[] = [];
  nazSmestaja:string=''
  smestaj:Smestaj;

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private marker2: L.Marker | undefined;

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='admin') this.router.navigate([''])
      this.korisnik = u1;
    })
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((u2: User) => {
      this.vlasnik = u2;
    })
    this.preporukaService.dohvatiJednuPreporuku(sessionStorage.getItem("detaljanPregledIzabranogKorisnika"),sessionStorage.getItem("detaljanPregledIzabranogKorisnikaSmestaj"),sessionStorage.getItem("detaljanPregledIzabranogKorisnikaPreporuka")).subscribe((p1: Preporuka) => {
      this.preporuka = p1;

      this.smestajService.dohvatiSmestaj(sessionStorage.getItem("detaljanPregledIzabranogKorisnika"),sessionStorage.getItem("detaljanPregledIzabranogKorisnikaSmestaj")).subscribe((s1: Smestaj) => {
        this.smestaj=s1;

        this.ucitajSlike();
        this.initializeMap();
      });

      this.nazivPreporukeUpdate=this.preporuka.nazivPreporuke;
      this.opisPreporukeUpdate=this.preporuka.opisPreporuke;
      this.tipUpdate=this.preporuka.tip;
    })
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
        popupAnchor: [1, -34],  // Prilagodi tačku za popup prozor
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
    this.slikaPreporukeService.dohvatiSlikeZaPreporukuKorisnika(sessionStorage.getItem("detaljanPregledIzabranogKorisnika"),sessionStorage.getItem("detaljanPregledIzabranogKorisnikaSmestaj"),sessionStorage.getItem("detaljanPregledIzabranogKorisnikaPreporuka")).subscribe((slike: SlikaPreporuke[]) => {
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

  deleteImage(imageName: string): void {
    this.slikaPreporukeService.obrisiSliku(this.preporuka.korisnickoIme, this.preporuka.nazivSmestaja, imageName).subscribe((resp) => {
        alert('deleted '+imageName)
        this.emailService.sendEmail(this.vlasnik.email,"slika preporuke izbrisana","slika za preporuku izbrisana"+this.preporuka.nazivPreporuke).subscribe((resp) => {
        });
        location.reload();
    });
  }

  izbrisiPreporuku(): void {
    if (confirm('OVA AKCIJA JE NEPOVRATNA! Da li zelite da izbrisete smestaj?')) {
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
    this.emailService.sendEmail(this.vlasnik.email,"preporuka izbrisana","preporuka je izbrisana:"+this.preporuka.nazivPreporuke).subscribe((resp) => {
    });
    this.router.navigate(['adminDetaljVlasnika'])
  }


  nazivPreporukeUpdate=''
  opisPreporukeUpdate=''
  tipUpdate=''

  sacuvaj(nazivPreporukeUpdate:string,opisPreporukeUpdate:string,tipUpdate:string){
    this.slikaPreporukeService.izmeniNaSlikamaNazivPreporuke(this.preporuka.korisnickoIme,this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke,nazivPreporukeUpdate).subscribe((resp) => {
      this.preporukaService.izmeniInfoPreporuke(this.preporuka.korisnickoIme,this.preporuka.nazivSmestaja,this.preporuka.nazivPreporuke,nazivPreporukeUpdate,opisPreporukeUpdate,tipUpdate).subscribe((resp) => {
        sessionStorage.setItem("detaljanPregledIzabranogKorisnikaPreporuka", nazivPreporukeUpdate)
        this.emailService.sendEmail(this.vlasnik.email,"promena informacija preporuke","informacije za preporuku promenjene"+this.preporuka.nazivPreporuke+" u "+nazivPreporukeUpdate).subscribe((resp) => {
        });
        location.reload();
      })
    })
  }







}
