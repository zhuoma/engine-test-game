class WalkCommand {
    constructor(_tmain) {
        this._tmain = _tmain;
        WalkCommand.canFinish = false;
    }
    execute(callback) {
        if (this._tmain.ifFindAWay) {
            this._tmain.Player.SetState(new WalkingState(), this._tmain);
            this._tmain.ifStartMove = true;
            engine.Ticker.getInstance().register(() => {
                if (this._tmain.ifStartMove == false && WalkCommand.canFinish) {
                    callback();
                    WalkCommand.canFinish = false;
                }
                //console.log("233");
            });
        }
    }
    cancel(callback) {
        callback();
    }
}
WalkCommand.canFinish = false;
class FightCommand {
    constructor(player, main, monster, damage) {
        this._hasBeenCancelled = false;
        this.player = player;
        this._tmain = main;
        this.target = monster;
        this.damage = damage;
    }
    execute(callback) {
        console.log("开始战斗");
        this.player.SetState(new FightState(), this._tmain);
        engine.setTimeout(() => {
            if (!this._hasBeenCancelled) {
                console.log("结束战斗");
                this.target.BeenAttacked(this.damage);
                this.player.SetState(new IdleState(), this._tmain);
                if (this._tmain.monsterAttacking.getMonsterState() == MonsterState.DEAD) {
                    this._tmain.screenService.monsterBeenKilled("task_01");
                    this._tmain.removeChild(this._tmain.stage.monsterAttacking);
                }
                callback();
            }
        }, 500);
    }
    cancel(callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        engine.setTimeout(function () {
            this.player.SetState(new IdleState(), this._tmain);
            callback();
        }, 100);
    }
}
class TalkCommand {
    constructor(_tmain, npc) {
        this._tmain = _tmain;
        TalkCommand.canFinish = false;
        this.NPCToTalk = npc;
    }
    execute(callback) {
        TalkCommand.canFinish = false;
        this.NPCToTalk.onNPCClick();
        this._tmain.canMove = false;
        engine.Ticker.getInstance().register(() => {
            if (TalkCommand.canFinish) {
                TalkCommand.canFinish = false;
                NPC.npcIsChoose = null;
                this._tmain.canMove = true;
                //console.log("dui hua wan cheng");
                callback();
            }
            //console.log("233");
        });
    }
    cancel(callback) {
        this._tmain.canMove = true;
        callback();
    }
}
TalkCommand.canFinish = false;
class CommandList {
    constructor() {
        this._list = [];
        this._frozen = false;
    }
    addCommand(command) {
        this._list.push(command);
    }
    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        // egret.setTimeout(() => {
        //     if (this._frozen) {
        //         this._frozen = false;
        //     }
        // }, this, 100);
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
        }
    }
    execute() {
        if (this._frozen) {
            engine.setTimeout(this.execute, 100);
            return;
        }
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(() => {
                this.execute();
            });
        }
        else {
            console.log("全部命令执行完毕");
        }
    }
}
