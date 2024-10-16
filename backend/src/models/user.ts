import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let User = new Schema({
    korisnickoIme: {
        type: String
    },
    lozinka: {
        type: String
    },
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    kontaktTelefon: {
        type: String
    },
    email: {
        type: String
    },
    tip: {
        type: String
    },
    status: {
      type: String
  }
})

export default mongoose.model('UserModel', User, 'korisnici');