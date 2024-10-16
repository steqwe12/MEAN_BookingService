import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';

@Component({
  selector: 'app-promena-podataka',
  templateUrl: './promena-podataka.component.html',
  styleUrls: ['./promena-podataka.component.css']
})
export class PromenaPodatakaComponent {

  constructor(private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;

  ime:string=''
  prezime:string=''
  kontaktTelefon:string=''
  email:string=''
  korisnickoIme:string=''

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      this.korisnik = u1;

      this.ime=u1.ime;
      this.prezime=u1.prezime
      this.kontaktTelefon=u1.kontaktTelefon
      this.email=u1.email
      this.korisnickoIme=u1.korisnickoIme
    })

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  promeniPodatke(){
    this.userService.promeniIme(this.korisnik.korisnickoIme,this.ime).subscribe((res) => {
    })
    this.userService.promeniPrezime(this.korisnik.korisnickoIme,this.prezime).subscribe((res) => {
    })
    this.userService.promeniKontaktTelefon(this.korisnik.korisnickoIme,this.kontaktTelefon).subscribe((res) => {
    })

    sessionStorage.clear();
    this.router.navigate([''])
  }

  PromeniEmail(){
    if (this.emailok){
      this.userService.promeniEmail(this.korisnik.korisnickoIme,this.email).subscribe((res) => {
        sessionStorage.clear();
        this.router.navigate([''])
      })
    }
  }

  emailok:boolean=false;
  proveriEmail(){
    let regex1 = /^[^\s]{6,30}[@][a-z]{3,10}[.][a-z]{2,6}$/
    let regex2 = /^[a-zA-Z].{5,29}[@][a-z]{3,10}[.][a-z]{2,6}$/
    let regex3 = /^[a-zA-Z1-9.]{5,29}[a-zA-Z1-9][@][a-z]{3,10}[.][a-z]{2,6}$/

    let tst0=this.email.match(regex1);
    let tst1=this.email.match(regex2);
    let tst2=this.email.match(regex3);

    if(!tst1 || !tst2 || !tst0) {this.emailok=false;}
    else { this.emailok=true;   }
    // da proverim iz baze da li je jedinstveno
    this.userService.dohvatiKorisnikaZaEmail(this.email).subscribe((korisnik: User)=>{
        if (korisnik != null){
          this.emailok=false;
      }
    })
  }

  //PromeniKorisnickoIme(){
  //  this.userService.promeniKorisnickoIme(this.korisnik.korisnickoIme,this.korisnickoIme).subscribe((res) => {
  //  })
  //
  //  sessionStorage.clear();
  //  this.router.navigate([''])
  // }



}
