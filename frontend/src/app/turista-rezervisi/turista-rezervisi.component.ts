import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import { UserService } from '../services/user.service';
import { SmestajService } from '../services/smestaj.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import { Router } from '@angular/router';
import Smestaj from '../models/smestaj';
import SlikaSmestaja from '../models/slikaSmestaja';
import Rezervacija from '../models/rezervacija';
import { RezervacijaService } from '../services/rezervacija.service';
import * as L from 'leaflet';
import { EmailService } from '../services/email.service';


@Component({
  selector: 'app-turista-rezervisi',
  templateUrl: './turista-rezervisi.component.html',
  styleUrls: ['./turista-rezervisi.component.css']
})
export class TuristaRezervisiComponent {

  constructor(private emailService:EmailService,private rezervacijaService:RezervacijaService,private sanitizer: DomSanitizer,private slikaSmestajaService:SlikaSmestajaService,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;
  vlasnik: User;
  smestaj: Smestaj;
  slike: SlikaSmestaja[]=[];
  slikeFajlovi: File[] = [];
  rezervacijeSmestajaUBuducnosti: Rezervacija[]=[];

  datumOd: Date | null = null;
  datumDo: Date | null = null;
  danasnjiDatum: Date = new Date();  // Danasnji datum


  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  ngOnInit(): void {
    this.danasnjiDatum.setHours(0, 0, 0, 0);  // Setuj na ponoc

    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("vlasnik")).subscribe((u2: User) => {
      this.vlasnik=u2;
    })

    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='turista') this.router.navigate([''])
      this.korisnik = u1;

      this.smestajService.dohvatiSmestaj(sessionStorage.getItem("vlasnik"),sessionStorage.getItem("nazivSmestaja")).subscribe((s1: Smestaj) => {
        this.smestaj = s1;
        this.initializeMap();
      })

      this.ucitajSlike();

      this.rezervacijaService.dohvatiRezervacijeSmestaja(sessionStorage.getItem("vlasnik"), sessionStorage.getItem("nazivSmestaja")).subscribe((r1: Rezervacija[]) => {
        const danasnjiDatum = new Date();
        danasnjiDatum.setHours(0, 0, 0, 0); // Postavi vreme na ponoc (00:00:00)

        this.rezervacijeSmestajaUBuducnosti = r1.filter(rezervacija => {
          const datumDo = new Date(rezervacija.datumDo);
          datumDo.setHours(0, 0, 0, 0); // Postavi vreme na ponoc za datumDo

          return datumDo >= danasnjiDatum; // Poredjenje samo po godini, mesecu i danu
        });

        // ovde dalje za datume
      })
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  initializeMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([this.smestaj.lat, this.smestaj.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map);

      const pinRed = new L.Icon({
        iconUrl: '../../assets/pinRed.png',
        iconSize: [25, 41],  // Prilagodi velicinu ikone
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],  // Prilagodi tacku za popup prozor
      });

      if (this.smestaj.lat && this.smestaj.lng) {
        this.marker = L.marker([this.smestaj.lat, this.smestaj.lng], { draggable: false, icon:pinRed  }).addTo(this.map);
      }
    }
  }

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

  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }



  // Filter za "datum od"
  filterOd = (d: Date | null): boolean => {
    if (!d) return false;

    const date = new Date(d);
    date.setHours(0, 0, 0, 0);

    // onemogucavanje proslih datuma
    if (date < this.danasnjiDatum ) {
      return false;
    }
    if (this.datumDo!=null){
      this.datumDo=null;
    }

    // onemogucavanje datuma koji obuhvataju postojece rezervacije
    return !this.rezervacijeSmestajaUBuducnosti.some(rezervacija => {
      const rezervacijaOd = new Date(rezervacija.datumOd);
      const rezervacijaDo = new Date(rezervacija.datumDo);
      rezervacijaOd.setHours(0, 0, 0, 0);
      rezervacijaDo.setHours(0, 0, 0, 0);
      return date >= rezervacijaOd && date <= rezervacijaDo;
    });
  };

  // Filter za "datum do"
  filterDo = (d: Date | null): boolean => {
    if (!d || !this.datumOd) return false;

    const date = new Date(d);
    date.setHours(0, 0, 0, 0);

    // Onemogucavanje proslih datuma i onih pre datumOd
    if (date < this.danasnjiDatum || date < this.datumOd) {
      return false;
    }

    let najmanjiDatum=null;
    this.rezervacijeSmestajaUBuducnosti.forEach(rez => {
      if ((new Date(rez.datumOd)) > this.datumOd && najmanjiDatum==null){
        najmanjiDatum=new Date(rez.datumOd);
      }
      else if ((new Date(rez.datumOd)) > this.datumOd && (new Date(rez.datumOd))<najmanjiDatum){
        najmanjiDatum=new Date(rez.datumOd);
      }
    });
    if (date>=najmanjiDatum && najmanjiDatum!=null){
      return false;
    }

    // Onemogucavanje datuma koji obuhvataju postojece rezervacije
    return !this.rezervacijeSmestajaUBuducnosti.some(rezervacija => {
      const rezervacijaOd = new Date(rezervacija.datumOd);
      const rezervacijaDo = new Date(rezervacija.datumDo);
      rezervacijaOd.setHours(0, 0, 0, 0);
      rezervacijaDo.setHours(0, 0, 0, 0);
      return date >= rezervacijaOd && date <= rezervacijaDo;
    });
  };


  rezervisi() {
    if (this.datumOd && this.datumDo) {
      let datumOdString = this.datumOd.toISOString().split('T')[0];
      let datumDoString = this.datumDo.toISOString().split('T')[0];

      this.rezervacijaService.rezervisi(this.korisnik.korisnickoIme, sessionStorage.getItem("vlasnik"), datumDoString, datumOdString, sessionStorage.getItem("nazivSmestaja"))
        .subscribe((resp) => {
          this.emailService.sendEmail(this.korisnik.email,"smestaj rezervisan","rezervisali ste smestaj"+sessionStorage.getItem("nazivSmestaja")+ " od:"+datumOdString+" do "+datumDoString+" koordinate:"+this.smestaj.lat+" "+this.smestaj.lng).subscribe((res) => {
          })
          location.reload();
        });
    }
  }

  // Funkcija za formatiranje datuma u lokalni string
  formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mesec se vraća u opsegu 0-11
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }





}
