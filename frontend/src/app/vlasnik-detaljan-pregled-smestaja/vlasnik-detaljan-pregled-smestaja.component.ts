import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user';
import { UserService } from '../services/user.service';
import Smestaj from '../models/smestaj';
import { SmestajService } from '../services/smestaj.service';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import SlikaSmestaja from '../models/slikaSmestaja';
import * as L from 'leaflet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import SlikaPreporuke from '../models/slikaPreporuke';
import { SlikaPreporukeService } from '../services/slika-preporuke.service';
import { PreporukaService } from '../services/preporuka.service';



@Component({
  selector: 'app-vlasnik-detaljan-pregled-smestaja',
  templateUrl: './vlasnik-detaljan-pregled-smestaja.component.html',
  styleUrls: ['./vlasnik-detaljan-pregled-smestaja.component.css']
})
export class VlasnikDetaljanPregledSmestajaComponent {

  constructor(private preporukaService:PreporukaService,private slikaPreporukeService:SlikaPreporukeService,private sanitizer: DomSanitizer,private router: Router,private http: HttpClient,private slikaSmestajaService:SlikaSmestajaService,private userService: UserService,private smestajService: SmestajService) { }

  korisnik: User;
  smestaj:Smestaj;
  slike : SlikaSmestaja[] = [];
  slikeFajlovi: File[] = [];

  grad:string=''
  drzava:string=''

  slikePreporuka:SlikaPreporuke[]=[]
  slikePreporukaFajlovi:File[]=[]

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;
      this.smestajService.dohvatiSmestaj(this.korisnik.korisnickoIme,sessionStorage.getItem("nazivSmestaja")).subscribe((s1: Smestaj) => {
        this.smestaj = s1;

        this.grad=s1.grad;
        this.drzava=s1.drzava;

        this.ucitajSlike();
        this.ucitajSlikePreporuka();

        this.nazivSmestajaUpdate=this.smestaj.nazivSmestaja;
        this.opisSmestajaUpdate=this.smestaj.opisSmestaja;
        this.initializeMap();
      })
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }


  initializeMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([this.smestaj.lat, this.smestaj.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map);

      const pinRed = new L.Icon({
        iconUrl: '../../assets/pinRed.png',
        iconSize: [25, 41],  // Prilagodi velicinu ikone
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],  // Prilagodi tacku za popup prozor
      });

      if (this.smestaj.lat && this.smestaj.lng) {
        this.marker = L.marker([this.smestaj.lat, this.smestaj.lng], { draggable: false, icon:pinRed  }).addTo(this.map);
      }
    }
  }

  ucitajSlike(): void {
    this.slikaSmestajaService.dohvatiSlikeZaSmestajKorisnika(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja).subscribe((slike: SlikaSmestaja[]) => {
      this.slike = slike;

      const promises = this.slike.map(sl =>
        this.slikaSmestajaService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
          .then(slikaBlob => {
            const slika = new File([slikaBlob], sl.nazivSlike, { type: slikaBlob.type });
            this.slikeFajlovi.push(slika);
          })
      );

      Promise.all(promises).then(() => {
        console.log('Sve slike su učitane.');
      }).catch(error => {
        console.error('Greška prilikom učitavanja slika:', error);
      });
    });
  }

  ucitajSlikePreporuka(): void{
    this.slikaPreporukeService.dohvatiSlikeZaSmestajKorisnika(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja).subscribe((slike: SlikaPreporuke[]) => {
      this.slikePreporuka = slike;

      const promises = this.slikePreporuka.map(sl =>
        this.slikaPreporukeService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
          .then(slikaBlob => {
            const slika = new File([slikaBlob], sl.nazivSlike, { type: slikaBlob.type });
            this.slikePreporukaFajlovi.push(slika);
          })
      );

      Promise.all(promises).then(() => {
        console.log('Sve slike su učitane.');
      }).catch(error => {
        console.error('Greška prilikom učitavanja slika:', error);
      });
    });
  }

  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  nazivSmestajaUpdate:string=''
  opisSmestajaUpdate:string=''

  sacuvaj(nazivSmestajaUpdate:string,opisSmestajaUpdate:string){
    this.slikaSmestajaService.izmeniNaSlikamaNazivSmestaja(this.smestaj.korisnickoIme,this.smestaj.nazivSmestaja,nazivSmestajaUpdate).subscribe((resp) => {
      this.smestajService.izmeniInfoSmestaja(this.smestaj.korisnickoIme,this.smestaj.nazivSmestaja,nazivSmestajaUpdate,opisSmestajaUpdate).subscribe((resp) => {
        sessionStorage.setItem("nazivSmestaja", nazivSmestajaUpdate)
        location.reload();
      })
    })
  }


  selectedImages : File[] = [];

  selectImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages  = Array.from(input.files);
    }
  }

  unesiNoveSlike() {
      let count = 0;
      const totalImages = this.selectedImages.length;
      if (totalImages===0){
        return;
      }

      this.selectedImages.forEach(slika => {
        let novoImeSlike=`${Date.now()}-${slika.name}`;
        this.slikaSmestajaService.unesiNovuSlikuSmestaja(this.korisnik.korisnickoIme, this.smestaj.nazivSmestaja,novoImeSlike).subscribe((resp) => {
          this.slikaSmestajaService.sacuvajSlikuNaServeru(novoImeSlike,slika).subscribe((resp) => {
            count++;
            if (count === totalImages){
              console.log("Slike uspešno sačuvane:", novoImeSlike);
              alert('Slike uspešno dodate!');
              location.reload();
            }
          });
        });
      });
  }


  deleteImage(imageName: string): void {
    this.slikaSmestajaService.obrisiSliku(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja, imageName).subscribe((resp) => {
        alert('deleted '+imageName)
        location.reload();
    });
  }


  izbrisiSmestaj(): void {
    if (confirm('OVA AKCIJA JE NEPOVRATNA! Da li želite da izbrišete smeštaj?')) {
      this.obrisiSmestaj();
    }
  }

  obrisiSmestaj(){
    this.slikeFajlovi.forEach((slika: File) => {
      this.slikaSmestajaService.obrisiSliku(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja, slika.name).subscribe((resp) => {
      });
    });
    this.slikePreporukaFajlovi.forEach((slika: File) => {
      this.slikaPreporukeService.obrisiSliku(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja, slika.name).subscribe((resp) => {
      });
    });

    this.smestajService.izbrisiSmestaj(this.smestaj.korisnickoIme,this.smestaj.nazivSmestaja).subscribe((resp) => {
    });
    this.preporukaService.izbrisiPreporukeZaSmestaj(this.smestaj.korisnickoIme,this.smestaj.nazivSmestaja).subscribe((resp) => {
    });

    alert("smestaj obrisan")
    this.router.navigate(['vlasnik'])
  }










}
