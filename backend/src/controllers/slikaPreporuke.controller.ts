import * as express from 'express';
import SlikaPreporukeModel from '../models/slikaPreporuke'

export class SlikaPreporukeController{


    unesiNovuSlikuPreporuke = (req: express.Request, res: express.Response) => {
        let slikaPreporuke = new SlikaPreporukeModel({
            korisnickoIme: req.body.korisnickoIme,
            nazivSmestaja: req.body.nazivSmestaja,
            nazivPreporuke: req.body.nazivPreporuke,
            nazivSlike: req.body.nazivSlike
        })
            
        slikaPreporuke.save().then(ok=>{ 
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })

    }

    dohvatiSlikeZaPreporukuKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivPreporuke = req.body.nazivPreporuke;
        
        SlikaPreporukeModel.find({ 'korisnickoIme': korisnickoIme,'nazivSmestaja' : nazivSmestaja,'nazivPreporuke':nazivPreporuke}).then((slike)=>{
            res.json(slike)
        }).catch((err)=>{
            console.log(err)
        })
    }

    izmeniNaSlikamaNazivPreporuke = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivPreporuke = req.body.nazivPreporuke;
        let nazivPreporukeUpdate = req.body.nazivPreporukeUpdate;

        SlikaPreporukeModel.updateMany({'korisnickoIme': korisnickoIme,'nazivSmestaja':nazivSmestaja,'nazivPreporuke':nazivPreporuke}, {$set: {'nazivPreporuke': nazivPreporukeUpdate}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    promeniKorisnickoImeNaSlikamaPreporuka = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        SlikaPreporukeModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    dohvatiSlikeZaSmestajKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;

        SlikaPreporukeModel.find({'korisnickoIme': korisnickoIme,'nazivSmestaja':nazivSmestaja}).then((slikePreporuka)=>{
            res.json(slikePreporuka)
        }).catch((err)=>{
            console.log(err)
        }) 
    }





}