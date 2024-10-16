import express from 'express';
import { SlikaPreporukeController } from '../controllers/slikaPreporuke.controller';

const slikaPreporukeRouter = express.Router();

slikaPreporukeRouter.route('/unesiNovuSlikuPreporuke').post(
    (req, res) => new SlikaPreporukeController().unesiNovuSlikuPreporuke(req, res)
)

slikaPreporukeRouter.route('/dohvatiSlikeZaPreporukuKorisnika').post(
    (req, res) => new SlikaPreporukeController().dohvatiSlikeZaPreporukuKorisnika(req, res)
)

slikaPreporukeRouter.route('/izmeniNaSlikamaNazivPreporuke').post(
    (req, res) => new SlikaPreporukeController().izmeniNaSlikamaNazivPreporuke(req, res)
)

slikaPreporukeRouter.route('/promeniKorisnickoImeNaSlikamaPreporuka').post(
    (req, res) => new SlikaPreporukeController().promeniKorisnickoImeNaSlikamaPreporuka(req, res)
)

slikaPreporukeRouter.route('/dohvatiSlikeZaSmestajKorisnika').post(
    (req, res) => new SlikaPreporukeController().dohvatiSlikeZaSmestajKorisnika(req, res)
)

export default slikaPreporukeRouter;