import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import { KuponService } from '../services/kupon.service';
import Kupon from '../models/kupon';

@Component({
  selector: 'app-vlasnik-unesi-kupon',
  templateUrl: './vlasnik-unesi-kupon.component.html',
  styleUrls: ['./vlasnik-unesi-kupon.component.css']
})
export class VlasnikUnesiKuponComponent {

  constructor(private router: Router, private userService: UserService,private kuponService: KuponService,private http: HttpClient) { }

  korisnik: User;
  kuponi:Kupon[]=[]
  kuponiMENJANI:Kupon[]=[]

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;
      this.kuponService.dohvatiKuponeZaVlasnika(this.korisnik.korisnickoIme).subscribe((k1: Kupon[]) => {
        this.kuponi = k1;
        this.kuponiMENJANI = k1;
      })
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  nazivKupona: string = ""
  opisKupona: string = ""

  errorFILE: string = ""
  fileOk:boolean=false;
  file: File | undefined;

  dodajKupon(){
    if (this.fileOk && this.file) {
        const formData = new FormData();
        formData.append('file', this.file);

        this.kuponService.uploadFile(formData).subscribe(
            (uploadResp) => {
                const fileName = uploadResp.fileName; // Koristi ime fajla koje vrati backend

                // Sada dodajemo kupon sa imenom fajla koji je generisan na backend-u
                this.kuponService.dodajKupon(
                    this.korisnik.korisnickoIme,
                    this.opisKupona,
                    this.nazivKupona,
                    fileName
                ).subscribe((resp) => {
                    console.log('Kupon uspešno dodat!', resp);
                    alert('Kupon uspešno dodat!');
                    this.router.navigate(['vlasnik']);
                });
            },
            (error) => {
                console.error('Greška pri uploadu fajla', error);
            }
        );
    } else {
        this.errorFILE = 'Molimo vas da dodate validan fajl, ne može da se doda kupon.';
    }
}


  selectFile(event: any) {
    if (event.target.files.length == 1) {
      const file = event.target.files[0];

      const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxFileSize = 5 * 1024 * 1024; // 5 MB maksimalna veličina fajla

      if (allowedFileTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          this.file = file;
          this.errorFILE = 'Fajl je uspešno odabran.';
          this.fileOk = true;
        } else {
          this.errorFILE = 'Veličina fajla prelazi maksimalnu dozvoljenu veličinu od 5 MB.';
          this.file = undefined; // Resetujemo selektovani fajl
          this.fileOk = false;
        }
      } else {
        this.errorFILE = 'Nepodržan tip fajla. Dozvoljeni formati su: PDF, DOC, DOCX.';
        this.file = undefined; // Resetujemo selektovani fajl
        this.fileOk = false;
      }
    }
    else if(event.target.files.length == 0){
      this.fileOk=false;
      this.file = undefined;
      this.errorFILE='morate priloziti fajl';
    }
  }

  /*currentPage: number = 1;
  rowsPerPage: number = 5;

  get paginatedCoupons() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    return this.kuponi.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.kuponi.length / this.rowsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }*/

  obrisiKupon(korisnickoIme: string, fajlIme: string) {
    this.kuponService.obrisiKupon(korisnickoIme, fajlIme).subscribe(response => {
      // Obrisati kupon iz lokalnog niza kupona
      this.kuponi = this.kuponi.filter(kupon => kupon.fajlIme !== fajlIme);
      alert('Kupon je uspešno obrisan.');
    });
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



  //preuzmiFajl(fajlIme: string) {
  //  const url = `http://localhost:4000/files/${fajlIme}`;
  //  const link = document.createElement('a');
  //  link.href = url;
  //  link.download = fajlIme; // Postavi ime fajla za preuzimanje
  //  document.body.appendChild(link); // Dodaj link u DOM
  //  link.click(); // Programski klikni na link da pokreneš preuzimanje
  //  document.body.removeChild(link); // Ukloni link iz DOM-a
  //}


  /*get maxPage(): number {
    return Math.ceil(this.kuponi.length / this.rowsPerPage);
  }*/

    filterNaslov:string='';
    filterOpis:string='';
    filterImeFajla:string='';

    filter_kuponi(){
      this.kuponiMENJANI=this.kuponi;
      if (this.filterNaslov!="")
      this.kuponiMENJANI=this.kuponiMENJANI.filter(kor=>kor.naslov.includes(this.filterNaslov));
      if (this.filterOpis!="")
      this.kuponiMENJANI=this.kuponiMENJANI.filter(kor=>kor.opis.includes(this.filterOpis));
      if (this.filterImeFajla!="")
      this.kuponiMENJANI=this.kuponiMENJANI.filter(kor=>kor.fajlIme.includes(this.filterImeFajla));
    }

    sortDesc0() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.naslov < kor2.naslov) {
          return -1;
        }
        else {
          if (kor1.naslov == kor2.naslov) {
            return 0;
          }
          else return 1;
        }
      })
    }

    sortAsc0() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.naslov > kor2.naslov) {
          return -1;
        }
        else {
          if (kor1.naslov == kor2.naslov) {
            return 0;
          }
          else return 1;
        }
      })
    }

    sortDesc1() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.opis < kor2.opis) {
          return -1;
        }
        else {
          if (kor1.opis == kor2.opis) {
            return 0;
          }
          else return 1;
        }
      })
    }

    sortAsc1() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.opis > kor2.opis) {
          return -1;
        }
        else {
          if (kor1.opis == kor2.opis) {
            return 0;
          }
          else return 1;
        }
      })
    }

    sortDesc2() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.fajlIme < kor2.fajlIme) {
          return -1;
        }
        else {
          if (kor1.fajlIme == kor2.fajlIme) {
            return 0;
          }
          else return 1;
        }
      })
    }

    sortAsc2() {
      this.kuponiMENJANI.sort((kor1, kor2) => {
        if (kor1.fajlIme > kor2.fajlIme) {
          return -1;
        }
        else {
          if (kor1.fajlIme == kor2.fajlIme) {
            return 0;
          }
          else return 1;
        }
      })
    }


}
