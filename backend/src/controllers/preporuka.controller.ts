import * as express from 'express';
import PreporukaModel from '../models/preporuka'

export class PreporukaController{

    
    dohvatiPreporukeZaVlasnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        
        PreporukaModel.find({ 'korisnickoIme': korisnickoIme }).then((preporuke)=>{
            res.json(preporuke)
        }).catch((err)=>{
            console.log(err)
        })
    }

    dodajPreporuku = (req: express.Request, res: express.Response) => {
        let preporuka = new PreporukaModel({
            korisnickoIme: req.body.korisnickoIme,
            nazivSmestaja: req.body.nazivSmestaja,
            lat: req.body.lat,
            lng: req.body.lng,
            nazivPreporuke: req.body.nazivPreporuke,
            opisPreporuke: req.body.opisPreporuke,
            tip: req.body.tip
       })
              
       preporuka.save().then(ok=>{  //new UserM(user).save().then
           res.json({message: "ok"})
       }).catch((err)=>{
           console.log(err)
       })
    }

    izbrisiPreporuku = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivPreporuke = req.body.nazivPreporuke;

        PreporukaModel.deleteOne({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja,'nazivPreporuke':nazivPreporuke}).then((preporuka)=>{
            res.json(preporuka)
        }).catch((err)=>{
            console.log(err)
        })
    }

    izmeniInfoPreporuke = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivPreporuke = req.body.nazivPreporuke;
        let nazivPreporukeUpdate = req.body.nazivPreporukeUpdate;
        let opisPreporukeUpdate = req.body.opisPreporukeUpdate;
        let tipUpdate = req.body.tipUpdate;

        PreporukaModel.updateOne(
            { korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja, nazivPreporuke:nazivPreporuke },
            { $set: { nazivPreporuke: nazivPreporukeUpdate, opisPreporuke: opisPreporukeUpdate, tip: tipUpdate } }
          )
          .then((resp) => {
            res.json({ message: 'updated' });
          })
          .catch((err) => {
            console.log(err);
          }); 
    }

    dohvatiJednuPreporuku = (req: express.Request, res: express.Response) => {
        let korisnickoIme= req.body.korisnickoIme;
        let nazivSmestaja= req.body.nazivSmestaja;
        let nazivPreporuke= req.body.nazivPreporuke;

        PreporukaModel.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivPreporuke':nazivPreporuke}).then((preporuka)=>{
            res.json(preporuka)
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    dohvatiPreporukeZaSmestajVlasnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme= req.body.korisnickoIme;
        let nazivSmestaja= req.body.nazivSmestaja;

        PreporukaModel.find({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja}).then((preporuke)=>{
            res.json(preporuke)
        }).catch((err)=>{
            console.log(err)
        })
    }

    promeniKorisnickoImeNaPreporukama = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        PreporukaModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    izbrisiPreporukeZaSmestaj = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;

        PreporukaModel.deleteMany({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja}).then((resp)=>{
            res.json(resp)
        }).catch((err)=>{
            console.log(err)
        }) 
    }



    

}