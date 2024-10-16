import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import User from '../models/user';
import { EmailService } from '../services/email.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private emailService:EmailService,private router: Router, private userService: UserService,private http: HttpClient) { }

  korisnik: User;
  turisti_i_vlasnici:User[]=[]
  turisti_i_vlasnici_MENJANI:User[]=[]

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='admin') this.router.navigate([''])
      this.korisnik = u1;
    })
    this.userService.dohvatiTuriste_I_Vlasnike().subscribe((u2: User[]) => {
      this.turisti_i_vlasnici = u2;
      this.turisti_i_vlasnici_MENJANI = u2;
    })

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  promeniLozinku(){
    this.router.navigate(['promenaLozinke'])
  }

  promeniPodatke(){
    this.router.navigate(['promenaPodataka'])
  }

  filterIme:string='';
  filterPrezime:string='';
  filterTip:string='';
  filterStatus:string='';

  filter_turiste_i_vlasnike(){
    this.turisti_i_vlasnici_MENJANI=this.turisti_i_vlasnici;
    if (this.filterIme!="")
    this.turisti_i_vlasnici_MENJANI=this.turisti_i_vlasnici_MENJANI.filter(kor=>kor.ime.includes(this.filterIme));
    if (this.filterPrezime!="")
    this.turisti_i_vlasnici_MENJANI=this.turisti_i_vlasnici_MENJANI.filter(kor=>kor.prezime.includes(this.filterPrezime));
    if (this.filterTip!="")
    this.turisti_i_vlasnici_MENJANI=this.turisti_i_vlasnici_MENJANI.filter(kor=>kor.tip.includes(this.filterTip));
    if (this.filterStatus!="")
    this.turisti_i_vlasnici_MENJANI=this.turisti_i_vlasnici_MENJANI.filter(kor=>kor.status.includes(this.filterStatus));
  }

  sortDesc1() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.ime < kor2.ime) {
        return -1;
      }
      else {
        if (kor1.ime == kor2.ime) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.ime > kor2.ime) {
        return -1;
      }
      else {
        if (kor1.ime == kor2.ime) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.prezime < kor2.prezime) {
        return -1;
      }
      else {
        if (kor1.prezime == kor2.prezime) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.prezime > kor2.prezime) {
        return -1;
      }
      else {
        if (kor1.prezime == kor2.prezime) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
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
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
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

  sortDesc4() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.status < kor2.status) {
        return -1;
      }
      else {
        if (kor1.status == kor2.status) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc4() {
    this.turisti_i_vlasnici_MENJANI.sort((kor1, kor2) => {
      if (kor1.status > kor2.status) {
        return -1;
      }
      else {
        if (kor1.status == kor2.status) {
          return 0;
        }
        else return 1;
      }
    })
  }


  aktiviraj(korisnickoIme:string,status:string,email:string){
    if (status==='blokiran'){
      this.userService.promeniStatusKorisniku(korisnickoIme,'aktivan').subscribe((resp) => {
        this.emailService.sendEmail(email, "nalog aktiviran", "vas nalog je aktiviran")
        alert('korisnikov nalog je ponovo aktiviran')
        location.reload();
      })
    }
    else alert('vec je aktivan')
  }

  deaktiviraj(korisnickoIme:string,status:string,email:string){
    if (status==='aktivan'){
      this.userService.promeniStatusKorisniku(korisnickoIme,'blokiran').subscribe((resp) => {
        this.emailService.sendEmail(email, "nalog blokiran", "vas nalog je blokiran")
        alert('korisnik je blokiran')
        location.reload();
      })
    }
    else alert('vec je blokiran')
  }

  detaljanPregled(korisnickoIme:string,tip:string){
    sessionStorage.setItem("detaljanPregledIzabranogKorisnika", korisnickoIme)
    if(tip=='vlasnik'){
      this.router.navigate(['adminDetaljVlasnika'])
    }
    else if(tip=='turista'){
      this.router.navigate(['adminDetaljTuriste'])
    }
  }


}
