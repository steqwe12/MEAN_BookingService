import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { SmestajService } from '../services/smestaj.service';
import User from '../models/user';
import Smestaj from '../models/smestaj';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import SmestajSaSlikom from '../models/smestajSaSlikom';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Rezervacija from '../models/rezervacija';
import { RezervacijaService } from '../services/rezervacija.service';
import Rezervacija_i_smestaj from '../models/rezervacija_i_smestaj';
import { EmailService } from '../services/email.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-turista',
  templateUrl: './turista.component.html',
  styleUrls: ['./turista.component.css']
})
export class TuristaComponent {

  constructor(private emailService:EmailService,private rezervacijaService: RezervacijaService,private sanitizer: DomSanitizer,private slikaSmestajaService:SlikaSmestajaService,private router: Router, private userService: UserService,private smestajService: SmestajService,private http: HttpClient) { }

  korisnik: User;

  sviSmestaji: Smestaj[]=[]
  sviSmestajiSaSlikom:SmestajSaSlikom[]=[]
  sviSmestajiSaSlikomMENJANI:SmestajSaSlikom[]=[]

  korisnikoveRezervacije: Rezervacija[]=[] // samo one koje su u buducnosti
  korisnikoveRezervacijeISmestaj: Rezervacija_i_smestaj[]=[]
  korisnikoveRezervacijeISmestajMENJANI: Rezervacija_i_smestaj[]=[]

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='turista') this.router.navigate([''])
      this.korisnik = u1;

      this.smestajService.dohvatiSveSmestaje().subscribe((s1: Smestaj[]) => {
        this.sviSmestaji = s1;

        const promises = this.sviSmestaji.map(smestj =>
          this.slikaSmestajaService.dohvatiPrvuSlikuSmestaja(smestj.korisnickoIme, smestj.nazivSmestaja).toPromise()
              .then(slikaBlob => {
                  const slika = new File([slikaBlob], 'image.jpg', { type: slikaBlob.type });
                  this.sviSmestajiSaSlikom.push(new SmestajSaSlikom(smestj, slika));
              })
        );

        Promise.all(promises).then(() => {
            console.log('Sve slike su učitane.');
            this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikom;
        }).catch(error => {
            console.error('Greška prilikom učitavanja slika:', error);
        });
      })
    })

    this.rezervacijaService.dohvatiRezervacijeTuriste(sessionStorage.getItem("ulogovanKorisnik")).subscribe((r1: Rezervacija[]) => {
      const danasnjiDatum = new Date();
      danasnjiDatum.setHours(0, 0, 0, 0); // Postavi vreme na ponoc (00:00:00)

      this.korisnikoveRezervacije = r1.filter(rezervacija => {
        const datumDo = new Date(rezervacija.datumDo);
        datumDo.setHours(0, 0, 0, 0); // Postavi vreme na ponoc za datumDo

        return datumDo >= danasnjiDatum; // Poredjenje samo po godini, mesecu i danu
      });

      /*this.korisnikoveRezervacije.forEach(rezervacija => {
        this.smestajService.dohvatiSmestaj(rezervacija.vlasnik, rezervacija.nazivSmestaja)
          .subscribe((s2: Smestaj) => {
            this.korisnikoveRezervacijeISmestaj.push({
              rezervacija: rezervacija,
              smestaj: s2
            });
          });
      });
      this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestaj;*/
      let observables = this.korisnikoveRezervacije.map(rezervacija =>
        this.smestajService.dohvatiSmestaj(rezervacija.vlasnik, rezervacija.nazivSmestaja)
          .pipe(
            map((s2: Smestaj) => ({
              rezervacija: rezervacija,
              smestaj: s2
            }))
          )
      );

      forkJoin(observables).subscribe(results => {
        this.korisnikoveRezervacijeISmestaj = results;

        this.korisnikoveRezervacijeISmestajMENJANI = this.korisnikoveRezervacijeISmestaj;
      });

    });

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


  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  idiNaFormuZaRezervaciju(vlasnik:string,nazivSmestaja:string){
    sessionStorage.setItem("vlasnik", vlasnik)
    sessionStorage.setItem("nazivSmestaja", nazivSmestaja)

    this.router.navigate(['turistaRezervisi'])
  }


  idiNaDetaljeRezervacije(nazivSmestaja:string,datumOd:string,datumDo:string,vlasnik:string){
    sessionStorage.setItem("vlasnik", vlasnik)
    sessionStorage.setItem("nazivSmestaja", nazivSmestaja)
    sessionStorage.setItem("datumOd", datumOd)
    sessionStorage.setItem("datumDo", datumDo)

    this.router.navigate(['turistaDetaljiRezervacije'])
  }

  otkaziRezervaciju(nazivSmestaja:string,datumOd:string,datumDo:string,vlasnik:string){
    this.userService.dohvatiKorisnikaZaUsername(vlasnik).subscribe((kor:User)=>{
      let text="Rezervacija za smestaj:"+nazivSmestaja+"koji je rezervisan od:"+datumOd+" do datuma:"+datumDo +" je otkazana"
      this.emailService.sendEmail(kor.email, 'Otkazana rezervacija', text)
    })
    this.rezervacijaService.ukloniRezervaciju(this.korisnik.korisnickoIme,vlasnik,datumOd,datumDo,nazivSmestaja).subscribe((res) => {
      location.reload();
    })
  }

  ////////////////////////



  filterNazSmest:string='';
  filterOpisSmest:string='';
  filterDrz:string='';
  filterGrad:string='';

  filter_sviSmest_sa_slikom(){
    this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikom;
    if (this.filterNazSmest!="")
    this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikomMENJANI.filter(kor=>kor.smestaj.nazivSmestaja.includes(this.filterNazSmest));
    if (this.filterOpisSmest!="")
    this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikomMENJANI.filter(kor=>kor.smestaj.opisSmestaja.includes(this.filterOpisSmest));
    if (this.filterDrz!="")
    this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikomMENJANI.filter(kor=>kor.smestaj.drzava.includes(this.filterDrz));
    if (this.filterGrad!="")
    this.sviSmestajiSaSlikomMENJANI=this.sviSmestajiSaSlikomMENJANI.filter(kor=>kor.smestaj.grad.includes(this.filterGrad));
  }

  sortDesc0() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.nazivSmestaja < kor2.smestaj.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.nazivSmestaja == kor2.smestaj.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc0() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.nazivSmestaja > kor2.smestaj.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.nazivSmestaja == kor2.smestaj.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc1() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.opisSmestaja < kor2.smestaj.opisSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.opisSmestaja == kor2.smestaj.opisSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.opisSmestaja > kor2.smestaj.opisSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.opisSmestaja == kor2.smestaj.opisSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.drzava < kor2.smestaj.drzava) {
        return -1;
      }
      else {
        if (kor1.smestaj.drzava == kor2.smestaj.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.drzava > kor2.smestaj.drzava) {
        return -1;
      }
      else {
        if (kor1.smestaj.drzava == kor2.smestaj.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.grad < kor2.smestaj.grad) {
        return -1;
      }
      else {
        if (kor1.smestaj.grad == kor2.smestaj.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc3() {
    this.sviSmestajiSaSlikomMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.grad > kor2.smestaj.grad) {
        return -1;
      }
      else {
        if (kor1.smestaj.grad == kor2.smestaj.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }


  ////////////////////



  filterNSmest:string='';
  filterD:string='';
  filterG:string='';
  filterDatumOd:string='';
  filterDatumDo:string='';

  filter_rezerv_smestaji(){
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestaj;
    if (this.filterNSmest!="")
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestajMENJANI.filter(kor=>kor.smestaj.nazivSmestaja.includes(this.filterNSmest));
    if (this.filterD!="")
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestajMENJANI.filter(kor=>kor.smestaj.drzava.includes(this.filterD));
    if (this.filterG!="")
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestajMENJANI.filter(kor=>kor.smestaj.grad.includes(this.filterG));
    if (this.filterDatumOd!="")
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestajMENJANI.filter(kor=>kor.rezervacija.datumOd.includes(this.filterDatumOd));
    if (this.filterDatumDo!="")
    this.korisnikoveRezervacijeISmestajMENJANI=this.korisnikoveRezervacijeISmestajMENJANI.filter(kor=>kor.rezervacija.datumDo.includes(this.filterDatumDo));
  }

  sortDesc0_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.nazivSmestaja < kor2.smestaj.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.nazivSmestaja == kor2.smestaj.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc0_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.nazivSmestaja > kor2.smestaj.nazivSmestaja) {
        return -1;
      }
      else {
        if (kor1.smestaj.nazivSmestaja == kor2.smestaj.nazivSmestaja) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc1_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.drzava < kor2.smestaj.drzava) {
        return -1;
      }
      else {
        if (kor1.smestaj.drzava == kor2.smestaj.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc1_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.drzava > kor2.smestaj.drzava) {
        return -1;
      }
      else {
        if (kor1.smestaj.drzava == kor2.smestaj.drzava) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc2_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.grad < kor2.smestaj.grad) {
        return -1;
      }
      else {
        if (kor1.smestaj.grad == kor2.smestaj.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortAsc2_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
      if (kor1.smestaj.grad > kor2.smestaj.grad) {
        return -1;
      }
      else {
        if (kor1.smestaj.grad == kor2.smestaj.grad) {
          return 0;
        }
        else return 1;
      }
    })
  }

  sortDesc3_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
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

  sortAsc3_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
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


  sortDesc4_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
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

  sortAsc4_() {
    this.korisnikoveRezervacijeISmestajMENJANI.sort((kor1, kor2) => {
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





}
