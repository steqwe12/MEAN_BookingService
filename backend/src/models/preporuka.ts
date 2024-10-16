import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Preporuka = new Schema({
    korisnickoIme: {
        type: String
    },
    nazivSmestaja: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    nazivPreporuke: {
        type: String
    },
    opisPreporuke: {
        type: String
    },
    tip: {
        type: String
    }
})

export default mongoose.model('PreporukaModel', Preporuka, 'preporuke');