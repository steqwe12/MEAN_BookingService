"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RezervacijaController = void 0;
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
class RezervacijaController {
    constructor() {
        this.dohvatiRezervacijeSmestaja = (req, res) => {
            let vlasnik = req.body.vlasnik;
            let nazivSmestaja = req.body.nazivSmestaja;
            rezervacija_1.default.find({ 'vlasnik': vlasnik, 'nazivSmestaja': nazivSmestaja }).then((rez) => {
                res.json(rez);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.rezervisi = (req, res) => {
            let rezervacija = new rezervacija_1.default({
                turista: req.body.turista,
                vlasnik: req.body.vlasnik,
                datumDo: req.body.datumDo,
                datumOd: req.body.datumOd,
                nazivSmestaja: req.body.nazivSmestaja
            });
            rezervacija.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiRezervacijeTuriste = (req, res) => {
            let turista = req.body.turista;
            rezervacija_1.default.find({ 'turista': turista }).then((rez) => {
                res.json(rez);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiRezervacijeVlasnika = (req, res) => {
            let vlasnik = req.body.vlasnik;
            rezervacija_1.default.find({ 'vlasnik': vlasnik }).then((rez) => {
                res.json(rez);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.ukloniRezervaciju = (req, res) => {
            let turista = req.body.turista;
            let vlasnik = req.body.vlasnik;
            let datumOd = req.body.datumOd;
            let datumDo = req.body.datumDo;
            let nazivSmestaja = req.body.nazivSmestaja;
            rezervacija_1.default.deleteOne({ 'turista': turista, 'vlasnik': vlasnik, 'datumOd': datumOd, 'datumDo': datumDo, 'nazivSmestaja': nazivSmestaja }).then((preporuka) => {
                res.json(preporuka);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaRezervacijama = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            rezervacija_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.RezervacijaController = RezervacijaController;
