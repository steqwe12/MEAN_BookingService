import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let SlikaSmestaja = new Schema({
    korisnickoIme: {
        type: String
    },
    nazivSmestaja: {
        type: String
    },
    nazivSlike: {
        type: String
    }
})

export default mongoose.model('SlikaSmestajaModel', SlikaSmestaja, 'slikeSmestaja');