import express from 'express';
import { SmestajController } from '../controllers/smestaj.controller';

const smestajRouter = express.Router();

smestajRouter.route('/unesiNoviSmestaj').post(
    (req, res) => new SmestajController().unesiNoviSmestaj(req, res)
)

smestajRouter.route('/dohvatiSmestajeZaVlasnika').post(
    (req, res) => new SmestajController().dohvatiSmestajeZaVlasnika(req, res)
)

smestajRouter.route('/dohvatiSmestaj').post(
    (req, res) => new SmestajController().dohvatiSmestaj(req, res)
)

smestajRouter.route('/dohvatiSveSmestaje').post(
    (req, res) => new SmestajController().dohvatiSveSmestaje(req, res)
)

smestajRouter.route('/izmeniInfoSmestaja').post(
    (req, res) => new SmestajController().izmeniInfoSmestaja(req, res)
)

smestajRouter.route('/izbrisiSmestaj').post(
    (req, res) => new SmestajController().izbrisiSmestaj(req, res)
)

smestajRouter.route('/promeniKorisnickoImeNaSmestajima').post(
    (req, res) => new SmestajController().promeniKorisnickoImeNaSmestajima(req, res)
)

export default smestajRouter;