import express from 'express';
import { RezervacijaController } from '../controllers/rezervacija.controller';

const rezervacijaRouter = express.Router();


rezervacijaRouter.route('/dohvatiRezervacijeSmestaja').post(
    (req, res) => new RezervacijaController().dohvatiRezervacijeSmestaja(req, res)
)

rezervacijaRouter.route('/rezervisi').post(
    (req, res) => new RezervacijaController().rezervisi(req, res)
)

rezervacijaRouter.route('/dohvatiRezervacijeTuriste').post(
    (req, res) => new RezervacijaController().dohvatiRezervacijeTuriste(req, res)
)

rezervacijaRouter.route('/dohvatiRezervacijeVlasnika').post(
    (req, res) => new RezervacijaController().dohvatiRezervacijeVlasnika(req, res)
)

rezervacijaRouter.route('/ukloniRezervaciju').post(
    (req, res) => new RezervacijaController().ukloniRezervaciju(req, res)
)

rezervacijaRouter.route('/promeniKorisnickoImeNaRezervacijama').post(
    (req, res) => new RezervacijaController().promeniKorisnickoImeNaRezervacijama(req, res)
)

export default rezervacijaRouter;