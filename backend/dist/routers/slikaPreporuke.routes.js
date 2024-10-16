"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slikaPreporuke_controller_1 = require("../controllers/slikaPreporuke.controller");
const slikaPreporukeRouter = express_1.default.Router();
slikaPreporukeRouter.route('/unesiNovuSlikuPreporuke').post((req, res) => new slikaPreporuke_controller_1.SlikaPreporukeController().unesiNovuSlikuPreporuke(req, res));
slikaPreporukeRouter.route('/dohvatiSlikeZaPreporukuKorisnika').post((req, res) => new slikaPreporuke_controller_1.SlikaPreporukeController().dohvatiSlikeZaPreporukuKorisnika(req, res));
slikaPreporukeRouter.route('/izmeniNaSlikamaNazivPreporuke').post((req, res) => new slikaPreporuke_controller_1.SlikaPreporukeController().izmeniNaSlikamaNazivPreporuke(req, res));
slikaPreporukeRouter.route('/promeniKorisnickoImeNaSlikamaPreporuka').post((req, res) => new slikaPreporuke_controller_1.SlikaPreporukeController().promeniKorisnickoImeNaSlikamaPreporuka(req, res));
slikaPreporukeRouter.route('/dohvatiSlikeZaSmestajKorisnika').post((req, res) => new slikaPreporuke_controller_1.SlikaPreporukeController().dohvatiSlikeZaSmestajKorisnika(req, res));
exports.default = slikaPreporukeRouter;
