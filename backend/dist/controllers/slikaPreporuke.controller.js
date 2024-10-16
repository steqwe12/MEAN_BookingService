"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlikaPreporukeController = void 0;
const slikaPreporuke_1 = __importDefault(require("../models/slikaPreporuke"));
class SlikaPreporukeController {
    constructor() {
        this.unesiNovuSlikuPreporuke = (req, res) => {
            let slikaPreporuke = new slikaPreporuke_1.default({
                korisnickoIme: req.body.korisnickoIme,
                nazivSmestaja: req.body.nazivSmestaja,
                nazivPreporuke: req.body.nazivPreporuke,
                nazivSlike: req.body.nazivSlike
            });
            slikaPreporuke.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSlikeZaPreporukuKorisnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivPreporuke = req.body.nazivPreporuke;
            slikaPreporuke_1.default.find({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivPreporuke': nazivPreporuke }).then((slike) => {
                res.json(slike);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izmeniNaSlikamaNazivPreporuke = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivPreporuke = req.body.nazivPreporuke;
            let nazivPreporukeUpdate = req.body.nazivPreporukeUpdate;
            slikaPreporuke_1.default.updateMany({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivPreporuke': nazivPreporuke }, { $set: { 'nazivPreporuke': nazivPreporukeUpdate } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaSlikamaPreporuka = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            slikaPreporuke_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSlikeZaSmestajKorisnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            slikaPreporuke_1.default.find({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((slikePreporuka) => {
                res.json(slikePreporuka);
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.SlikaPreporukeController = SlikaPreporukeController;
