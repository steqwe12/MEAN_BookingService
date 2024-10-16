import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlikaSmestajaService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/slikaSmestaja";

  unesiNovuSlikuSmestaja(korisnickoIme:string, nazivSmestaja:string,nazivSlike:string) {
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja, nazivSlike: nazivSlike
    }
    return this.http.post(`${this.uri}/unesiNovuSlikuSmestaja`, data)
  }

  sacuvajSlikuNaServeru(imeSlike: string, slika: File) {
    const formData = new FormData();
    formData.append('slika', slika, imeSlike);

    return this.http.post('http://localhost:4000/sacuvajSliku', formData);
  }

  dohvatiSlikeZaSmestajKorisnika(korisnickoIme:string,nazivSmestaja:string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja
    }
    return this.http.post(`${this.uri}/dohvatiSlikeZaSmestajKorisnika`, data)
  }

  dohvatiPrvuSlikuSmestaja(korisnickoIme: string, nazivSmestaja: string) {
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja
    };
    return this.http.post('http://localhost:4000/dohvatiPrvuSlikuSmestaja', data, { responseType: 'blob' });
  }

  dohvatiSlikuZaImeSlike(nazivSlike:string) {
    let data = {
      nazivSlike: nazivSlike
    };
    return this.http.post('http://localhost:4000/dohvatiSlikuZaImeSlike', data, { responseType: 'blob' });
  }

  obrisiSliku(korisnickoIme:string, nazivSmestaja:string, nazivSlike:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivSlike: nazivSlike
    };
    return this.http.post('http://localhost:4000/obrisiSlikuSmestaja', data)
  }

  izmeniNaSlikamaNazivSmestaja(korisnickoIme,nazivSmestaja,nazivSmestajaUpdate){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivSmestajaUpdate: nazivSmestajaUpdate
    };
    return this.http.post(`${this.uri}/izmeniNaSlikamaNazivSmestaja`, data)
  }

  promeniKorisnickoImeNaSlikamaSmestaja(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    };
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaSlikamaSmestaja`, data)
  }




}
