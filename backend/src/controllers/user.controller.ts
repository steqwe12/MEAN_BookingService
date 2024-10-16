import * as express from 'express';
import UserModel from '../models/user'


export class UserController{
    login = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let lozinka = req.body.lozinka;
        
        UserModel.findOne({ 'korisnickoIme': korisnickoIme, 'lozinka': lozinka}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })        
    }
    
    registruj = (req: express.Request, res: express.Response) => {
        let user = new UserModel({
             korisnickoIme: req.body.korisnickoIme,
             lozinka: req.body.lozinka,
             ime: req.body.ime,
             prezime: req.body.prezime,
             kontaktTelefon: req.body.kontaktTelefon,
             email: req.body.email,
             tip: req.body.tip,
             status: 'aktivan'
        })
               
        user.save().then(ok=>{  //new UserM(user).save().then
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })

    }

    dohvatiKorisnikaZaUsername = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        UserModel.findOne({'korisnickoIme': korisnickoIme}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })        

    }

    dohvatiKorisnikaZaEmail = (req: express.Request, res: express.Response)=>{
        let email = req.body.email;
        UserModel.findOne({'email': email}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    promLozinkuZaEmail = (req: express.Request, res: express.Response)=>{
        let email = req.body.email;
        let lozinka = req.body.lozinka;

        UserModel.updateOne({'email': email}, {$set: {'lozinka': lozinka}}).then((user)=>{
            res.json({'message': 'updated'})

            // ovde da posaljem email
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    dohvatiTuriste_I_Vlasnike = (req: express.Request, res: express.Response) => {   
        UserModel.find({
            $or: [
                { tip: 'vlasnik' },
                { tip: 'turista' }
            ]
        }).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })        
    }

    promeniStatusKorisniku = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        let status = req.body.status;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'status': status}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    promeniIme = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        let ime = req.body.ime;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'ime': ime}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    promeniPrezime = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        let prezime = req.body.prezime;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'prezime': prezime}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    promeniKontaktTelefon = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        let kontaktTelefon = req.body.kontaktTelefon;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'kontaktTelefon': kontaktTelefon}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    promeniEmail = (req: express.Request, res: express.Response)=>{
        let korisnickoIme = req.body.korisnickoIme;
        let email = req.body.email;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'email': email}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        })                  
    }

    promeniKorisnickoIme = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        UserModel.updateOne({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }
    






}