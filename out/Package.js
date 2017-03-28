class Package {
    constructor() {
        this.backpack = [];
        this.currentSize = 0;
    }
    InPackage(equipemt) {
        this.backpack.push(equipemt);
        equipemt.numInPackage = this.currentSize;
        this.currentSize++;
    }
    OutPackage(equipemt) {
        this.backpack.splice(equipemt.numInPackage);
        this.currentSize--;
    }
}
