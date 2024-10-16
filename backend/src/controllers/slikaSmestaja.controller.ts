import * as express from 'express';
import SlikaSmestajaModel from '../models/slikaSmestaja'

export class SlikaSmestajaController{

    
    unesiNovuSlikuSmestaja = (req: express.Request, res: express.Response) => {
        let slikaSmestaja = new SlikaSmestajaModel({
            korisnickoIme: req.body.korisnickoIme,
            nazivSmestaja: req.body.nazivSmestaja,
            nazivSlike: req.body.nazivSlike
        })
            
        slikaSmestaja.save().then(ok=>{ 
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })

    }

    dohvatiSlikeZaSmestajKorisnika = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        
        SlikaSmestajaModel.find({ 'korisnickoIme': korisnickoIme,'nazivSmestaja' : nazivSmestaja}).then((slike)=>{
            res.json(slike)
        }).catch((err)=>{
            console.log(err)
        })
    }

    obrisiSliku = (req: express.Request, res: express.Response) =>{
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivSlike = req.body.nazivSlike;

        SlikaSmestajaModel.deleteOne({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja, 'nazivSlike':nazivSlike}).then((slike)=>{
            res.json('uspesno obrisana slika iz baze')
        }).catch((err)=>{
            console.log(err)
        })
    }

    izmeniNaSlikamaNazivSmestaja = (req: express.Request, res: express.Response) =>{
        let korisnickoIme = req.body.korisnickoIme;
        let nazivSmestaja = req.body.nazivSmestaja;
        let nazivSmestajaUpdate = req.body.nazivSmestajaUpdate;

        SlikaSmestajaModel.updateMany({'korisnickoIme': korisnickoIme,'nazivSmestaja':nazivSmestaja}, {$set: {'nazivSmestaja': nazivSmestajaUpdate}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }

    promeniKorisnickoImeNaSlikamaSmestaja = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        SlikaSmestajaModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }




}