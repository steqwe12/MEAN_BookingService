"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slikaSmestaja_controller_1 = require("../controllers/slikaSmestaja.controller");
const slikaSmestajaRouter = express_1.default.Router();
slikaSmestajaRouter.route('/unesiNovuSlikuSmestaja').post((req, res) => new slikaSmestaja_controller_1.SlikaSmestajaController().unesiNovuSlikuSmestaja(req, res));
slikaSmestajaRouter.route('/dohvatiSlikeZaSmestajKorisnika').post((req, res) => new slikaSmestaja_controller_1.SlikaSmestajaController().dohvatiSlikeZaSmestajKorisnika(req, res));
slikaSmestajaRouter.route('/obrisiSliku').post((req, res) => new slikaSmestaja_controller_1.SlikaSmestajaController().obrisiSliku(req, res));
slikaSmestajaRouter.route('/izmeniNaSlikamaNazivSmestaja').post((req, res) => new slikaSmestaja_controller_1.SlikaSmestajaController().izmeniNaSlikamaNazivSmestaja(req, res));
exports.default = slikaSmestajaRouter;
