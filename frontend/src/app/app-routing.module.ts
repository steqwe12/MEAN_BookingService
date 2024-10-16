import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { TuristaComponent } from './turista/turista.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { ResetLozinkeComponent } from './reset-lozinke/reset-lozinke.component';
import { VlasnikUnesiSmestajComponent } from './vlasnik-unesi-smestaj/vlasnik-unesi-smestaj.component';
import { VlasnikUnesiKuponComponent } from './vlasnik-unesi-kupon/vlasnik-unesi-kupon.component';
import { VlasnikDetaljanPregledSmestajaComponent } from './vlasnik-detaljan-pregled-smestaja/vlasnik-detaljan-pregled-smestaja.component';
import { NeregistrovanPregledSmestajaComponent } from './neregistrovan-pregled-smestaja/neregistrovan-pregled-smestaja.component';
import { VlasnikUnesiPreporukuComponent } from './vlasnik-unesi-preporuku/vlasnik-unesi-preporuku.component';
import { VlasnikDetaljPreporukeComponent } from './vlasnik-detalj-preporuke/vlasnik-detalj-preporuke.component';
import { TuristaRezervisiComponent } from './turista-rezervisi/turista-rezervisi.component';
import { TuristaDetaljiRezervacijeComponent } from './turista-detalji-rezervacije/turista-detalji-rezervacije.component';
import { AdminDetaljTuristeComponent } from './admin-detalj-turiste/admin-detalj-turiste.component';
import { AdminDetaljVlasnikaComponent } from './admin-detalj-vlasnika/admin-detalj-vlasnika.component';
import { AdminDetaljVlasnikaSmestajComponent } from './admin-detalj-vlasnika-smestaj/admin-detalj-vlasnika-smestaj.component';
import { AdminDetaljVlasnikaPreporukaComponent } from './admin-detalj-vlasnika-preporuka/admin-detalj-vlasnika-preporuka.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PromenaPodatakaComponent } from './promena-podataka/promena-podataka.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'adminDetaljTuriste', component: AdminDetaljTuristeComponent },
  { path: 'adminDetaljVlasnika', component: AdminDetaljVlasnikaComponent },
  { path: 'adminDetaljVlasnikaSmestaj', component: AdminDetaljVlasnikaSmestajComponent },
  { path: 'adminDetaljVlasnikaPreporuka', component: AdminDetaljVlasnikaPreporukaComponent },
  { path: 'turista', component: TuristaComponent },
  { path: 'vlasnik', component: VlasnikComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'resetLozinke', component: ResetLozinkeComponent },
  { path: 'vlasnikUnesiSmestaj', component: VlasnikUnesiSmestajComponent },
  { path: 'vlasnikUnesiKupon', component: VlasnikUnesiKuponComponent },
  { path: 'vlasnikDetaljanPregledSmestaja', component: VlasnikDetaljanPregledSmestajaComponent },
  { path: 'neregistrovanPregledSmestaja', component: NeregistrovanPregledSmestajaComponent },
  { path: 'vlasnikUnesiPreporuku', component: VlasnikUnesiPreporukuComponent },
  { path: 'vlasnikDetaljPreporuke', component: VlasnikDetaljPreporukeComponent },
  { path: 'turistaRezervisi', component: TuristaRezervisiComponent },
  { path: 'turistaDetaljiRezervacije', component: TuristaDetaljiRezervacijeComponent  },
  { path: 'promenaLozinke', component: PromenaLozinkeComponent  },
  { path: 'promenaPodataka', component: PromenaPodatakaComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
