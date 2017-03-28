var MonsterState;
(function (MonsterState) {
    MonsterState[MonsterState["LIVE"] = 0] = "LIVE";
    MonsterState[MonsterState["DEAD"] = 1] = "DEAD";
})(MonsterState || (MonsterState = {}));
class Monster extends engine.DisplayObjectContainer {
    constructor(id, name, pictureId, maxHP, x, y) {
        super();
        this.width = 64;
        this.height = 64;
        this.monsterPicture = new engine.Bitmap();
        engine.RES.getRes(pictureId).then((value) => {
            this.monsterPicture.texture = value;
            this.monsterPicture.setWidth(this.monsterPicture.texture.width);
            this.monsterPicture.setHeight(this.monsterPicture.texture.height);
        });
        this.addChild(this.monsterPicture);
        this.monsterPicture.x = 0;
        this.monsterPicture.y = 0;
        this.name = name;
        this.monsterID = id;
        this.monsterPictureId = pictureId;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.state = MonsterState.LIVE;
        this.posX = x;
        this.posY = y;
    }
    BeenAttacked(damage) {
        this.currentHP -= damage;
        this.checkState();
    }
    checkState() {
        if (this.currentHP <= 0) {
            this.state = MonsterState.DEAD;
        }
    }
    getMonsterState() {
        return this.state;
    }
}
class MonsterService {
    constructor() {
        this.monsterList = {};
    }
    static getInstance() {
        if (MonsterService.instance == null) {
            MonsterService.instance = new MonsterService();
        }
        return MonsterService.instance;
    }
    addMonster(monster) {
        this.monsterList[monster.monsterID] = monster;
    }
    getMonster(id) {
        return this.monsterList[id];
    }
}
function creatMonster(id) {
    var data = {
        "slime01": { id: "slime01", name: "slime", pictureId: "Slime.png", maxHP: 100, x: 64 * 5, y: 64 * 4 },
        "slime02": { id: "slime02", name: "slime", pictureId: "Slime.png", maxHP: 100, x: 64 * 4, y: 64 * 6 },
    };
    var info = data[id];
    if (!info) {
        console.error('missing monster');
    }
    return new Monster(info.id, info.name, info.pictureId, info.maxHP, info.x, info.y);
}
