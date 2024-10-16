import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let SlikaPreporuke = new Schema({
    korisnickoIme: {
        type: String
    },
    nazivSmestaja: {
        type: String
    },
    nazivPreporuke: {
        type: String
    },
    nazivSlike: {
        type: String
    }
})

export default mongoose.model('SlikaPreporukeModel', SlikaPreporuke, 'slikePreporuka');