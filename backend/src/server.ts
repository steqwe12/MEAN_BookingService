import express from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routers/user.routes';
import smestajRouter from './routers/smestaj.routes';
import slikaSmestajaRouter from './routers/slikaSmestaja.routes';
import preporukaRouter from './routers/preporuka.routes';
import slikaPreporukeRouter from './routers/slikaPreporuke.routes';

import nodemailer from 'nodemailer'; // dodato
import kuponRouter from './routers/kupon.routes';

const app = express();

app.use(cors())
app.use(express.json())




////////////SLANJE MAILA/////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({    // za slanje emaila
    service: 'gmail',
    auth: {
        user: 'diplomskiradsajt@gmail.com', // mopj Gmail nalog
        pass: 'tipc zxim arma buok' // app password koji sam generisao za naziv app: Moja aplikacija; iz app.component.ts(nisam siguran da li je bitno ovo)
    }
});

app.post('/api/send-email', (req, res) => {     // za slanje emaila
    const { to, subject, text } = req.body;

    transporter.sendMail({
        from: 'diplomskiradsajt@gmail.com', // moj Gmail nalog
        to,
        subject,
        text
    }, (error, info) => {
        if (error) {
            console.error('Greška pri slanju emaila:', error);
            return res.status(500).json({ error: 'Error sending email', details: error });
        }
        res.status(200).json({ message: 'Email poslat', response: info.response });
    });
});

////////////UPLOAD KUPONA////////////////////////////////////////////////////////
//const multer = require('multer');
//const path = require('path');

// Konfigurišemo gde će se fajlovi čuvati i pod kojim imenom
const storage = multer.diskStorage({
    destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, 'files/'); // mozda files/
    },
    filename: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  

// Postavljamo filter za fajlove (proverava tip fajla)
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedFileTypes = /pdf|doc|docx/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Greška: Dozvoljeni su samo PDF, DOC, i DOCX fajlovi!'));
    }
  };

// Inicijalizujemo upload
const upload = multer({ storage: storage });
//const upload = multer({
//  storage: storage,
//  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimalna veličina 5 MB
//  fileFilter: fileFilter
//}).single('file');

// Ruta za upload fajla
app.post('/dodajKuponFajlBackend', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nije poslat fajl.' });
    }

    // Ovdje vraćamo ime fajla koje je generisano na backend-u
    res.status(200).json({ message: 'Fajl uspešno uploadovan!', fileName: req.file.filename });
});

app.get('/files/:filename', (req, res) => { // ovo je da bi moglo da se skine, zato sto su 4000 i 4200 razliciti pa browseri imaju protection
    const filePath = path.join('', 'files', req.params.filename);
    res.download(filePath); // This will trigger a download
  });

//////////BRISANJE KUPONA///////////////////////////////////////////////////////////////  
import * as fs from 'fs';
import KuponModel from './models/kupon'


app.delete('/apikuponi/:korisnickoIme/:fajlIme', (req, res) => {
    const { korisnickoIme, fajlIme } = req.params;
    const filePath = path.join(__dirname,'../files',fajlIme)

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('Fajl ne postoji:', filePath);
          return res.status(404).send('Fajl ne postoji.');
        }
        // Logika za brisanje fajla iz sistema
        fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Greška prilikom brisanja fajla:', err);
            return res.status(500).send('Greška prilikom brisanja fajla.');
        }
    
            // Logika za brisanje kupona iz baze podataka
            KuponModel.findOneAndDelete({ korisnickoIme, fajlIme })
            .then(() => res.send('Kupon obrisan.'))
            .catch(err => {
            console.error('Greška prilikom brisanja kupona:', err);
            res.status(500).send('Greška prilikom brisanja kupona.');
            });

        });
    });

  });

//////////////////UPLOAD SLIKE////////////////////////////////////////////////////////
const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder gde se slike čuvaju
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Koristimo ime koje smo generisali na frontendu
    }
});
  
  const upload2 = multer({ storage: storage2 });
  
// Ruta za čuvanje slike
app.post('/sacuvajSliku', upload2.single('slika'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nije poslata slika.' });
    }

    res.status(200).json({ message: 'Slika uspešno sačuvana!', fileName: req.file.filename });
});
  
////////DOHVATAMO IME 1 SLIKE ZA SMESTAJ, NALAZIMO I VRACAMO STVARNU SLIKU//////////
import SlikaSmestajaModel from './models/slikaSmestaja'
app.post('/dohvatiPrvuSlikuSmestaja',(req: express.Request, res: express.Response) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
        
    SlikaSmestajaModel.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja' : nazivSmestaja}).then((slikaSmestaja)=>{
        //slikaSmestaja.nazivSlike ; da se ovo ime slike iskoristi da se dohvati File koji se nalazi na ../uploads/'ime slike'
        if (slikaSmestaja && slikaSmestaja.nazivSlike) {
            // Putanja do slike
            const filePath = path.join(__dirname, '../uploads', slikaSmestaja.nazivSlike);

            // Proveravamo da li fajl postoji
            fs.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    return res.status(404).json({ message: 'Slika nije pronađena.' });
                }

                // Vraćamo sliku kao binarni sadržaj
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Greška prilikom slanja slike.');
                    }
                });
            });
        } else {
            res.status(404).json({ message: 'Slika nije pronađena.' });
        }

       // res.json(slika); ovde treba valjda stvarna slika tipa File da se vrati
    }).catch((err)=>{
        console.log(err)
    })
});

///////////NA OSNOVNU IMENA SLIKE VRACAMO STVARNU JEDNU SLIKU/////////////////////////
// import SlikaSmestajaModel from './models/slikaSmestaja'
app.post('/dohvatiSlikuZaImeSlike',(req: express.Request, res: express.Response) => {
    let nazivSlike = req.body.nazivSlike;
    if (nazivSlike) {
        // Putanja do slike
        const filePath = path.join(__dirname, '../uploads', nazivSlike);

        // Proveravamo da li fajl postoji
        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).json({ message: 'Slika nije pronađena.' });
            }

            // Vraćamo sliku kao binarni sadržaj
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Greška prilikom slanja slike.');
                }
            });
        });
    } else {
        res.status(404).json({ message: 'Slika nije pronađena.' });
    }
});

//////////////BRISEMO 1 SLIKU SMESTAJA SA SERVERA I BAZE///////////////////////////////////////
app.post('/obrisiSlikuSmestaja', (req: express.Request, res: express.Response) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
    let nazivSlike = req.body.nazivSlike;

    SlikaSmestajaModel.deleteOne({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja, 'nazivSlike':nazivSlike}).then((slike)=>{
        if (nazivSlike) {
            // Putanja do slike
            const filePath = path.join(__dirname, '../uploads', nazivSlike);
    
            // Proveravamo da li fajl postoji
            fs.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    return res.status(404).json({ message: 'Slika nije pronađena.' });
                }
    
                // Brišemo fajl
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Greška prilikom brisanja slike:', err);
                        return res.status(500).json({ message: 'Greška prilikom brisanja slike.' });
                    }
    
                    // Uspešno obrisano
                    res.json({ success: true, message: 'Slika je uspešno obrisana.' });
                });
            });
        } else {
            res.status(400).json({ message: 'Naziv slike nije prosleđen.' });
        }
    }).catch((err)=>{
        console.log(err)
    })
});

////////////////BRISEMO 1 SLIKU PREPORUKE SA SERVERA I BAZE//////////////////////////////////
import SlikaPreporukeModel from './models/slikaPreporuke'
import rezervacijaRouter from './routers/rezervacija.routes';
app.post('/obrisiSlikuPreporuke', (req: express.Request, res: express.Response) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
    let nazivSlike = req.body.nazivSlike;

    SlikaPreporukeModel.deleteOne({'korisnickoIme': korisnickoIme, 'nazivSmestaja':nazivSmestaja, 'nazivSlike':nazivSlike}).then((slike)=>{
        if (nazivSlike) {
            // Putanja do slike
            const filePath = path.join(__dirname, '../uploads', nazivSlike);
    
            // Proveravamo da li fajl postoji
            fs.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    return res.status(404).json({ message: 'Slika nije pronađena.' });
                }
    
                // Brišemo fajl
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Greška prilikom brisanja slike:', err);
                        return res.status(500).json({ message: 'Greška prilikom brisanja slike.' });
                    }
    
                    // Uspešno obrisano
                    res.json({ success: true, message: 'Slika je uspešno obrisana.' });
                });
            });
        } else {
            res.status(400).json({ message: 'Naziv slike nije prosleđen.' });
        }
    }).catch((err)=>{
        console.log(err)
    })
});

//////////////////////////////////////////////////////////////////////////////////////



mongoose.connect('mongodb://127.0.0.1:27017/diplomskiBaza')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB connected")
})

const router = express.Router()
router.use('/user', userRouter)
router.use('/kupon', kuponRouter)
router.use('/smestaj', smestajRouter)
router.use('/slikaSmestaja', slikaSmestajaRouter)
router.use('/preporuka', preporukaRouter) 
router.use('/slikaPreporuke', slikaPreporukeRouter) 
router.use('/rezervacija', rezervacijaRouter) 


app.use("/" ,router)
app.use('/files', express.static(path.join('files'))); // da bi moglo da se pristupi folderu files preko rute /files


app.listen(4000, () => console.log(`Express server running on port 4000`));