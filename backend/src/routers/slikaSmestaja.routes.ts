import express from 'express';
import { SlikaSmestajaController } from '../controllers/slikaSmestaja.controller';

const slikaSmestajaRouter = express.Router();


slikaSmestajaRouter.route('/unesiNovuSlikuSmestaja').post(
    (req, res) => new SlikaSmestajaController().unesiNovuSlikuSmestaja(req, res)
)

slikaSmestajaRouter.route('/dohvatiSlikeZaSmestajKorisnika').post(
    (req, res) => new SlikaSmestajaController().dohvatiSlikeZaSmestajKorisnika(req, res)
)

slikaSmestajaRouter.route('/obrisiSliku').post(
    (req, res) => new SlikaSmestajaController().obrisiSliku(req, res)
)

slikaSmestajaRouter.route('/izmeniNaSlikamaNazivSmestaja').post(
    (req, res) => new SlikaSmestajaController().izmeniNaSlikamaNazivSmestaja(req, res)
)

slikaSmestajaRouter.route('/promeniKorisnickoImeNaSlikamaSmestaja').post(
    (req, res) => new SlikaSmestajaController().promeniKorisnickoImeNaSlikamaSmestaja(req, res)
)

export default slikaSmestajaRouter;