import express from 'express';
import { KuponController } from '../controllers/kupon.controller';

const kuponRouter = express.Router();

kuponRouter.route('/dodajKupon').post(
    (req, res) => new KuponController().dodajKupon(req, res)
)

kuponRouter.route('/dohvatiKuponeZaVlasnika').post(
    (req, res) => new KuponController().dohvatiKuponeZaVlasnika(req, res)
)

kuponRouter.route('/promeniKuponOpisNaslov').post(
    (req, res) => new KuponController().promeniKuponOpisNaslov(req, res)
)

kuponRouter.route('/promeniKorisnickoImeNaKuponima').post(
    (req, res) => new KuponController().promeniKorisnickoImeNaKuponima(req, res)
)

export default kuponRouter;