import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/rezervacija";

  dohvatiRezervacijeSmestaja(vlasnik:string,nazivSmestaja:string){
    let data = {
      vlasnik: vlasnik,
      nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/dohvatiRezervacijeSmestaja`,data)
  }

  rezervisi(turista:string,vlasnik:string,datumDo:string,datumOd:string,nazivSmestaja:string){
    let data = {
      turista: turista,
      vlasnik: vlasnik,
      datumDo: datumDo,
      datumOd: datumOd,
      nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/rezervisi`,data)
  }

  dohvatiRezervacijeTuriste(turista:string){
    let data = {
      turista: turista
    }
    return this.http.post(`${this.uri}/dohvatiRezervacijeTuriste`,data)
  }

  dohvatiRezervacijeVlasnika(vlasnik:string){
    let data = {
      vlasnik: vlasnik
    }
    return this.http.post(`${this.uri}/dohvatiRezervacijeVlasnika`,data)
  }

  ukloniRezervaciju(turista:string,vlasnik:string,datumOd:string,datumDo:string,nazivSmestaja:string){
    let data = {
      turista: turista,
      vlasnik: vlasnik,
      datumOd: datumOd,
      datumDo: datumDo,
      nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/ukloniRezervaciju`,data)
  }

  promeniKorisnickoImeNaRezervacijama(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    }
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaRezervacijama`,data)
  }




}
