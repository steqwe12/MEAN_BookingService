"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuponController = void 0;
const kupon_1 = __importDefault(require("../models/kupon"));
class KuponController {
    constructor() {
        this.dodajKupon = (req, res) => {
            let kupon = new kupon_1.default({
                korisnickoIme: req.body.korisnickoIme,
                opis: req.body.opis,
                naslov: req.body.naslov,
                fajlIme: req.body.fajlIme
            });
            kupon.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiKuponeZaVlasnika = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            kupon_1.default.find({ 'korisnickoIme': korisnickoIme }).then((kupon) => {
                res.json(kupon);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKuponOpisNaslov = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let opis = req.body.opis;
            let naslov = req.body.naslov;
            let fajlIme = req.body.fajlIme;
            kupon_1.default.updateOne({ korisnickoIme: korisnickoIme, fajlIme: fajlIme }, { $set: { opis: opis, naslov: naslov } })
                .then((resp) => {
                res.json({ message: 'updated' });
            })
                .catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoImeNaKuponima = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            kupon_1.default.updateMany({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.KuponController = KuponController;
