import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { TuristaComponent } from './turista/turista.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { ResetLozinkeComponent } from './reset-lozinke/reset-lozinke.component';
import { VlasnikUnesiSmestajComponent } from './vlasnik-unesi-smestaj/vlasnik-unesi-smestaj.component';
import { VlasnikUnesiKuponComponent } from './vlasnik-unesi-kupon/vlasnik-unesi-kupon.component';
import { VlasnikDetaljanPregledSmestajaComponent } from './vlasnik-detaljan-pregled-smestaja/vlasnik-detaljan-pregled-smestaja.component';
import { NeregistrovanPregledSmestajaComponent } from './neregistrovan-pregled-smestaja/neregistrovan-pregled-smestaja.component';
import { VlasnikUnesiPreporukuComponent } from './vlasnik-unesi-preporuku/vlasnik-unesi-preporuku.component';
import { VlasnikDetaljPreporukeComponent } from './vlasnik-detalj-preporuke/vlasnik-detalj-preporuke.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuristaRezervisiComponent } from './turista-rezervisi/turista-rezervisi.component';
import { TuristaDetaljiRezervacijeComponent } from './turista-detalji-rezervacije/turista-detalji-rezervacije.component';
import { AdminDetaljVlasnikaComponent } from './admin-detalj-vlasnika/admin-detalj-vlasnika.component';
import { AdminDetaljTuristeComponent } from './admin-detalj-turiste/admin-detalj-turiste.component';
import { AdminDetaljVlasnikaSmestajComponent } from './admin-detalj-vlasnika-smestaj/admin-detalj-vlasnika-smestaj.component';
import { AdminDetaljVlasnikaPreporukaComponent } from './admin-detalj-vlasnika-preporuka/admin-detalj-vlasnika-preporuka.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PromenaPodatakaComponent } from './promena-podataka/promena-podataka.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    VlasnikComponent,
    TuristaComponent,
    RegistracijaComponent,
    ResetLozinkeComponent,
    VlasnikUnesiSmestajComponent,
    VlasnikUnesiKuponComponent,
    VlasnikDetaljanPregledSmestajaComponent,
    NeregistrovanPregledSmestajaComponent,
    VlasnikUnesiPreporukuComponent,
    VlasnikDetaljPreporukeComponent,
    TuristaRezervisiComponent,
    TuristaDetaljiRezervacijeComponent,
    AdminDetaljVlasnikaComponent,
    AdminDetaljTuristeComponent,
    AdminDetaljVlasnikaSmestajComponent,
    AdminDetaljVlasnikaPreporukaComponent,
    PromenaLozinkeComponent,
    PromenaPodatakaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
