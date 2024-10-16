"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const smestaj_controller_1 = require("../controllers/smestaj.controller");
const smestajRouter = express_1.default.Router();
smestajRouter.route('/unesiNoviSmestaj').post((req, res) => new smestaj_controller_1.SmestajController().unesiNoviSmestaj(req, res));
smestajRouter.route('/dohvatiSmestajeZaVlasnika').post((req, res) => new smestaj_controller_1.SmestajController().dohvatiSmestajeZaVlasnika(req, res));
smestajRouter.route('/dohvatiSmestaj').post((req, res) => new smestaj_controller_1.SmestajController().dohvatiSmestaj(req, res));
smestajRouter.route('/dohvatiSveSmestaje').post((req, res) => new smestaj_controller_1.SmestajController().dohvatiSveSmestaje(req, res));
smestajRouter.route('/izmeniInfoSmestaja').post((req, res) => new smestaj_controller_1.SmestajController().izmeniInfoSmestaja(req, res));
smestajRouter.route('/izbrisiSmestaj').post((req, res) => new smestaj_controller_1.SmestajController().izbrisiSmestaj(req, res));
smestajRouter.route('/promeniKorisnickoImeNaSmestajima').post((req, res) => new smestaj_controller_1.SmestajController().promeniKorisnickoImeNaSmestajima(req, res));
exports.default = smestajRouter;
