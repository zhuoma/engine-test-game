var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Cache = (target, propertyKey, descriptor) => {
    const method = descriptor.value;
    descriptor.value = function () {
        var cacheKey = "__cache" + propertyKey;
        if (!target[cacheKey]) {
            target[cacheKey] = method.apply(this);
        }
        return target[cacheKey];
    };
};
var Quality;
(function (Quality) {
    Quality[Quality["WHITE"] = 1] = "WHITE";
    Quality[Quality["GREEN"] = 1.1] = "GREEN";
    Quality[Quality["BLUE"] = 1.2] = "BLUE";
    Quality[Quality["PURPLE"] = 1.4] = "PURPLE";
    Quality[Quality["ORAGE"] = 1.8] = "ORAGE";
})(Quality || (Quality = {}));
var WeaponType;
(function (WeaponType) {
    WeaponType[WeaponType["HANDSWORD"] = 1] = "HANDSWORD";
    WeaponType[WeaponType["LANCE"] = 1.8] = "LANCE";
    WeaponType[WeaponType["AXE"] = 2] = "AXE";
    WeaponType[WeaponType["KATANA"] = 1.5] = "KATANA";
    WeaponType[WeaponType["HAMMER"] = 2.5] = "HAMMER";
})(WeaponType || (WeaponType = {}));
var ArmorType;
(function (ArmorType) {
    ArmorType[ArmorType["LIGHTARMOR"] = 1] = "LIGHTARMOR";
    ArmorType[ArmorType["LEATHERARMOR"] = 1.4] = "LEATHERARMOR";
    ArmorType[ArmorType["PLATEARMOR"] = 2] = "PLATEARMOR";
    ArmorType[ArmorType["HEAVYARMOR"] = 2.4] = "HEAVYARMOR";
    ArmorType[ArmorType["NOTHINGTOWEAR"] = 0.2] = "NOTHINGTOWEAR";
})(ArmorType || (ArmorType = {}));
var EquipementType;
(function (EquipementType) {
    EquipementType[EquipementType["WEAPON"] = 1] = "WEAPON";
    EquipementType[EquipementType["HELMENT"] = 2] = "HELMENT";
    EquipementType[EquipementType["CORSELER"] = 3] = "CORSELER";
    EquipementType[EquipementType["SHOES"] = 4] = "SHOES";
})(EquipementType || (EquipementType = {}));
var JewelPromotion;
(function (JewelPromotion) {
    JewelPromotion[JewelPromotion["ATTACKPRMOTE"] = 1] = "ATTACKPRMOTE";
    JewelPromotion[JewelPromotion["DEFENCEPRMOTE"] = 2] = "DEFENCEPRMOTE";
    JewelPromotion[JewelPromotion["AGILEPRMOTE"] = 3] = "AGILEPRMOTE";
})(JewelPromotion || (JewelPromotion = {}));
var HeroType;
(function (HeroType) {
    HeroType[HeroType["SABER"] = 0] = "SABER";
    HeroType[HeroType["LANCER"] = 1] = "LANCER";
    HeroType[HeroType["ARCHER"] = 2] = "ARCHER";
    HeroType[HeroType["CASTER"] = 3] = "CASTER";
    HeroType[HeroType["BASERKER"] = 4] = "BASERKER";
    HeroType[HeroType["ASSASIN"] = 5] = "ASSASIN";
    HeroType[HeroType["RIDER"] = 6] = "RIDER";
})(HeroType || (HeroType = {}));
class User {
    constructor(name, level) {
        this.currentExp = 0;
        this.totalExp = 0;
        this.level = 1;
        this.diamonds = 0;
        this.gold = 0;
        this.__heros = [];
        this.__herosInTeam = [];
        this.userName = "";
        this.userName = name;
        this.level = level;
        this.package = new Package();
    }
    getTotalExp() {
        this.totalExp = (this.level + 60) * this.level;
        return this.totalExp;
    }
    addHeros(hero) {
        this.__heros.push(hero);
    }
    addHeroInTeam(hero) {
        this.__herosInTeam.push(hero);
    }
    getFightPower() {
        var result = 0;
        this.__herosInTeam.forEach(hero => result += hero.getFightPower());
        return result;
    }
    changeHeroTeam(heroToUp, heroToDown) {
    }
}
__decorate([
    Cache
], User.prototype, "getTotalExp", null);
__decorate([
    Cache
], User.prototype, "getFightPower", null);
class Hero {
    constructor(heroID, name, quality, level, heroBitmapID, heroType) {
        this.isInTeam = false;
        this.name = "";
        this.quality = 0;
        this.maxHP = 0;
        this.currentHP = 0;
        this.attack = 0;
        this.defence = 0;
        this.agile = 0;
        this.level = 1;
        this.currentExp = 0;
        this.totalExp = 0;
        this.properties = [];
        //__equipmentsOnEquip : Equipment[] = [];
        this.__weaponsOnEquip = [];
        this.__armorOnEquip = [];
        this.heroType = -1;
        this.heroID = heroID;
        this.name = name;
        this.quality = quality;
        this.level = level;
        this.heroBitemapID = heroBitmapID;
        this.heroType = heroType;
        this.color = GetColor.getColor(quality);
    }
    //@Cache
    getTotalExp() {
        this.totalExp = (this.level + 50) * this.level;
        return this.totalExp;
    }
    addWeapon(weapon) {
        this.__weaponsOnEquip[0] = weapon;
    }
    addHelment(helment) {
        this.__armorOnEquip[0] = helment;
    }
    addCorseler(corseler) {
        this.__armorOnEquip[1] = corseler;
    }
    addShoes(shoes) {
        this.__armorOnEquip[2] = shoes;
    }
    getEquipment(type) {
        var temp;
        switch (type) {
            case EquipementType.WEAPON:
                if (this.__weaponsOnEquip[0])
                    temp = this.__weaponsOnEquip[0];
                else
                    temp = null;
            case EquipementType.HELMENT:
                if (this.__armorOnEquip[0])
                    temp = this.__armorOnEquip[0];
                else
                    temp = null;
            case EquipementType.CORSELER:
                if (this.__armorOnEquip[1])
                    temp = this.__armorOnEquip[1];
                else
                    temp = null;
            case EquipementType.SHOES:
                if (this.__armorOnEquip[2])
                    temp = this.__armorOnEquip[2];
                else
                    temp = null;
        }
        return temp;
    }
    //@Cache
    getMaxHP() {
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getFightPower() * 0.2);
        this.__armorOnEquip.forEach(armor => result += armor.getFightPower() * 0.8);
        result += this.level * 10 * this.quality;
        this.properties[0] = new Property("最大生命值", result, false);
        return result;
    }
    //@Cache
    getAttack() {
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getAttack() * 0.5);
        result += this.level * 5 * this.quality;
        this.properties[1] = new Property("攻击力", result, false);
        return result;
    }
    //@Cache
    getDefence() {
        var result = 0;
        this.__armorOnEquip.forEach(armor => result += armor.getDefence() * 0.2);
        result += this.level * 2 * this.quality;
        this.properties[2] = new Property("防御力", result, false);
        return result;
    }
    //@Cache
    getAglie() {
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getAglie() * 0.4);
        this.__armorOnEquip.forEach(armor => result += armor.getAglie() * 0.4);
        result += this.level * 4 * this.quality;
        this.properties[3] = new Property("敏捷", result, false);
        return result;
    }
    //@Cache
    getFightPower() {
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getFightPower());
        this.__armorOnEquip.forEach(armor => result += armor.getFightPower());
        result += (10 + this.getAttack() * 10 + this.getDefence() * 8 + this.getAglie() * 6) * this.level * this.quality;
        return result;
    }
}
class Equipment {
    constructor() {
        this.quality = 0;
        //level = 1;
        this.currentExp = 0;
        //totalExp = 0;
        //agile = 0;
        this.isWeapon = false;
        this.name = "";
        this.__jewelOnEquip = [];
        this.properties = [];
    }
    //  @Cache
    //  getTotalExp(){
    //      this.totalExp = (this.level + 20) * this.level;
    //      return this.totalExp;
    //  }
    getFightPower() {
        return 0;
    }
    addJewl(jewel) {
        this.__jewelOnEquip.push(jewel);
    }
}
__decorate([
    Cache
], Equipment.prototype, "getFightPower", null);
class Weapon extends Equipment {
    constructor(equipmentID, name, quality, weaponType, weaponIconId) {
        super();
        this.isWeapon = true;
        this.weaponType = 0;
        this.equipmentID = equipmentID;
        this.name = name;
        this.quality = quality;
        //this.level = level;
        this.weaponType = weaponType;
        this.equipmentBitmapID = weaponIconId;
        this.color = GetColor.getColor(quality);
        this.weaponID = Weapon.weaponNum.toString();
        Weapon.weaponNum++;
    }
    getAttack() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
        result += 10 * this.weaponType * this.quality;
        this.properties[0] = new Property("攻击力", result, false);
        return result;
    }
    getAglie() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
        result += 5 * this.quality / this.weaponType;
        this.properties[1] = new Property("敏捷", result, false);
        return result;
    }
    getEquipmentInformations() {
        this.getAttack();
        this.getAglie();
    }
    getFightPower() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower());
        result += this.getAttack() * this.quality * 10 + this.getAglie() * this.quality * 5;
        return result;
    }
}
//attack = 0;
Weapon.weaponNum = 0;
class Armor extends Equipment {
    constructor(equipmentID, name, quality, armorType, armorIconId) {
        super();
        this.armorType = 0;
        this.isWeapon = false;
        this.equipmentID = equipmentID;
        this.name = name;
        this.quality = quality;
        this.armorType = armorType;
        this.equipmentBitmapID = armorIconId;
        this.color = GetColor.getColor(quality);
        this.armorID = Armor.armorNum.toString();
        Armor.armorNum++;
    }
    getDefence() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
        result += 6 * this.armorType * this.quality;
        this.properties[0] = new Property("防御力", result, false);
        return result;
    }
    getAglie() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
        result += 5 * this.quality / this.armorType;
        this.properties[1] = new Property("敏捷", result, false);
        return result;
    }
    getFightPower() {
        var result = 0;
        this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower());
        result += this.getDefence() * this.quality * 10 + this.getAglie() * this.quality * 5;
        return result;
    }
    getEquipmentInformations() {
        this.getDefence();
        this.getAglie();
    }
}
//defence = 0;
Armor.armorNum = 0;
class Jewel {
    //promotionType = 0;
    constructor(jewelID, name, quality) {
        this.quality = 0;
        this.jewelID = jewelID;
        this.name = name;
        this.quality = quality;
        this.color = GetColor.getColor(quality);
    }
    getFightPower() {
        var result = 0;
        result = this.quality * 10;
        return result;
    }
}
Jewel.num = 0;
__decorate([
    Cache
], Jewel.prototype, "getFightPower", null);
class Property {
    constructor(name, value, isRate) {
        this.name = name;
        this.value = value;
        this.isRate = isRate;
    }
    getDescription() {
        if (this.isRate) {
            return this.name + ": +" + (this.value / 10).toFixed(2) + "%";
        }
        else {
            return this.name + ": +" + this.value;
        }
    }
}
class Properties {
    constructor() {
        this.all = [
            "攻击力",
            "防御力",
            "敏捷",
            "品质"
        ];
    }
    getpropertieName() {
    }
}
class GetColor {
    static getColor(quality) {
        var color;
        if (quality == Quality.WHITE)
            color = 0xffffff;
        if (quality == Quality.BLUE)
            color = 0x0000dd;
        if (quality == Quality.GREEN)
            color = 0x00dd00;
        if (quality == Quality.PURPLE)
            color = 0x9a30d7;
        if (quality == Quality.ORAGE)
            color = 0xf4a315;
        return color;
    }
}
class EquipmentServer {
    constructor() {
        this.weaponList = {};
        this.helmentList = {};
        this.armorList = {};
        this.shoesList = {};
    }
    static getInstance() {
        if (EquipmentServer.instance == null) {
            EquipmentServer.instance = new EquipmentServer();
        }
        return EquipmentServer.instance;
    }
    addWeapon(weapon) {
        this.weaponList[weapon.equipmentID] = weapon;
    }
    getWeapon(id) {
        return this.weaponList[id];
    }
    addHelement(armor) {
        this.helmentList[armor.armorID] = armor;
    }
    getHelement(id) {
        return this.helmentList[id];
    }
    addArmor(armor) {
        this.armorList[armor.armorID] = armor;
    }
    getArmor(id) {
        return this.armorList[id];
    }
    addShoe(armor) {
        this.shoesList[armor.armorID] = armor;
    }
    getShoe(id) {
        return this.shoesList[id];
    }
}
