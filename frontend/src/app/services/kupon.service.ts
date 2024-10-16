import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Kupon from '../models/kupon';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class KuponService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/kupon";

  dodajKupon(korisnickoIme: string, opisKupona: string,nazivKupona: string,fajlIme: string){
    let data = {
      korisnickoIme: korisnickoIme, opis: opisKupona,naslov:nazivKupona,fajlIme:fajlIme
    }
    return this.http.post(`${this.uri}/dodajKupon`, data)
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`http://localhost:4000/dodajKuponFajlBackend`, formData);
  }

  dohvatiKuponeZaVlasnika(korisnickoIme: string){
    let data = {
      korisnickoIme: korisnickoIme
    }
    return this.http.post(`${this.uri}/dohvatiKuponeZaVlasnika`, data)
  }

  obrisiKupon(korisnickoIme: string, fajlIme: string): Observable<any> {
    return this.http.delete(`http://localhost:4000/apikuponi/${korisnickoIme}/${fajlIme}`);
  }

  promeniKuponOpisNaslov(fajlIme:string,korisnickoIme:string,opis:string,naslov:string){
    let data = {
      fajlIme: fajlIme,
      korisnickoIme: korisnickoIme,
      opis: opis,
      naslov: naslov
    }
    return this.http.post(`${this.uri}/promeniKuponOpisNaslov`, data)
  }

  promeniKorisnickoImeNaKuponima(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    }
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaKuponima`, data)
  }


}
