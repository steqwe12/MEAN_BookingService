import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Smestaj = new Schema({
    korisnickoIme: {
        type: String
    },
    nazivSmestaja: {
        type: String
    },
    opisSmestaja: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    drzava: {
        type: String
    },
    grad: {
        type: String
    }
})

export default mongoose.model('SmestajModel', Smestaj, 'smestaji');