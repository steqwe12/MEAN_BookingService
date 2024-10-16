"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
});
exports.default = mongoose_1.default.model('SmestajModel', Smestaj, 'smestaji');
