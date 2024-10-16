import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)

userRouter.route('/registruj').post(
    (req, res) => new UserController().registruj(req, res)
)

userRouter.route('/dohvatiKorisnikaZaUsername').post(
    (req, res) => new UserController().dohvatiKorisnikaZaUsername(req, res)
)

userRouter.route('/dohvatiKorisnikaZaEmail').post(
    (req, res) => new UserController().dohvatiKorisnikaZaEmail(req, res)
)

userRouter.route('/promLozinkuZaEmail').post(
    (req, res) => new UserController().promLozinkuZaEmail(req, res)
)

userRouter.route('/dohvatiTuriste_I_Vlasnike').post(
    (req, res) => new UserController().dohvatiTuriste_I_Vlasnike(req, res)
)

userRouter.route('/promeniStatusKorisniku').post(
    (req, res) => new UserController().promeniStatusKorisniku(req, res)
)

userRouter.route('/promeniIme').post(
    (req, res) => new UserController().promeniIme(req, res)
)

userRouter.route('/promeniPrezime').post(
    (req, res) => new UserController().promeniPrezime(req, res)
)

userRouter.route('/promeniKontaktTelefon').post(
    (req, res) => new UserController().promeniKontaktTelefon(req, res)
)

userRouter.route('/promeniEmail').post(
    (req, res) => new UserController().promeniEmail(req, res)
)

userRouter.route('/promeniKorisnickoIme').post(
    (req, res) => new UserController().promeniKorisnickoIme(req, res)
)





export default userRouter;