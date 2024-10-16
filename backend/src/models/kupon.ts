import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Kupon = new Schema({
    korisnickoIme: {
        type: String
    },
    opis: {
        type: String
    },
    naslov: {
        type: String
    },
    fajlIme: {
        type: String
    }
})

export default mongoose.model('KuponModel', Kupon, 'kuponi');