"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlikaSmestajaController = void 0;
const slikaSmestaja_1 = __importDefault(require("../models/slikaSmestaja"));
class SlikaSmestajaController {
    constructor() {
        this.unesiNovuSlikuSmestaja = (req, res) => {
            let slikaSmestaja = new slikaSmestaja_1.default({
                korisnickoIme: req.body.korisnickoIme,
                nazivSmestaja: req.body.nazivSmestaja,
                nazivSlike: req.body.nazivSlike
            });
            slikaSmestaja.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSlikeZaSmestajKorisnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            slikaSmestaja_1.default.find({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((slike) => {
                res.json(slike);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.obrisiSliku = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivSlike = req.body.nazivSlike;
            slikaSmestaja_1.default.deleteOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivSlike': nazivSlike }).then((slike) => {
                res.json('uspesno obrisana slika iz baze');
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izmeniNaSlikamaNazivSmestaja = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivSmestajaUpdate = req.body.nazivSmestajaUpdate;
            slikaSmestaja_1.default.updateMany({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }, { $set: { 'nazivSmestaja': nazivSmestajaUpdate } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaSlikamaSmestaja = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            slikaSmestaja_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.SlikaSmestajaController = SlikaSmestajaController;
