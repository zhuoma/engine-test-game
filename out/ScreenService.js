class ScreenService extends EventEmitter {
    constructor() {
        super();
        this.taskList = {};
        let rule = (taskList) => {
            for (var taskId in taskList) {
                //console.log(taskId);
                if (taskList[taskId].conditionType == "killmonster") {
                    this.taskList[taskId] = taskList[taskId];
                    this.addObserver(taskList[taskId]);
                }
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
    }
    monsterBeenKilled(taskId) {
        this.notify(this.taskList[taskId]);
    }
}
