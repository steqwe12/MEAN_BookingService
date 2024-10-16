"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmestajController = void 0;
const smestaj_1 = __importDefault(require("../models/smestaj"));
class SmestajController {
    constructor() {
        this.unesiNoviSmestaj = (req, res) => {
            let smestaj = new smestaj_1.default({
                korisnickoIme: req.body.korisnickoIme,
                nazivSmestaja: req.body.nazivSmestaja,
                opisSmestaja: req.body.opisSmestaja,
                lat: req.body.lat,
                lng: req.body.lng,
                drzava: req.body.drzava,
                grad: req.body.grad
            });
            smestaj.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSmestajeZaVlasnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            smestaj_1.default.find({ 'korisnickoIme': korisnickoIme }).then((smestaj) => {
                res.json(smestaj);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSmestaj = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            smestaj_1.default.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((smestaj) => {
                res.json(smestaj);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiSveSmestaje = (req, res) => {
            smestaj_1.default.find().then((smestaj) => {
                res.json(smestaj);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izmeniInfoSmestaja = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivSmestajaUpdate = req.body.nazivSmestajaUpdate;
            let opisSmestajaUpdate = req.body.opisSmestajaUpdate;
            smestaj_1.default.updateOne({ korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja }, { $set: { nazivSmestaja: nazivSmestajaUpdate, opisSmestaja: opisSmestajaUpdate } })
                .then((resp) => {
                res.json({ message: 'updated' });
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.izbrisiSmestaj = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            smestaj_1.default.deleteOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((smestaj) => {
                res.json(smestaj);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaSmestajima = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            smestaj_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.SmestajController = SmestajController;
