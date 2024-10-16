import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import Kupon from '../models/kupon';
import { KuponService } from '../services/kupon.service';
import { PreporukaService } from '../services/preporuka.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { SmestajService } from '../services/smestaj.service';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import { forkJoin } from 'rxjs';
import Rezervacija from '../models/rezervacija';
import { EmailService } from '../services/email.service';
import Smestaj from '../models/smestaj';
import Preporuka from '../models/preporuka';


@Component({
  selector: 'app-admin-detalj-vlasnika',
  templateUrl: './admin-detalj-vlasnika.component.html',
  styleUrls: ['./admin-detalj-vlasnika.component.css']
})
export class AdminDetaljVlasnikaComponent {

  constructor(private emailService:EmailService,private slikeSmestajaService:SlikaSmestajaService,private slikePreporukaService:SlikaPreporukeService,private smestajService:SmestajService,private rezervacijaService:RezervacijaService,private preporukaService:PreporukaService,private kuponService:KuponService,private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;
  vlasnik: User;

  smestajiVlasnika:Smestaj[]=[]
  preporukeVlasnika:Preporuka[]=[]

  korisnickoIme: string=''
  ime: string=''
  prezime: string=''
  kontaktTelefon: string=''
  email: string=''

  rezervacije:Rezervacija[]=[]

  kuponi:Kupon[]=[]

  opisKupona:string='';
  naslovKupona:string='';

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='admin') this.router.navigate([''])
      this.korisnik = u1;
    })
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((u2: User) => {
      this.vlasnik = u2;

      this.korisnickoIme=u2.korisnickoIme
      this.ime=u2.ime
      this.prezime=u2.prezime
      this.kontaktTelefon=u2.kontaktTelefon
      this.email=u2.email
    })
    this.kuponService.dohvatiKuponeZaVlasnika(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((k1: Kupon[]) => {
      this.kuponi=k1;
    })
    this.rezervacijaService.dohvatiRezervacijeVlasnika(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((r1: Rezervacija[]) => {
      this.rezervacije = r1;
    })
    this.smestajService.dohvatiSmestajeZaVlasnika(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((s1: Smestaj[]) => {
      this.smestajiVlasnika = s1;
    })
    this.preporukaService.dohvatiPreporukeZaVlasnika(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((p1: Preporuka[]) => {
      this.preporukeVlasnika = p1;
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }


  promeniKorisnickoIme(){
    if (this.vlasnik.korisnickoIme==this.korisnickoIme){return}

    forkJoin([
      this.kuponService.promeniKorisnickoImeNaKuponima(this.vlasnik.korisnickoIme, this.korisnickoIme),
      this.preporukaService.promeniKorisnickoImeNaPreporukama(this.vlasnik.korisnickoIme, this.korisnickoIme),
      this.rezervacijaService.promeniKorisnickoImeNaRezervacijama(this.vlasnik.korisnickoIme, this.korisnickoIme),
      this.smestajService.promeniKorisnickoImeNaSmestajima(this.vlasnik.korisnickoIme, this.korisnickoIme),
      this.slikePreporukaService.promeniKorisnickoImeNaSlikamaPreporuka(this.vlasnik.korisnickoIme, this.korisnickoIme),
      this.slikeSmestajaService.promeniKorisnickoImeNaSlikamaSmestaja(this.vlasnik.korisnickoIme, this.korisnickoIme)
    ]).subscribe(([kuponRes, preporukaRes, rezervacijaRes, smestajRes, slikePreporukaRes, slikeSmestajaRes]) => {
      // Svi pozivi su zavrseni
      console.log('Sve promene su uspešno završene.');

      this.userService.promeniKorisnickoIme(this.vlasnik.korisnickoIme,this.korisnickoIme).subscribe((res) => {
        sessionStorage.setItem("detaljanPregledIzabranogKorisnika", this.korisnickoIme)
        this.emailService.sendEmail(this.vlasnik.email,"vase korisnicko ime je promenjeno","novo korisnicko ime za login: "+this.korisnickoIme).subscribe((res) => {
        })
        location.reload();
      })

    });


  }

  promeniIme(){
    this.userService.promeniIme(this.vlasnik.korisnickoIme,this.ime).subscribe((res) => {
      this.emailService.sendEmail(this.vlasnik.email,"vase ime je promenjeno","novo ime: "+this.ime).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniPrezime(){
    this.userService.promeniPrezime(this.vlasnik.korisnickoIme,this.prezime).subscribe((res) => {
      this.emailService.sendEmail(this.vlasnik.email,"vase prezime je promenjeno","novo prezime: "+this.prezime).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniKontaktTelefon(){
    this.userService.promeniKontaktTelefon(this.vlasnik.korisnickoIme,this.kontaktTelefon).subscribe((res) => {
      this.emailService.sendEmail(this.vlasnik.email,"vas kontakt telefon je promenjen","novi kontakt telefon: "+this.kontaktTelefon).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniEmail(){
    this.userService.promeniEmail(this.vlasnik.korisnickoIme,this.email).subscribe((res) => {
      this.emailService.sendEmail(this.vlasnik.email,"vasa email adresa je promenjana","nova email adresa: "+this.email).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniKupon(fajlIme:string,korisnickoIme:string,opis:string,naslov:string){
    this.kuponService.promeniKuponOpisNaslov(fajlIme,korisnickoIme,opis,naslov).subscribe((res)=>{
      this.emailService.sendEmail(this.vlasnik.email,"promenjen kupon","informacije o kuponu promenjene:"+naslov+" "+opis+" za"+fajlIme).subscribe((res) => {
      })
      location.reload();
    })
  }

  obrisiKupon(korisnickoIme: string, fajlIme: string,naslov:string) {
    this.kuponService.obrisiKupon(korisnickoIme, fajlIme).subscribe(response => {
      this.emailService.sendEmail(this.vlasnik.email,"obrisan kupon","vas kupon je obrisan:"+naslov).subscribe((res) => {
      })
      location.reload();
      alert('Kupon je uspešno obrisan.');
    });
  }

  oktaziRezervaciju(r:Rezervacija){
    this.rezervacijaService.ukloniRezervaciju(r.turista,r.vlasnik,r.datumOd,r.datumDo,r.nazivSmestaja).subscribe((res) => {
      this.emailService.sendEmail(this.vlasnik.email,"otkazana rezervacija","rezervacija datuma"+r.datumOd+"do"+r.datumDo+" za smestaj: "+r.nazivSmestaja+"je otkazana").subscribe((res) => {
      })
      location.reload();
    })
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


  detaljanPrikazSmestaja(s:Smestaj){
    //sessionStorage.setItem("detaljanPregledIzabranogKorisnika",this.vlasnik.korisnickoIme)
    sessionStorage.setItem("detaljanPregledIzabranogKorisnikaSmestaj",s.nazivSmestaja)

    this.router.navigate(['adminDetaljVlasnikaSmestaj'])
  }

  detaljanPrikazPreporuke(p:Preporuka){
    //sessionStorage.setItem("detaljanPregledIzabranogKorisnika",this.vlasnik.korisnickoIme)
    sessionStorage.setItem("detaljanPregledIzabranogKorisnikaSmestaj",p.nazivSmestaja)
    sessionStorage.setItem("detaljanPregledIzabranogKorisnikaPreporuka",p.nazivPreporuke)

    this.router.navigate(['adminDetaljVlasnikaPreporuka'])
  }



}
