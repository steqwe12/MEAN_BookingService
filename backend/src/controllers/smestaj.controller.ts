import * as express from 'express';
import SmestajModel from '../models/smestaj'

export class SmestajController{


    unesiNoviSmestaj = (req: express.Request, res: express.Response) => {
        let smestaj = new SmestajModel({
            korisnickoIme: req.body.korisnickoIme,
            nazivSmestaja: req.body.nazivSmestaja,
            opisSmestaja: req.body.opisSmestaja,
            lat: req.body.lat,
            lng: req.body.lng,
            drzava: req.body.drzava,
            grad: req.body.grad
        })
            
        smestaj.save().then(ok=>{ 
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })

    }

    dohvatiSmestajeZaVlasnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        
        SmestajModel.find({ 'korisnickoIme': korisnickoIme}).then((smestaj)=>{
            res.json(smestaj)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvatiSmestaj = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        
        SmestajModel.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja}).then((smestaj)=>{
            res.json(smestaj)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvatiSveSmestaje = (req: express.Request, res: express.Response) => {      
        SmestajModel.find().then((smestaj)=>{
            res.json(smestaj)
        }).catch((err)=>{
            console.log(err)
        })
    }

    izmeniInfoSmestaja = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivSmestajaUpdate = req.body.nazivSmestajaUpdate;
        let opisSmestajaUpdate = req.body.opisSmestajaUpdate;

        SmestajModel.updateOne(
            { korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja },
            { $set: { nazivSmestaja: nazivSmestajaUpdate, opisSmestaja: opisSmestajaUpdate } }
          )
          .then((resp) => {
            res.json({ message: 'updated' });
          })
          .catch((err) => {
            console.log(err);
          });          
    }

    
    izbrisiSmestaj = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;

        SmestajModel.deleteOne({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja}).then((smestaj)=>{
            res.json(smestaj)
        }).catch((err)=>{
            console.log(err)
        })
    }

    promeniKorisnickoImeNaSmestajima = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        SmestajModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }




}