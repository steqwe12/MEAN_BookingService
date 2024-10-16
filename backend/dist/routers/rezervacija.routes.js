"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rezervacija_controller_1 = require("../controllers/rezervacija.controller");
const rezervacijaRouter = express_1.default.Router();
rezervacijaRouter.route('/dohvatiRezervacijeSmestaja').post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiRezervacijeSmestaja(req, res));
rezervacijaRouter.route('/rezervisi').post((req, res) => new rezervacija_controller_1.RezervacijaController().rezervisi(req, res));
rezervacijaRouter.route('/dohvatiRezervacijeTuriste').post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiRezervacijeTuriste(req, res));
rezervacijaRouter.route('/dohvatiRezervacijeVlasnika').post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiRezervacijeVlasnika(req, res));
rezervacijaRouter.route('/ukloniRezervaciju').post((req, res) => new rezervacija_controller_1.RezervacijaController().ukloniRezervaciju(req, res));
rezervacijaRouter.route('/promeniKorisnickoImeNaRezervacijama').post((req, res) => new rezervacija_controller_1.RezervacijaController().promeniKorisnickoImeNaRezervacijama(req, res));
exports.default = rezervacijaRouter;
