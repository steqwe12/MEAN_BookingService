import * as express from 'express';
import KuponModel from '../models/kupon'

export class KuponController{


    dodajKupon = (req: express.Request, res: express.Response) => {
        let kupon = new KuponModel({
             korisnickoIme: req.body.korisnickoIme,
             opis: req.body.opis,
             naslov: req.body.naslov,
             fajlIme: req.body.fajlIme
        })
               
        kupon.save().then(ok=>{  
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })

    }
      
    dohvatiKuponeZaVlasnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        
        KuponModel.find({ 'korisnickoIme': korisnickoIme}).then((kupon)=>{
            res.json(kupon)
        }).catch((err)=>{
            console.log(err)
        })
    }

    promeniKuponOpisNaslov = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let opis = req.body.opis;
        let naslov = req.body.naslov;
        let fajlIme = req.body.fajlIme;

        KuponModel.updateOne(
            { korisnickoIme: korisnickoIme, fajlIme: fajlIme },
            { $set: { opis: opis, naslov: naslov } }
          )
          .then((resp) => {
            res.json({ message: 'updated' });
          })
          .catch((err) => {
            console.log(err);
          }); 
    }

    promeniKorisnickoImeNaKuponima = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        KuponModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }



}