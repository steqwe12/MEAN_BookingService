"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
});
exports.default = mongoose_1.default.model('PreporukaModel', Preporuka, 'preporuke');
