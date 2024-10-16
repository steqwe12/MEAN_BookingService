import { Component } from '@angular/core';
import User from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent {

  constructor(private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;

  staraLozinka:string=''
  novaLozinka:string=''

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      this.korisnik = u1;
    })

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  promeniLozinku(){
    if (this.korisnik.lozinka==this.staraLozinka && this.lozinkaok){
      this.userService.promLozinkuZaEmail(this.korisnik.email,this.novaLozinka).subscribe((res) => {

        sessionStorage.clear();
        this.router.navigate([''])
      })
    }
  }


  lozinkaok:boolean=false;
  proveriLozinku(){
    let regex0= /^[^\s]{8,14}$/
    let regex1= /^[a-zA-Z].{7,13}$/
    let regex2= /[A-Z]/
    let regex3= /[0-9]/
    let regex4= /[!@#$%^&*.]/
    let regex5= /^(?:(.)(?!\1))*$/

     let tst0=this.novaLozinka.match(regex0);
     let tst1=this.novaLozinka.match(regex1);
     let tst2=this.novaLozinka.match(regex2);
     let tst3=this.novaLozinka.match(regex3);
     let tst4=this.novaLozinka.match(regex4);
     let tst5=this.novaLozinka.match(regex5);

     if (!tst1 || !tst2 || !tst3 || !tst4 || !tst5 || !tst0) { this.lozinkaok=false;}
     else {this.lozinkaok=true;}
   }




}
