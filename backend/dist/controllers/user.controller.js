"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserController {
    constructor() {
        this.login = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let lozinka = req.body.lozinka;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme, 'lozinka': lozinka }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.registruj = (req, res) => {
            let user = new user_1.default({
                korisnickoIme: req.body.korisnickoIme,
                lozinka: req.body.lozinka,
                ime: req.body.ime,
                prezime: req.body.prezime,
                kontaktTelefon: req.body.kontaktTelefon,
                email: req.body.email,
                tip: req.body.tip,
                status: 'aktivan'
            });
            user.save().then(ok => {
                res.json({ message: "ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiKorisnikaZaUsername = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            user_1.default.findOne({ 'korisnickoIme': korisnickoIme }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiKorisnikaZaEmail = (req, res) => {
            let email = req.body.email;
            user_1.default.findOne({ 'email': email }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promLozinkuZaEmail = (req, res) => {
            let email = req.body.email;
            let lozinka = req.body.lozinka;
            user_1.default.updateOne({ 'email': email }, { $set: { 'lozinka': lozinka } }).then((user) => {
                res.json({ 'message': 'updated' });
                // ovde da posaljem email
            }).catch((err) => {
                console.log(err);
            });
        };
        this.dohvatiTuriste_I_Vlasnike = (req, res) => {
            user_1.default.find({
                $or: [
                    { tip: 'vlasnik' },
                    { tip: 'turista' }
                ]
            }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniStatusKorisniku = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let status = req.body.status;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'status': status } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniIme = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let ime = req.body.ime;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'ime': ime } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniPrezime = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let prezime = req.body.prezime;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'prezime': prezime } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKontaktTelefon = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let kontaktTelefon = req.body.kontaktTelefon;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'kontaktTelefon': kontaktTelefon } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniEmail = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let email = req.body.email;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'email': email } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.promeniKorisnickoIme = (req, res) => {
            let korisnickoIme = req.body.korisnickoIme;
            let novoKorisnickoIme = req.body.novoKorisnickoIme;
            user_1.default.updateOne({ 'korisnickoIme': korisnickoIme }, { $set: { 'novoKorisnickoIme': novoKorisnickoIme } }).then((user) => {
                res.json({ 'message': 'updated' });
            }).catch((err) => {
                console.log(err);
            });
        };
    }
}
exports.UserController = UserController;
