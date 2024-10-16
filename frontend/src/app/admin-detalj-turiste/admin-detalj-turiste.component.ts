import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import { forkJoin } from 'rxjs';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';
import { SmestajService } from '../services/smestaj.service';
import { KuponService } from '../services/kupon.service';
import { PreporukaService } from '../services/preporuka.service';
import { RezervacijaService } from '../services/rezervacija.service';
import Rezervacija from '../models/rezervacija';
import { EmailService } from '../services/email.service';


@Component({
  selector: 'app-admin-detalj-turiste',
  templateUrl: './admin-detalj-turiste.component.html',
  styleUrls: ['./admin-detalj-turiste.component.css']
})
export class AdminDetaljTuristeComponent {

  constructor(private emailService:EmailService,private slikeSmestajaService:SlikaSmestajaService,private slikePreporukaService:SlikaPreporukeService,private smestajService:SmestajService,private rezervacijaService:RezervacijaService,private preporukaService:PreporukaService,private kuponService:KuponService,private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;
  turista: User;

  korisnickoIme: string=''
  ime: string=''
  prezime: string=''
  kontaktTelefon: string=''
  email: string=''

  rezervacije:Rezervacija[]=[]

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='admin') this.router.navigate([''])
      this.korisnik = u1;
    })
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((u2: User) => {
      this.turista = u2;

      this.korisnickoIme=u2.korisnickoIme
      this.ime=u2.ime
      this.prezime=u2.prezime
      this.kontaktTelefon=u2.kontaktTelefon
      this.email=u2.email
    })
    this.rezervacijaService.dohvatiRezervacijeTuriste(sessionStorage.getItem("detaljanPregledIzabranogKorisnika")).subscribe((r1: Rezervacija[]) => {
      const danasnjiDatum = new Date();
      danasnjiDatum.setHours(0, 0, 0, 0); // postavi vreme na ponoc (00:00:00)

      this.rezervacije = r1.filter(rezervacija => {
        const datumDo = new Date(rezervacija.datumDo);
        datumDo.setHours(0, 0, 0, 0); // Postavi vreme na ponoc za datumDo

        return datumDo >= danasnjiDatum; // Poredjenje samo po godini, mesecu i danu
      });
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }


  promeniKorisnickoIme(){
    if (this.turista.korisnickoIme==this.korisnickoIme){return}

    forkJoin([
      this.kuponService.promeniKorisnickoImeNaKuponima(this.turista.korisnickoIme, this.korisnickoIme),
      this.preporukaService.promeniKorisnickoImeNaPreporukama(this.turista.korisnickoIme, this.korisnickoIme),
      this.rezervacijaService.promeniKorisnickoImeNaRezervacijama(this.turista.korisnickoIme, this.korisnickoIme),
      this.smestajService.promeniKorisnickoImeNaSmestajima(this.turista.korisnickoIme, this.korisnickoIme),
      this.slikePreporukaService.promeniKorisnickoImeNaSlikamaPreporuka(this.turista.korisnickoIme, this.korisnickoIme),
      this.slikeSmestajaService.promeniKorisnickoImeNaSlikamaSmestaja(this.turista.korisnickoIme, this.korisnickoIme)
    ]).subscribe(([kuponRes, preporukaRes, rezervacijaRes, smestajRes, slikePreporukaRes, slikeSmestajaRes]) => {
      // Svi pozivi su završeni
      console.log('Sve promene su uspešno završene.');

      this.userService.promeniKorisnickoIme(this.turista.korisnickoIme,this.korisnickoIme).subscribe((res) => {
        sessionStorage.setItem("detaljanPregledIzabranogKorisnika", this.korisnickoIme)
        this.emailService.sendEmail(this.turista.email,"vase korisnicko ime je promenjeno","novo korisnicko ime za login: "+this.korisnickoIme).subscribe((res) => {
        })
        location.reload();
      })

    });


  }

  promeniIme(){
    this.userService.promeniIme(this.turista.korisnickoIme,this.ime).subscribe((res) => {
      this.emailService.sendEmail(this.turista.email,"vase ime je promenjeno","novo ime: "+this.ime).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniPrezime(){
    this.userService.promeniPrezime(this.turista.korisnickoIme,this.prezime).subscribe((res) => {
      this.emailService.sendEmail(this.turista.email,"vase prezime je promenjeno","novo prezime: "+this.prezime).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniKontaktTelefon(){
    this.userService.promeniKontaktTelefon(this.turista.korisnickoIme,this.kontaktTelefon).subscribe((res) => {
      this.emailService.sendEmail(this.turista.email,"vas kontakt telefon je promenjen","novi kontakt telefon: "+this.kontaktTelefon).subscribe((res) => {
      })
      location.reload();
    })
  }

  promeniEmail(){
    this.userService.promeniEmail(this.turista.korisnickoIme,this.email).subscribe((res) => {
      this.emailService.sendEmail(this.turista.email,"vasa email adresa je promenjana","nova email adresa: "+this.email).subscribe((res) => {
      })
      location.reload();
    })
  }

  oktaziRezervaciju(r:Rezervacija){
    this.rezervacijaService.ukloniRezervaciju(r.turista,r.vlasnik,r.datumOd,r.datumDo,r.nazivSmestaja).subscribe((res) => {
      this.emailService.sendEmail(this.turista.email,"otkazana rezervacija","vasa rezervacija datuma"+r.datumOd+"do"+r.datumDo+" za smestaj: "+r.nazivSmestaja+"je otkazana").subscribe((res) => {
      })
      location.reload();
    })
  }


}
