import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/user";

  login(korisnickoIme: string, lozinka: string){
    let data = {
      korisnickoIme: korisnickoIme, lozinka: lozinka
    }
    return this.http.post(`${this.uri}/login`, data) // return this.http.post<User>("http://localhost:4000/users/login", data)
  }

  registruj(korisnickoIme:string, lozinka:string, ime:string, prezime:string, kontaktTelefon:string, email:string, tip:string){
    let data = {
      korisnickoIme: korisnickoIme,
      lozinka: lozinka,
      ime: ime,
      prezime: prezime,
      kontaktTelefon: kontaktTelefon,
      email: email,
      tip: tip
    }
    return this.http.post(`${this.uri}/registruj`, data)
  }

  dohvatiKorisnikaZaUsername(korisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post(`${this.uri}/dohvatiKorisnikaZaUsername`, data)
  }

  dohvatiKorisnikaZaEmail(email:string){
    let data = {
      email: email
    }
    return this.http.post(`${this.uri}/dohvatiKorisnikaZaEmail`, data)
  }

  promLozinkuZaEmail(email:string,lozinka:string){
    let data = {
      email: email,
      lozinka: lozinka
    }
    return this.http.post(`${this.uri}/promLozinkuZaEmail`, data)
  }

  dohvatiTuriste_I_Vlasnike(){
    let data = {}
    return this.http.post(`${this.uri}/dohvatiTuriste_I_Vlasnike`, data)
  }

  promeniStatusKorisniku(korisnickoIme:string,status:string){
    let data = {
      korisnickoIme: korisnickoIme,
      status: status
    }
    return this.http.post(`${this.uri}/promeniStatusKorisniku`, data)
  }

  promeniIme(korisnickoIme:string,ime:string){
    let data = {
      korisnickoIme: korisnickoIme,
      ime: ime
    }
    return this.http.post(`${this.uri}/promeniIme`, data)
  }

  promeniPrezime(korisnickoIme:string,prezime:string){
    let data = {
      korisnickoIme: korisnickoIme,
      prezime: prezime
    }
    return this.http.post(`${this.uri}/promeniPrezime`, data)
  }

  promeniKontaktTelefon(korisnickoIme:string,kontaktTelefon:string){
    let data = {
      korisnickoIme: korisnickoIme,
      kontaktTelefon: kontaktTelefon
    }
    return this.http.post(`${this.uri}/promeniKontaktTelefon`, data)
  }

  promeniEmail(korisnickoIme:string,email:string){
    let data = {
      korisnickoIme: korisnickoIme,
      email: email
    }
    return this.http.post(`${this.uri}/promeniEmail`, data)
  }

  promeniKorisnickoIme(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    }
    return this.http.post(`${this.uri}/promeniKorisnickoIme`, data)
  }





}
