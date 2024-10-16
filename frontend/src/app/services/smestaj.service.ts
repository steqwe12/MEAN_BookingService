import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmestajService {

  private uri = 'http://localhost:4000/smestaj';

  constructor(private http: HttpClient) { }

  unesiNoviSmestaj(korisnickoIme: string, nazivSmestaja: string, opisSmestaja: string, lat:number, lng:number, drzava:string, grad:string) {
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja, opisSmestaja: opisSmestaja, lat:lat, lng:lng, drzava:drzava, grad:grad
    }
    return this.http.post(`${this.uri}/unesiNoviSmestaj`, data)
  }

  dohvatiSmestajeZaVlasnika(korisnickoIme: string){
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post(`${this.uri}/dohvatiSmestajeZaVlasnika`, data)
  }

  dohvatiSmestaj(korisnickoIme: string,nazivSmestaja: string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja:nazivSmestaja
    }
    return this.http.post(`${this.uri}/dohvatiSmestaj`, data)
  }

  dohvatiSveSmestaje(){
    let data = {}
    return this.http.post(`${this.uri}/dohvatiSveSmestaje`,data)
  }

  izmeniInfoSmestaja(korisnickoIme: string,nazivSmestaja: string,nazivSmestajaUpdate: string,opisSmestajaUpdate: string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja:nazivSmestaja,nazivSmestajaUpdate:nazivSmestajaUpdate,opisSmestajaUpdate:opisSmestajaUpdate
    }
    return this.http.post(`${this.uri}/izmeniInfoSmestaja`,data)
  }

  izbrisiSmestaj(korisnickoIme: string,nazivSmestaja: string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja:nazivSmestaja
    }
    return this.http.post(`${this.uri}/izbrisiSmestaj`,data)
  }

  promeniKorisnickoImeNaSmestajima(korisnickoIme: string,novoKorisnickoIme: string){
    let data = {
      korisnickoIme: korisnickoIme, novoKorisnickoIme:novoKorisnickoIme
    }
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaSmestajima`,data)
  }



}
