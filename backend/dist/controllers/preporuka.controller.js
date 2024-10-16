"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreporukaController = void 0;
const preporuka_1 = __importDefault(require("../models/preporuka"));
class PreporukaController {
    constructor() {
        this.dohvatiPreporukeZaVlasnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            preporuka_1.default.find({ 'korisnickoIme': korisnickoIme }).then((preporuke) => {
                res.json(preporuke);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dodajPreporuku = (req, res) => {
            let preporuka = new preporuka_1.default({
                korisnickoIme: req.body.korisnickoIme,
                nazivSmestaja: req.body.nazivSmestaja,
                lat: req.body.lat,
                lng: req.body.lng,
                nazivPreporuke: req.body.nazivPreporuke,
                opisPreporuke: req.body.opisPreporuke,
                tip: req.body.tip
            });
            preporuka.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izbrisiPreporuku = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivPreporuke = req.body.nazivPreporuke;
            preporuka_1.default.deleteOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivPreporuke': nazivPreporuke }).then((preporuka) => {
                res.json(preporuka);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izmeniInfoPreporuke = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivPreporuke = req.body.nazivPreporuke;
            let nazivPreporukeUpdate = req.body.nazivPreporukeUpdate;
            let opisPreporukeUpdate = req.body.opisPreporukeUpdate;
            let tipUpdate = req.body.tipUpdate;
            preporuka_1.default.updateOne({ korisnickoIme: korisnickoIme, nazivSmestaja: nazivSmestaja, nazivPreporuke: nazivPreporuke }, { $set: { nazivPreporuke: nazivPreporukeUpdate, opisPreporuke: opisPreporukeUpdate, tip: tipUpdate } })
                .then((resp) => {
                res.json({ message: 'updated' });
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiJednuPreporuku = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            let nazivPreporuke = req.body.nazivPreporuke;
            preporuka_1.default.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivPreporuke': nazivPreporuke }).then((preporuka) => {
                res.json(preporuka);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiPreporukeZaSmestajVlasnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            preporuka_1.default.find({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((preporuke) => {
                res.json(preporuke);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaPreporukama = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            preporuka_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.izbrisiPreporukeZaSmestaj = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let nazivSmestaja = req.body.nazivSmestaja;
            preporuka_1.default.deleteMany({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((resp) => {
                res.json(resp);
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.PreporukaController = PreporukaController;
