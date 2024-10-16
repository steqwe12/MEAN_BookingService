"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const preporuka_controller_1 = require("../controllers/preporuka.controller");
const preporukaRouter = express_1.default.Router();
preporukaRouter.route('/dohvatiPreporukeZaVlasnika').post((req, res) => new preporuka_controller_1.PreporukaController().dohvatiPreporukeZaVlasnika(req, res));
preporukaRouter.route('/dodajPreporuku').post((req, res) => new preporuka_controller_1.PreporukaController().dodajPreporuku(req, res));
preporukaRouter.route('/izbrisiPreporuku').post((req, res) => new preporuka_controller_1.PreporukaController().izbrisiPreporuku(req, res));
preporukaRouter.route('/izmeniInfoPreporuke').post((req, res) => new preporuka_controller_1.PreporukaController().izmeniInfoPreporuke(req, res));
preporukaRouter.route('/dohvatiJednuPreporuku').post((req, res) => new preporuka_controller_1.PreporukaController().dohvatiJednuPreporuku(req, res));
preporukaRouter.route('/dohvatiPreporukeZaSmestajVlasnika').post((req, res) => new preporuka_controller_1.PreporukaController().dohvatiPreporukeZaSmestajVlasnika(req, res));
preporukaRouter.route('/promeniKorisnickoImeNaPreporukama').post((req, res) => new preporuka_controller_1.PreporukaController().promeniKorisnickoImeNaPreporukama(req, res));
preporukaRouter.route('/izbrisiPreporukeZaSmestaj').post((req, res) => new preporuka_controller_1.PreporukaController().izbrisiPreporukeZaSmestaj(req, res));
exports.default = preporukaRouter;
