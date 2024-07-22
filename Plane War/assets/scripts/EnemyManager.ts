import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyManager extends cc.Component {
  @property(cc.Prefab)
  enemyPre: cc.Prefab = null;

  @property(cc.Prefab)
  eBulletPre: cc.Prefab = null;

  public isPause: boolean = false;
  private spawnInterval: number = 2; // 敌机生成的间隔时间

  // 全局敌机列表
  private enemies: cc.Node[] = [];

  spawn() {
    let enemy = cc.instantiate(this.enemyPre);
    enemy.setParent(cc.director.getScene());
    enemy.y = this.node.y;
    enemy.x = Math.random() * 400 + 20;

    let enemyControl = enemy.getComponent(EnemyControl);
    //enemyControl.eBulletPre = this.eBulletPre;
    this.enemies.push(enemy); // 将敌机添加到全局列表
  }

  start() {
    this.scheduleSpawn();
  }

  scheduleSpawn() {
    if (!this.isPause) {
      this.schedule(this.spawn, this.spawnInterval);
    } else {
      this.unschedule(this.spawn); // 取消定时任务
    }
  }

  pause() {
    console.log("调用 pause() 方法");
    this.isPause = true;
    this.scheduleSpawn(); // 停止敌机生成
    // 暂停所有现有敌机
    this.enemies.forEach((enemy) => {
      const enemyControl = enemy.getComponent(EnemyControl);
      if (enemyControl) {
        enemyControl.isPause = true;
      }
    });
  }

  resume() {
    this.isPause = false;
    // 重新开始敌机生成
    this.scheduleSpawn();

    // 恢复所有现有敌机
    this.enemies.forEach((enemy) => {
      const enemyControl = enemy.getComponent(EnemyControl);
      if (enemyControl) {
        enemyControl.isPause = false;
      }
    });
  }
}
