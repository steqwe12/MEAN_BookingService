import Smestaj from "./smestaj";

export default class SmestajSaSlikom {
    smestaj: Smestaj;
    slika:File;

    constructor(smestaj: Smestaj,slika:File){
        this.smestaj=smestaj;
        this.slika=slika;
    }
}
