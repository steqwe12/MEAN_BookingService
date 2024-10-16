import express from 'express';
import { PreporukaController } from '../controllers/preporuka.controller';

const preporukaRouter = express.Router();


preporukaRouter.route('/dohvatiPreporukeZaVlasnika').post(
    (req, res) => new PreporukaController().dohvatiPreporukeZaVlasnika(req, res)
)

preporukaRouter.route('/dodajPreporuku').post(
    (req, res) => new PreporukaController().dodajPreporuku(req, res)
)

preporukaRouter.route('/izbrisiPreporuku').post(
    (req, res) => new PreporukaController().izbrisiPreporuku(req, res)
)

preporukaRouter.route('/izmeniInfoPreporuke').post(
    (req, res) => new PreporukaController().izmeniInfoPreporuke(req, res)
)

preporukaRouter.route('/dohvatiJednuPreporuku').post(
    (req, res) => new PreporukaController().dohvatiJednuPreporuku(req, res)
)

preporukaRouter.route('/dohvatiPreporukeZaSmestajVlasnika').post(
    (req, res) => new PreporukaController().dohvatiPreporukeZaSmestajVlasnika(req, res)
)

preporukaRouter.route('/promeniKorisnickoImeNaPreporukama').post(
    (req, res) => new PreporukaController().promeniKorisnickoImeNaPreporukama(req, res)
)

preporukaRouter.route('/izbrisiPreporukeZaSmestaj').post(
    (req, res) => new PreporukaController().izbrisiPreporukeZaSmestaj(req, res)
)

export default preporukaRouter;