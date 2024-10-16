"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const smestaj_routes_1 = __importDefault(require("./routers/smestaj.routes"));
const slikaSmestaja_routes_1 = __importDefault(require("./routers/slikaSmestaja.routes"));
const preporuka_routes_1 = __importDefault(require("./routers/preporuka.routes"));
const slikaPreporuke_routes_1 = __importDefault(require("./routers/slikaPreporuke.routes"));
const nodemailer_1 = __importDefault(require("nodemailer")); // dodato
const kupon_routes_1 = __importDefault(require("./routers/kupon.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
////////////SLANJE MAILA/////////////////////////////////////////////////////////
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'diplomskiradsajt@gmail.com', // mopj Gmail nalog
        pass: 'tipc zxim arma buok' // app password koji sam generisao za naziv app: Moja aplikacija; iz app.component.ts(nisam siguran da li je bitno ovo)
    }
});
app.post('/api/send-email', (req, res) => {
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
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/'); // mozda files/
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Postavljamo filter za fajlove (proverava tip fajla)
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /pdf|doc|docx/;
    const extname = allowedFileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Greška: Dozvoljeni su samo PDF, DOC, i DOCX fajlovi!'));
    }
};
// Inicijalizujemo upload
const upload = (0, multer_1.default)({ storage: storage });
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
app.get('/files/:filename', (req, res) => {
    const filePath = path_1.default.join('', 'files', req.params.filename);
    res.download(filePath); // This will trigger a download
});
//////////BRISANJE KUPONA///////////////////////////////////////////////////////////////  
const fs = __importStar(require("fs"));
const kupon_1 = __importDefault(require("./models/kupon"));
app.delete('/apikuponi/:korisnickoIme/:fajlIme', (req, res) => {
    const { korisnickoIme, fajlIme } = req.params;
    const filePath = path_1.default.join(__dirname, '../files', fajlIme);
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
            kupon_1.default.findOneAndDelete({ korisnickoIme, fajlIme })
                .then(() => res.send('Kupon obrisan.'))
                .catch(err => {
                console.error('Greška prilikom brisanja kupona:', err);
                res.status(500).send('Greška prilikom brisanja kupona.');
            });
        });
    });
});
//////////////////UPLOAD SLIKE////////////////////////////////////////////////////////
const storage2 = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder gde se slike čuvaju
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Koristimo ime koje smo generisali na frontendu
    }
});
const upload2 = (0, multer_1.default)({ storage: storage2 });
// Ruta za čuvanje slike
app.post('/sacuvajSliku', upload2.single('slika'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nije poslata slika.' });
    }
    res.status(200).json({ message: 'Slika uspešno sačuvana!', fileName: req.file.filename });
});
////////DOHVATAMO IME 1 SLIKE ZA SMESTAJ, NALAZIMO I VRACAMO STVARNU SLIKU//////////
const slikaSmestaja_1 = __importDefault(require("./models/slikaSmestaja"));
app.post('/dohvatiPrvuSlikuSmestaja', (req, res) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
    slikaSmestaja_1.default.findOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja }).then((slikaSmestaja) => {
        //slikaSmestaja.nazivSlike ; da se ovo ime slike iskoristi da se dohvati File koji se nalazi na ../uploads/'ime slike'
        if (slikaSmestaja && slikaSmestaja.nazivSlike) {
            // Putanja do slike
            const filePath = path_1.default.join(__dirname, '../uploads', slikaSmestaja.nazivSlike);
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
        }
        else {
            res.status(404).json({ message: 'Slika nije pronađena.' });
        }
        // res.json(slika); ovde treba valjda stvarna slika tipa File da se vrati
    }).catch((err) => {
        console.log(err);
    });
});
///////////NA OSNOVNU IMENA SLIKE VRACAMO STVARNU JEDNU SLIKU/////////////////////////
// import SlikaSmestajaModel from './models/slikaSmestaja'
app.post('/dohvatiSlikuZaImeSlike', (req, res) => {
    let nazivSlike = req.body.nazivSlike;
    if (nazivSlike) {
        // Putanja do slike
        const filePath = path_1.default.join(__dirname, '../uploads', nazivSlike);
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
    }
    else {
        res.status(404).json({ message: 'Slika nije pronađena.' });
    }
});
//////////////BRISEMO 1 SLIKU SMESTAJA SA SERVERA I BAZE///////////////////////////////////////
app.post('/obrisiSlikuSmestaja', (req, res) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
    let nazivSlike = req.body.nazivSlike;
    slikaSmestaja_1.default.deleteOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivSlike': nazivSlike }).then((slike) => {
        if (nazivSlike) {
            // Putanja do slike
            const filePath = path_1.default.join(__dirname, '../uploads', nazivSlike);
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
        }
        else {
            res.status(400).json({ message: 'Naziv slike nije prosleđen.' });
        }
    }).catch((err) => {
        console.log(err);
    });
});
////////////////BRISEMO 1 SLIKU PREPORUKE SA SERVERA I BAZE//////////////////////////////////
const slikaPreporuke_1 = __importDefault(require("./models/slikaPreporuke"));
const rezervacija_routes_1 = __importDefault(require("./routers/rezervacija.routes"));
app.post('/obrisiSlikuPreporuke', (req, res) => {
    let korisnickoIme = req.body.korisnickoIme;
    let nazivSmestaja = req.body.nazivSmestaja;
    let nazivSlike = req.body.nazivSlike;
    slikaPreporuke_1.default.deleteOne({ 'korisnickoIme': korisnickoIme, 'nazivSmestaja': nazivSmestaja, 'nazivSlike': nazivSlike }).then((slike) => {
        if (nazivSlike) {
            // Putanja do slike
            const filePath = path_1.default.join(__dirname, '../uploads', nazivSlike);
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
        }
        else {
            res.status(400).json({ message: 'Naziv slike nije prosleđen.' });
        }
    }).catch((err) => {
        console.log(err);
    });
});
//////////////////////////////////////////////////////////////////////////////////////
mongoose_1.default.connect('mongodb://127.0.0.1:27017/diplomskiBaza');
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    console.log("DB connected");
});
const router = express_1.default.Router();
router.use('/user', user_routes_1.default);
router.use('/kupon', kupon_routes_1.default);
router.use('/smestaj', smestaj_routes_1.default);
router.use('/slikaSmestaja', slikaSmestaja_routes_1.default);
router.use('/preporuka', preporuka_routes_1.default);
router.use('/slikaPreporuke', slikaPreporuke_routes_1.default);
router.use('/rezervacija', rezervacija_routes_1.default);
app.use("/", router);
app.use('/files', express_1.default.static(path_1.default.join('files'))); // da bi moglo da se pristupi folderu files preko rute /files
app.listen(4000, () => console.log(`Express server running on port 4000`));
