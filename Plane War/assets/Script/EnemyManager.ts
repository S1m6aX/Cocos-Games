import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyManager extends cc.Component {
  // 敌机预设体
  @property(cc.Prefab)
  enemyPre: cc.Prefab = null;

  @property(cc.Prefab)
  eBulletPre: cc.Prefab = null;

  spawn() {
    // 创建敌机
    let enemy = cc.instantiate(this.enemyPre);
    enemy.setParent(cc.director.getScene());
    enemy.y = this.node.y;
    enemy.x = Math.random() * 400 + 20;

    let enemyControl = enemy.getComponent(EnemyControl);

    enemyControl.eBulletPre = this.eBulletPre;
  }

  start() {
    // 每隔两秒创建一个敌机
    this.schedule(this.spawn, 2);
  }

  // update (dt) {}
}
