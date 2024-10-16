import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import Smestaj from '../models/smestaj';
import { SmestajService } from '../services/smestaj.service';
import Rezervacija from '../models/rezervacija';
import { RezervacijaService } from '../services/rezervacija.service';
import { EmailService } from '../services/email.service';
import RezervacijeTuristaEmail from '../models/rezervacijeTuristaEmail';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent {

  constructor(private emailService:EmailService,private rezervacijaService:RezervacijaService,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;
  smestaji:Smestaj[]=[]
  smestajiMENJANI:Smestaj[]=[]
  rezervacije:Rezervacija[]=[]
  rezervacijeTuristaEmail:RezervacijeTuristaEmail[]=[]
  rezervacijeTuristaEmailMENJANI:RezervacijeTuristaEmail[]=[]

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;
      this.smestajService.dohvatiSmestajeZaVlasnika(this.korisnik.korisnickoIme).subscribe((s1: Smestaj[]) => {
        this.smestaji = s1;
        this.smestajiMENJANI=s1;
      })
    })
    this.rezervacijaService.dohvatiRezervacijeVlasnika(sessionStorage.getItem("ulogovanKorisnik")).subscribe((r1: Rezervacija[]) => {
      const danasnjiDatum = new Date();
      danasnjiDatum.setHours(0, 0, 0, 0); // Postavi vreme na ponoc (00:00:00)

      this.rezervacije = r1.filter(rezervacija => {
        const datumDo = new Date(rezervacija.datumDo);
        datumDo.setHours(0, 0, 0, 0); // Postavi vreme na ponoc za datumDo

        return datumDo >= danasnjiDatum; // Poredjenje samo po godini, mesecu i danu
      });

      // ovde
      this.rezervacije.forEach(rez => {
        this.userService.dohvatiKorisnikaZaUsername(rez.turista).subscribe((u2: User) => {
          this.rezervacijeTuristaEmail.push({ rezervacija: rez, email: u2.email });
        });
      });
      this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmail;

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

  unesiNoviSmestaj(){
    this.router.navigate(['vlasnikUnesiSmestaj'])
  }

  pregledSvojihKupona(){
    this.router.navigate(['vlasnikUnesiKupon'])
  }

  pregledSvojihPreporuka(){
    this.router.navigate(['vlasnikUnesiPreporuku'])
  }

 /* currentPage: number = 1;
  rowsPerPage: number = 5;

  get paginatedSmestaji() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.smestaji.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.smestaji.length / this.rowsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  <div>
  <button (click)="prevPage()" [disabled]="currentPage === 1">Prethodna</button>
  <button (click)="nextPage()" [disabled]="currentPage === maxPage">Sledeća</button>
  </div>


  get maxPage(): number {
    return Math.ceil(this.smestaji.length / this.rowsPerPage);
  }*/

  detaljanPrikazSmestaja(nazivSmestaja:string){
    sessionStorage.setItem("nazivSmestaja", nazivSmestaja)
    this.router.navigate(['vlasnikDetaljanPregledSmestaja'])
  }

  otkaziRezervaciju(rez:Rezervacija){
    this.userService.dohvatiKorisnikaZaUsername(rez.turista).subscribe((kor:User)=>{
      let text="Rezervacija za smestaj:"+rez.nazivSmestaja+"koji ste rezervisali od:"+rez.datumOd+" do datuma:"+rez.datumDo +" je otkazana"
      this.emailService.sendEmail(kor.email, 'Otkazana rezervacija', text)
    })
    this.rezervacijaService.ukloniRezervaciju(rez.turista,rez.vlasnik,rez.datumOd,rez.datumDo,rez.nazivSmestaja).subscribe((res) => {
      location.reload();
    })
  }



  filterNazSmest:string='';
  filterOpisSmest:string='';
  filterDrzava:string='';
  filterGrad:string='';

  filter_smestaji(){
    this.smestajiMENJANI=this.smestaji;
    if (this.filterNazSmest!="")
    this.smestajiMENJANI=this.smestajiMENJANI.filter(kor=>kor.nazivSmestaja.includes(this.filterNazSmest));
    if (this.filterOpisSmest!="")
    this.smestajiMENJANI=this.smestajiMENJANI.filter(kor=>kor.opisSmestaja.includes(this.filterOpisSmest));
    if (this.filterDrzava!="")
    this.smestajiMENJANI=this.smestajiMENJANI.filter(kor=>kor.drzava.includes(this.filterDrzava));
    if (this.filterGrad!="")
    this.smestajiMENJANI=this.smestajiMENJANI.filter(kor=>kor.grad.includes(this.filterGrad));
  }

  sortDesc0() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.nazivSmestaja < kor2.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.nazivSmestaja == kor2.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc0() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.nazivSmestaja > kor2.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.nazivSmestaja == kor2.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc1() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.opisSmestaja < kor2.opisSmestaja) {
        return -1;
      }
      else {
        if (kor1.opisSmestaja == kor2.opisSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.opisSmestaja > kor2.opisSmestaja) {
        return -1;
      }
      else {
        if (kor1.opisSmestaja == kor2.opisSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.drzava < kor2.drzava) {
        return -1;
      }
      else {
        if (kor1.drzava == kor2.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.drzava > kor2.drzava) {
        return -1;
      }
      else {
        if (kor1.drzava == kor2.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.grad < kor2.grad) {
        return -1;
      }
      else {
        if (kor1.grad == kor2.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc3() {
    this.smestajiMENJANI.sort((kor1, kor2) => {
      if (kor1.grad > kor2.grad) {
        return -1;
      }
      else {
        if (kor1.grad == kor2.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }
  /////////////////////////////////////////////////////////

  filterTur:string='';
  filterDatumOd:string='';
  filterDatumDo:string='';
  filterSmest:string='';
  filterEmail:string='';

  filter_rezervacije(){
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmail;
    if (this.filterTur!="")
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmailMENJANI.filter(kor=>kor.rezervacija.turista.includes(this.filterTur));
    if (this.filterDatumOd!="")
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmailMENJANI.filter(kor=>kor.rezervacija.datumOd.includes(this.filterDatumOd));
    if (this.filterDatumDo!="")
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmailMENJANI.filter(kor=>kor.rezervacija.datumDo.includes(this.filterDatumDo));
    if (this.filterSmest!="")
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmailMENJANI.filter(kor=>kor.rezervacija.nazivSmestaja.includes(this.filterSmest));
    if (this.filterEmail!="")
    this.rezervacijeTuristaEmailMENJANI=this.rezervacijeTuristaEmailMENJANI.filter(kor=>kor.email.includes(this.filterEmail));
  }

  sortDesc0_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.turista < kor2.rezervacija.turista) {
        return -1;
      }
      else {
        if (kor1.rezervacija.turista == kor2.rezervacija.turista) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc0_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.turista > kor2.rezervacija.turista) {
        return -1;
      }
      else {
        if (kor1.rezervacija.turista == kor2.rezervacija.turista) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc1_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.datumOd < kor2.rezervacija.datumOd) {
        return -1;
      }
      else {
        if (kor1.rezervacija.datumOd == kor2.rezervacija.datumOd) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.datumOd > kor2.rezervacija.datumOd) {
        return -1;
      }
      else {
        if (kor1.rezervacija.datumOd == kor2.rezervacija.datumOd) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.datumDo < kor2.rezervacija.datumDo) {
        return -1;
      }
      else {
        if (kor1.rezervacija.datumDo == kor2.rezervacija.datumDo) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.datumDo > kor2.rezervacija.datumDo) {
        return -1;
      }
      else {
        if (kor1.rezervacija.datumDo == kor2.rezervacija.datumDo) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.nazivSmestaja < kor2.rezervacija.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.rezervacija.nazivSmestaja == kor2.rezervacija.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc3_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.rezervacija.nazivSmestaja > kor2.rezervacija.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.rezervacija.nazivSmestaja == kor2.rezervacija.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc4_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.email < kor2.email) {
        return -1;
      }
      else {
        if (kor1.email == kor2.email) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc4_() {
    this.rezervacijeTuristaEmailMENJANI.sort((kor1, kor2) => {
      if (kor1.email > kor2.email) {
        return -1;
      }
      else {
        if (kor1.email == kor2.email) {
          return 0;
        }
        else return 1;
      }
    })
  }



}
