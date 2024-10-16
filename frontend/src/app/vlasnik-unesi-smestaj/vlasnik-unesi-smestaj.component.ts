import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import User from '../models/user';
import { SmestajService } from '../services/smestaj.service';
import { SlikaSmestajaService } from '../services/slika-smestaja.service';
import * as L from 'leaflet';
import { OnInit, AfterViewInit } from '@angular/core';



@Component({
  selector: 'app-vlasnik-unesi-smestaj',
  templateUrl: './vlasnik-unesi-smestaj.component.html',
  styleUrls: ['./vlasnik-unesi-smestaj.component.css']
})
export class VlasnikUnesiSmestajComponent  {

  constructor(private slikaSmestajaService: SlikaSmestajaService,private router: Router, private userService: UserService,private http: HttpClient, private smestajService: SmestajService) { }

  korisnik: User;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  ngOnInit(): void {
    this.userService.dohvatiKorisnikaZaUsername(sessionStorage.getItem("ulogovanKorisnik")).subscribe((u1: User) => {
      if (u1==null) this.router.navigate(['']) // route protection
      if (u1.tip!='vlasnik') this.router.navigate([''])
      this.korisnik = u1;
    })
    this.initializeMap();

  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  nazivSmestaja: string = ""
  opisSmestaja: string = ""
  selectedImages : File[] = [];
  selectedCoords: { lat: number, lng: number } | undefined;

  selectImages(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImages  = Array.from(input.files);
    }
  }

  unesiNoviSmestaj() {  // treba ispitati da li za ovog vlasnika vec postoji smestaj sa istim nazivom, to nije dozvoljeno
    if (!this.selectedCoords) {
      console.log('No coordinates selected.');
      return;
    }

    this.smestajService.unesiNoviSmestaj(this.korisnik.korisnickoIme, this.nazivSmestaja, this.opisSmestaja, this.selectedCoords.lat, this.selectedCoords.lng, this.drzava, this.grad).subscribe((resp) => {
      let count = 0;
      const totalImages = this.selectedImages.length;
      if (totalImages===0){
        alert('Smestaj uspešno dodat!');
        this.router.navigate(['vlasnik']);
      }

      this.selectedImages.forEach(slika => {
        let novoImeSlike=`${Date.now()}-${slika.name}`;
        this.slikaSmestajaService.unesiNovuSlikuSmestaja(this.korisnik.korisnickoIme, this.nazivSmestaja,novoImeSlike).subscribe((resp) => {
          this.slikaSmestajaService.sacuvajSlikuNaServeru(novoImeSlike,slika).subscribe((resp) => {
            count++;
            if (count === totalImages){
              console.log("Slike i smestaj uspešno sačuvani:", novoImeSlike);
              alert('Smestaj i slike uspešno dodate!');
              this.router.navigate(['vlasnik']);
            }
          });
        });
      });

    });
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate([''])
  }

  grad:string=''
  drzava:string=''

  initializeMap(): void {
    if (this.map) {
      return; // Ako je mapa vec inicijalizovana, ne radi nista
    }

    // Inicijalizacija mape
    this.map = L.map('map').setView([45.2671, 19.8335], 13); // Pocetna lokacija

    // Dodavanje TileLayer-a
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    const pinRed = new L.Icon({
      iconUrl: '../../assets/pinRed.png',
      iconSize: [25, 41],  // Prilagodi velicinu ikone
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],  // Prilagodi tacku za popup prozor
    });

    // Dodavanje događaja za klik na mapu
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.selectedCoords = { lat, lng };

      if (this.marker) {
        this.marker.setLatLng([this.selectedCoords.lat, this.selectedCoords.lng]);
      } else {
        this.marker = L.marker([this.selectedCoords.lat, this.selectedCoords.lng], { icon: pinRed }).addTo(this.map);
      }

      // Poziv Nominatim reverse geocoding API-a
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          console.log('City:', data.address.city);
          this.grad=data.address.city
          console.log('Country:', data.address.country);
          this.drzava=data.address.country
          //console.log('State:', data.address.state);
          //console.log('County:', data.address.county);
        })
        .catch(error => console.error('Greška u geokodiranju:', error));
    });

    // Osvežavanje mape
    this.map.invalidateSize();
  }




}
