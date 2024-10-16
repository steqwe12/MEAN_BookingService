import * as express from 'express';
import RezervacijaModel from '../models/rezervacija'

export class RezervacijaController{

    
    dohvatiRezervacijeSmestaja = (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;
        let nazivSmestaja = req.body.nazivSmestaja;

        
        RezervacijaModel.find({ 'vlasnik': vlasnik,'nazivSmestaja' : nazivSmestaja}).then((rez)=>{
            res.json(rez)
        }).catch((err)=>{
            console.log(err)
        })
    }

    rezervisi = (req: express.Request, res: express.Response) => {   
        let rezervacija = new RezervacijaModel({
            turista: req.body.turista,
            vlasnik: req.body.vlasnik,
            datumDo: req.body.datumDo,
            datumOd: req.body.datumOd,
            nazivSmestaja: req.body.nazivSmestaja
        })
              
        rezervacija.save().then(ok=>{  
            res.json({message: "ok"})
        }).catch((err)=>{
            console.log(err)
        })
    }

    dohvatiRezervacijeTuriste = (req: express.Request, res: express.Response) => {
        let turista = req.body.turista;
 
        RezervacijaModel.find({ 'turista': turista}).then((rez)=>{
            res.json(rez)
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    dohvatiRezervacijeVlasnika = (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;
 
        RezervacijaModel.find({ 'vlasnik': vlasnik}).then((rez)=>{
            res.json(rez)
        }).catch((err)=>{
            console.log(err)
        })
    }

    ukloniRezervaciju = (req: express.Request, res: express.Response) => {
        let turista = req.body.turista;
        let vlasnik = req.body.vlasnik;
        let datumOd = req.body.datumOd;
        let datumDo = req.body.datumDo;
        let nazivSmestaja = req.body.nazivSmestaja;

        RezervacijaModel.deleteOne({'turista': turista, 'vlasnik':vlasnik,'datumOd':datumOd,'datumDo':datumDo,'nazivSmestaja':nazivSmestaja}).then((preporuka)=>{
            res.json(preporuka)
        }).catch((err)=>{
            console.log(err)
        })
    }

    promeniKorisnickoImeNaRezervacijama = (req: express.Request, res: express.Response) => {
        let korisnickoIme = req.body.korisnickoIme;
        let novoKorisnickoIme = req.body.novoKorisnickoIme;

        RezervacijaModel.updateMany({'korisnickoIme': korisnickoIme}, {$set: {'novoKorisnickoIme': novoKorisnickoIme}}).then((user)=>{
            res.json({'message': 'updated'})
        }).catch((err)=>{
            console.log(err)
        }) 
    }


    

}