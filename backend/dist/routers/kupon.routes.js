"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kupon_controller_1 = require("../controllers/kupon.controller");
const kuponRouter = express_1.default.Router();
kuponRouter.route('/dodajKupon').post((req, res) => new kupon_controller_1.KuponController().dodajKupon(req, res));
kuponRouter.route('/dohvatiKuponeZaVlasnika').post((req, res) => new kupon_controller_1.KuponController().dohvatiKuponeZaVlasnika(req, res));
kuponRouter.route('/promeniKuponOpisNaslov').post((req, res) => new kupon_controller_1.KuponController().promeniKuponOpisNaslov(req, res));
kuponRouter.route('/promeniKorisnickoImeNaKuponima').post((req, res) => new kupon_controller_1.KuponController().promeniKorisnickoImeNaKuponima(req, res));
exports.default = kuponRouter;
