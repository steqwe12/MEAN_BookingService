import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Rezervacija = new Schema({
    turista: {
        type: String
    },
    vlasnik: {
        type: String
    },
    datumOd: {
        type: String
    },
    datumDo: {
        type: String
    },
    nazivSmestaja: {
        type: String
    }
})

export default mongoose.model('RezervacijaModel', Rezervacija, 'rezervacije');