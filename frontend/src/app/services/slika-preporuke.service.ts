import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlikaPreporukeService {

  constructor(private http: HttpClient) { }

  uri = "http://localhost:4000/slikaPreporuke";

  unesiNovuSlikuPreporuke(korisnickoIme:string, nazivSmestaja:string,nazivPreporuke:string,nazivSlike:string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja,nazivPreporuke:nazivPreporuke ,nazivSlike: nazivSlike
    }
    return this.http.post(`${this.uri}/unesiNovuSlikuPreporuke`, data)
  }

  sacuvajSlikuNaServeru(imeSlike: string, slika: File) {
    const formData = new FormData();
    formData.append('slika', slika, imeSlike);

    return this.http.post('http://localhost:4000/sacuvajSliku', formData);
  }

  dohvatiSlikeZaPreporukuKorisnika(korisnickoIme: string, nazivSmestaja: string,nazivPreporuke: string){
    let data = {
      korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja, nazivPreporuke: nazivPreporuke
    }
    return this.http.post(`${this.uri}/dohvatiSlikeZaPreporukuKorisnika`, data)
  }

  dohvatiSlikuZaImeSlike(nazivSlike: string){
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
    return this.http.post('http://localhost:4000/obrisiSlikuPreporuke', data)
  }

  izmeniNaSlikamaNazivPreporuke(korisnickoIme,nazivSmestaja,nazivPreporuke,nazivPreporukeUpdate){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja,
      nazivPreporuke: nazivPreporuke,
      nazivPreporukeUpdate: nazivPreporukeUpdate
    };
    return this.http.post(`${this.uri}/izmeniNaSlikamaNazivPreporuke`, data)
  }

  promeniKorisnickoImeNaSlikamaPreporuka(korisnickoIme:string,novoKorisnickoIme:string){
    let data = {
      korisnickoIme: korisnickoIme,
      novoKorisnickoIme: novoKorisnickoIme
    };
    return this.http.post(`${this.uri}/promeniKorisnickoImeNaSlikamaPreporuka`, data)
  }

  dohvatiSlikeZaSmestajKorisnika(korisnickoIme:string, nazivSmestaja:string){
    let data = {
      korisnickoIme: korisnickoIme,
      nazivSmestaja: nazivSmestaja
    };
    return this.http.post(`${this.uri}/dohvatiSlikeZaSmestajKorisnika`, data)
  }



}
