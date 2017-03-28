var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
class EventEmitter {
    constructor() {
        this.observerList = [];
    }
    // constructor(){
    //     this.observerList = [];
    // }
    addObserver(o) {
        this.observerList.push(o);
    }
    notify(task) {
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }
}
class Task extends EventEmitter {
    constructor(id, name, desc, total, status, taskcondition, conditiontype, fromNpcId, toNpcId, preTaskListId, rewardEquipmentId) {
        super();
        this.current = 0;
        this.total = 100;
        this.preTaskListId = [];
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.total = total;
        this.taskCondition = taskcondition;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
        this.conditionType = conditiontype;
        this.preTaskListId = preTaskListId;
        this.addObserver(TaskService.getInstance());
        this.rewardEquipmentId = rewardEquipmentId;
    }
    setMain(main) {
        this._tmain = main;
    }
    getCurrent() {
        return this.current;
    }
    setCurrent(n) {
        this.current += n;
        this.checkStatus();
    }
    checkStatus() {
        if (this.current >= this.total) {
            TaskService.getInstance().canFinish(this.id);
            this.notify(this);
        }
    }
    onChange(task) {
        if (this.id == task.id) {
            this.updateProccess(1);
        }
    }
    // public getCondition(){
    //     return this.taskCondition;
    // }
    canAccept() {
        if (this.status == TaskStatus.UNACCEPTABLE) {
            this.status = TaskStatus.ACCEPTABLE;
            this.notify(this);
        }
    }
    ;
    accept() {
        if (this.status == TaskStatus.ACCEPTABLE) {
            this.status = TaskStatus.DURING;
            this.notify(this);
        }
    }
    ;
    submit() {
        if (this.status == TaskStatus.CAN_SUBMIT) {
            this.status = TaskStatus.SUBMITTED;
            this._tmain.HeroEquipWeapon(this.rewardEquipmentId);
            this.notify(this);
        }
    }
    ;
    updateProccess(n) {
        if (this.status == TaskStatus.DURING) {
            this.taskCondition.updateProccess(this, n);
        }
    }
}
class NPCTalkTaskCondition {
    canAccept(task) { }
    onSubmit(task) { }
    getCondition() {
        return this;
    }
    updateProccess(task, num) {
        task.setCurrent(num);
    }
}
class KillMonsterTaskCondition {
    constructor() {
        this.MonsterList = {};
    }
    onAccept(task) { }
    onSubmit(task) { }
    getCondition() {
        return this;
    }
    updateProccess(task, num) {
        task.setCurrent(num);
    }
}
class TaskService extends EventEmitter {
    constructor() {
        super(...arguments);
        this.taskList = {};
        // public init(){
        //     var config : Task[] = [
        //         {id : "task_00",name:"任务01",desc: "点击NPC_1,在NPC_2交任务" ,status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_0", toNpcId: "npc_1"},
        //         //{id : "task_01",name:"任务02",desc: "点击NPC_2,在NPC_1交任务",status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_1", toNpcId: "npc_0"}
        //     ]
        //     for( var i = 0 ; i <　config.length ; i++){
        //         this.addTask(config[i]);
        //     }
        // }
    }
    static getInstance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }
    //private observerList : Observer[] = [];
    addTask(task) {
        this.taskList[task.id] = task;
    }
    // public addObserver(o : Observer){
    //     this.observerList.push(o);
    // }
    getTaskByCustomRule(rule) {
        return rule(this.taskList);
    }
    finish(id) {
        if (this.taskList[id].status == TaskStatus.CAN_SUBMIT) {
            this.taskList[id].status = TaskStatus.SUBMITTED;
        }
        this.notify(this.taskList[id]);
    }
    accept(id) {
        if (this.taskList[id].status == TaskStatus.ACCEPTABLE) {
            this.taskList[id].status = TaskStatus.DURING;
        }
        this.notify(this.taskList[id]);
    }
    canAccept(id) {
        if (this.taskList[id].status == TaskStatus.UNACCEPTABLE) {
            this.taskList[id].status = TaskStatus.ACCEPTABLE;
        }
        this.notify(this.taskList[id]);
    }
    canFinish(id) {
        if (this.taskList[id].status == TaskStatus.DURING) {
            this.taskList[id].status = TaskStatus.CAN_SUBMIT;
        }
        this.notify(this.taskList[id]);
    }
    // public notify(task : Task){
    //     for(var observer of this.observerList){
    //         observer.onChange(task);
    //     }
    // }
    onChange(task) {
        this.taskList[task.id] = task;
        this.notify(this.taskList[task.id]);
        for (var taskId in this.taskList) {
            if (this.taskList[taskId].status == TaskStatus.UNACCEPTABLE) {
                var canAccept = true;
                for (var preId of this.taskList[taskId].preTaskListId) {
                    if (preId != "null") {
                        if (this.taskList[preId].status != TaskStatus.SUBMITTED) {
                            canAccept = false;
                            break;
                        }
                    }
                }
                if (canAccept) {
                    this.canAccept(taskId);
                }
            }
        }
    }
}
function creatTaskCondition(id) {
    var data = {
        "npctalk": { condition: new NPCTalkTaskCondition() },
        "killmonster": { condition: new KillMonsterTaskCondition() }
    };
    // if (id == "npctalk") {
    //     var n = new NPCTalkTaskCondition();
    //     return n;
    // }
    // else if (id == "killmonster") {
    //     var k = new KillMonsterTaskCondition();
    //     return k;
    // }
    // else
    var info = data[id];
    if (!info) {
        console.error('missing task');
    }
    return info.condition;
}
function creatTask(id) {
    var data = {
        "task_00": { name: "任务01", desc: "点击NPC_1,在NPC_2交任务", total: 1, status: TaskStatus.ACCEPTABLE, condition: "npctalk", fromNpcId: "npc_0", toNpcId: "npc_1", preTaskListId: ["null"], rewardEquipmentId: "W001" },
        "task_01": { name: "任务02", desc: "点击NPC_2,杀死一只史莱姆后点NPC_2交任务", total: 1, status: TaskStatus.UNACCEPTABLE, condition: "killmonster", fromNpcId: "npc_1", toNpcId: "npc_1", preTaskListId: ["task_00"], rewardEquipmentId: "W002" },
    };
    var info = data[id];
    if (!info) {
        console.error('missing task');
    }
    var condition = this.creatTaskCondition(info.condition);
    return new Task(id, info.name, info.desc, info.total, info.status, condition, info.condition, info.fromNpcId, info.toNpcId, info.preTaskListId, info.rewardEquipmentId);
}
class TaskPanel extends engine.DisplayObjectContainer {
    constructor() {
        super();
        this.show = [];
        this.taskList = [];
        this.width = 256;
        this.height = 317;
        this.background = this.createBitmapByName("renwumianbanbeijing.png");
        this.addChild(this.background);
        this.background.setWidth(256);
        this.background.setHeight(317);
        this.background.x = 0;
        this.background.y = 0;
        this.textField = new engine.TextField();
        this.addChild(this.textField);
        this.textField.x = this.width / 2 - 100;
        this.textField.y = this.height / 2;
        this.textField.size = 15;
        this.textField.textColor = "0x000000";
        this.addChild(this.textField);
        this.textField.setWidth(200);
        this.textField.x = 30;
        this.textField.y = 80;
        // this.button = this.createBitmapByName("jieshou_gray.png");
        // this.ifAccept = true;
        // this.addChild(this.button);
        // this.button.x = 80;
        // this.button.y = 230;
        // this.button.touchEnabled = false;
        // this.button.alpha = 1;
        //this.onButtonClick();
        this.alpha = 0;
        let rule = (taskList) => {
            for (var taskId in taskList) {
                //console.log(taskId);
                this.taskList.push(taskList[taskId]);
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        //this.taskList = rule;
        // for(var i = 0; i < this.taskList.length; i++){
        //     this.show[i] ="任务名 ：" + this.taskList[i].name + ":\n" +"任务内容："+ this.taskList[i].desc +" :\n" +" 任务状态 ：" + this.taskList[i].status;
        // }
        // for(var i = 0; i < this.show.length; i++){
        //     if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.SUBMITTED || this.taskList[i].status == TaskStatus.ACCEPTABLE)
        //     this.textField.text += this.show[i] + "\n";
        // }
    }
    createBitmapByName(name) {
        var result = new engine.Bitmap();
        engine.RES.getRes(name).then((value) => {
            result.texture = value;
            result.setWidth(result.texture.width);
            result.setHeight(result.texture.height);
        });
        return result;
    }
    onChange(task) {
        var i = 0;
        let rule = (taskList) => {
            for (var taskId in taskList) {
                this.taskList[i] = taskList[taskId];
                i++;
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == task.id) {
                this.alpha = 1;
                //egret.Tween.get(this).to({ alpha: 1 }, 500);
                //this.button.touchEnabled = true;
                // if (this.taskList[i].status == TaskStatus.ACCEPTABLE) {
                //     this.ifAccept = true;
                //     var texture: egret.Texture = RES.getRes("jieshou.png");
                //     //this.button.texture = texture;
                // }
                // if (this.taskList[i].status == TaskStatus.CAN_SUBMIT) {
                //     this.ifAccept = false;
                //     var texture: egret.Texture = RES.getRes("wancheng.png");
                //     //this.button.texture = texture;
                // }
                var statusText = "";
                switch (this.taskList[i].status) {
                    case TaskStatus.UNACCEPTABLE:
                        statusText = "不可接";
                        break;
                    case TaskStatus.ACCEPTABLE:
                        statusText = "可接";
                        break;
                    case TaskStatus.DURING:
                        statusText = "进行中";
                        break;
                    case TaskStatus.CAN_SUBMIT:
                        statusText = "可交付";
                        break;
                    case TaskStatus.SUBMITTED:
                        statusText = "已完成";
                        break;
                }
                this.show[i] = "任务名 ：" + this.taskList[i].name + " :\n " + "任务内容：" + this.taskList[i].desc + " :\n " + " 任务状态 ： " + statusText;
                this.duringTaskId = this.taskList[i].id;
                this.textField.text = "";
                for (var i = 0; i < this.show.length; i++) {
                    if (this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.CAN_SUBMIT || this.taskList[i].status == TaskStatus.ACCEPTABLE)
                        this.textField.text += this.show[i] + "\n";
                }
                this.alpha = 1;
                //this.button.touchEnabled = true;
                break;
            }
        }
        // this.textField.text = "";
        // for(var i = 0; i < this.show.length - 1; i++){
        //     this.textField.text += this.show[i] + "\n";
        // }
    }
}
