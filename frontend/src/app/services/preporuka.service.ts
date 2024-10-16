import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreporukaService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/preporuka";

  dohvatiPreporukeZaVlasnika(korisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post(`${this.uri}/dohvatiPreporukeZaVlasnika`,data)
  }

  dodajPreporuku(korisnickoIme:string,nazivSmestaja:string,lat:number,lng:number,nazivPreporuke:string,opisPreporuke:string,tip:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      lat: lat,
      lng: lng,
      nazivPreporuke: nazivPreporuke,
      opisPreporuke: opisPreporuke,
      tip: tip
    }
    return this.http.post(`${this.uri}/dodajPreporuku`,data)
  }

  dohvatiJednuPreporuku(korisnickoIme:string,nazivSmestaja:string,nazivPreporuke:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivPreporuke: nazivPreporuke
    }
    return this.http.post(`${this.uri}/dohvatiJednuPreporuku`,data)
  }

  izbrisiPreporuku(korisnickoIme:string,nazivSmestaja:string,nazivPreporuke:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivPreporuke: nazivPreporuke
    }
    return this.http.post(`${this.uri}/izbrisiPreporuku`,data)
  }

  izmeniInfoPreporuke(korisnickoIme:string,nazivSmestaja:string,nazivPreporuke:string,nazivPreporukeUpdate:string,opisPreporukeUpdate:string,tipUpdate:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivPreporuke: nazivPreporuke,
      nazivPreporukeUpdate: nazivPreporukeUpdate,
      opisPreporukeUpdate: opisPreporukeUpdate,
      tipUpdate: tipUpdate,
    }
    return this.http.post(`${this.uri}/izmeniInfoPreporuke`,data)
  }

  dohvatiPreporukeZaSmestajVlasnika(korisnickoIme:string,nazivSmestaja:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/dohvatiPreporukeZaSmestajVlasnika`,data)
  }

  promeniKorisnickoImeNaPreporukama(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    }
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaPreporukama`,data)
  }

  izbrisiPreporukeZaSmestaj(korisnickoIme:string,nazivSmestaja:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/izbrisiPreporukeZaSmestaj`,data)
  }



}
