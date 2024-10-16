import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import User from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent {

  constructor(private userService: UserService, private router: Router){}

  ngOnInit():void{

  }

  usernameReg:string;
  passwordReg:string;
  passwordRegConf:string; // za proveru lozinke 2 puta uneti
  nameReg:string;
  secnameReg:string;
  phoneReg:string;
  emailReg:string;
  typeReg:string="turista";

  errorPasswordConf: string;
  errorUsername:string;
  errorEmail:string;

  regMessErrButt=""

  register(){
    if (this.lozinkaconfok && this.korimeok && this.emailok && this.lozinkaok){
      this.regMessErrButt=""
      this.userService.registruj(this.usernameReg, this.passwordReg, this.nameReg, this.secnameReg, this.phoneReg, this.emailReg, this.typeReg).subscribe(respObj => {
        this.router.navigate([''])
      })
    }
    else this.regMessErrButt="nesto niste uneli ispravno u formi za registraciju"
  }


  lozinkaconfok:boolean=false;
  proveriLozinkuConf(){
    if (this.passwordRegConf===this.passwordReg) {this.errorPasswordConf="lozinke se podudaraju"; this.lozinkaconfok=true;}
    else { this.errorPasswordConf="lozinke se ne podudaraju"; this.lozinkaconfok=false;}
  }

  lozinkaok:boolean=false;
  proveriLozinku(){
    let regex0= /^[^\s]{8,14}$/
    let regex1= /^[a-zA-Z].{7,13}$/
    let regex2= /[A-Z]/
    let regex3= /[0-9]/
    let regex4= /[!@#$%^&*.]/
    let regex5= /^(?:(.)(?!\1))*$/

     let tst0=this.passwordReg.match(regex0);
     let tst1=this.passwordReg.match(regex1);
     let tst2=this.passwordReg.match(regex2);
     let tst3=this.passwordReg.match(regex3);
     let tst4=this.passwordReg.match(regex4);
     let tst5=this.passwordReg.match(regex5);

     if (!tst1 || !tst2 || !tst3 || !tst4 || !tst5 || !tst0) { this.lozinkaok=false;}
     else {this.lozinkaok=true;}
   }

  korimeok:boolean=false;
  proveriKorIme(){
    let regex1 = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/

    let tst0=this.usernameReg.match(regex1);

    if(!tst0) {this.errorUsername="pogresan format kor imena"; this.korimeok=false;}
    else{ this.errorUsername="dobar format kor imena"; this.korimeok=true;}
    this.errorUsername=""
    // da proverim iz baze da li je jedinstveno
    this.userService.dohvatiKorisnikaZaUsername(this.usernameReg).subscribe((korisnik: User)=>{
      if (korisnik != null){
        this.korimeok=false;
        this.errorUsername+=" | korisnik sa istim username-om vec postoji | ";
      }
    })
  }

  emailok:boolean=false;
  proveriEmail(){
    let regex1 = /^[^\s]{6,30}[@][a-z]{3,10}[.][a-z]{2,6}$/
    let regex2 = /^[a-zA-Z].{5,29}[@][a-z]{3,10}[.][a-z]{2,6}$/
    let regex3 = /^[a-zA-Z1-9.]{5,29}[a-zA-Z1-9][@][a-z]{3,10}[.][a-z]{2,6}$/

    let tst0=this.emailReg.match(regex1);
    let tst1=this.emailReg.match(regex2);
    let tst2=this.emailReg.match(regex3);

    if(!tst1 || !tst2 || !tst0) {this.errorEmail="pogresan format emaila"; this.emailok=false;}
    else {this.errorEmail="dobar format emaila"; this.emailok=true;   }
    this.errorEmail=""
    // da proverim iz baze da li je jedinstveno
    this.userService.dohvatiKorisnikaZaEmail(this.emailReg).subscribe((korisnik: User)=>{
        if (korisnik != null){
          this.emailok=false;
          this.errorEmail+=" | korisnik sa email-om vec postoji | ";
      }
    })
  }


}
