import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import User from '../models/user';
import { EmailService } from '../services/email.service';


@Component({
  selector: 'app-reset-lozinke',
  templateUrl: './reset-lozinke.component.html',
  styleUrls: ['./reset-lozinke.component.css']
})
export class ResetLozinkeComponent {

  constructor(private userService: UserService, private router: Router,private emailService: EmailService){}

  ngOnInit():void{

  }

  email:string;

  sendEmail(to:string,subject:string,text:string) {
    this.emailService.sendEmail(to,subject,text).subscribe(response=>{

    })
  }


  resetuj(){
    this.userService.dohvatiKorisnikaZaEmail(this.email).subscribe((korisnik: User)=>{
      if (korisnik != null && korisnik.status==='aktivan'){
        let passwordLength = Math.floor(Math.random() * (10 - 8 + 1)) + 8;
        let newPassword = this.generatePassword(passwordLength);

        this.userService.promLozinkuZaEmail(this.email,newPassword).subscribe(respObj => {
          // ovde se salje mail
          let text='Vasa nova lozinka je: '+newPassword;
          this.emailService.sendEmail(this.email, 'Vasa lozinka je uspesno promenjena', text).subscribe(
            response => {
              console.log('Email poslat:', response);
              this.router.navigate([''])
            },
            error => {
              console.error('Greška:', error);
            }
          );
        })
      }
      else if(korisnik.status==='blokiran'){  // saljem na mail samo da je korisniku nalog blokiran
        let text='Vas nalog je prethodno blokiran, kontaktirajte korisnicku podrsku.';
          this.emailService.sendEmail(this.email, 'Neuspesna promena lozinke', text).subscribe(
            response => {
              console.log('Email poslat:', response);
              this.router.navigate([''])
            },
            error => {
              console.error('Greška:', error);
            }
          );
      }
    })
  }

  generatePassword(length: number):string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
  }




}

