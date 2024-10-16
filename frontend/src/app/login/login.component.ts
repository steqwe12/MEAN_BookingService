import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import { SmestajService } from '../services/smestaj.service';
import Smestaj from '../models/smestaj';
import SmestajSaSlikom from '../models/smestajSaSlikom';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private sanitizer: DomSanitizer,private router: Router, private slikaSmestajaService:SlikaSmestajaService,private smestajService:SmestajService, private userService: UserService, private http: HttpClient) { }

  username: string = ""
  password: string = ""
  errorLogin: string;

  sviSmestaji:Smestaj[]=[]
  sviSmestajiSaSlikom:SmestajSaSlikom[]=[]

  ngOnInit(): void {
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
            // ovde moze da se radi nesto nakon sto su sve slike ucitane
        }).catch(error => {
            console.error('Greška prilikom učitavanja slika:', error);
        });
    });
  }




  login(){
    this.userService.login(this.username, this.password).subscribe((u: User) => {
      if (u && u.status==='aktivan') {
        sessionStorage.setItem("ulogovanKorisnik", u.korisnickoIme)
        this.router.navigate([u.tip])
      } else if(u && u.status!=='aktivan'){
        this.errorLogin = "Nalog je blokiran ili banovan!";
        return;
      } else {
        this.errorLogin = "Losi podaci!";
        return;
      }
    })
  }

  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  pogledajPonuduNeregistrovan(smestaj: Smestaj): void {
    console.log("Prikaz ponude za:", smestaj.nazivSmestaja);
    sessionStorage.setItem("korisnickoImeSmestajZaNeregistrovanog", smestaj.korisnickoIme)
    sessionStorage.setItem("nazivSmestajaSmestajZaNeregistrovanog", smestaj.nazivSmestaja)

    this.router.navigate(['neregistrovanPregledSmestaja'])
  }



}
