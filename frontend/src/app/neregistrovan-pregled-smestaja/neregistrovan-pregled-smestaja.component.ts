import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SmestajService } from '../services/smestaj.service';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import Smestaj from '../models/smestaj';
import SlikaSmestaja from '../models/slikaSmestaja';
import * as L from 'leaflet';

@Component({
  selector: 'app-neregistrovan-pregled-smestaja',
  templateUrl: './neregistrovan-pregled-smestaja.component.html',
  styleUrls: ['./neregistrovan-pregled-smestaja.component.css']
})
export class NeregistrovanPregledSmestajaComponent implements OnInit {

  smestaj: Smestaj = {} as Smestaj;
  slike: SlikaSmestaja[] = [];
  slikeFajlovi: File[] = [];

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private slikaSmestajaService: SlikaSmestajaService,
    private router: Router,
    private smestajService: SmestajService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const korisnickoIme1 = sessionStorage.getItem("korisnickoImeSmestajZaNeregistrovanog");
    const nazivSmestaja1 = sessionStorage.getItem("nazivSmestajaSmestajZaNeregistrovanog");

    if (korisnickoIme1 && nazivSmestaja1) {
      this.smestajService.dohvatiSmestaj(korisnickoIme1, nazivSmestaja1).subscribe((s1: Smestaj) => {
        this.smestaj = s1;
        this.ucitajSlike();
        this.initializeMap();
      });
    } else {
      console.error('Korisničko ime ili naziv smeštaja nije pronađeno u sessionStorage.');
    }
  }

  ucitajSlike(): void {
    this.slikaSmestajaService.dohvatiSlikeZaSmestajKorisnika(this.smestaj.korisnickoIme, this.smestaj.nazivSmestaja).subscribe((slike: SlikaSmestaja[]) => {
      this.slike = slike;

      const promises = this.slike.map(sl =>
        this.slikaSmestajaService.dohvatiSlikuZaImeSlike(sl.nazivSlike).toPromise()
          .then(slikaBlob => {
            const slika = new File([slikaBlob], 'image.jpg', { type: slikaBlob.type });
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
        this.marker = L.marker([this.smestaj.lat, this.smestaj.lng], { draggable: false, icon:pinRed }).addTo(this.map);
      }
    }
  }

  sanitizedImageUrl(file: File): SafeUrl {
    const objectUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }
}
