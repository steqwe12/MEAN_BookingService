"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
});
exports.default = mongoose_1.default.model('RezervacijaModel', Rezervacija, 'rezervacije');
