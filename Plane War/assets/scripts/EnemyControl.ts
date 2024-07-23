import EnemyManager from "./EnemyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {
  // @property(cc.Prefab)
  // eBulletPre: cc.Prefab = null; // 子弹预设体

  public isPause: boolean = false;
  private animation: cc.Animation = null; // 动画
  private isDie: boolean = false; // 是否死亡s
  private nodeId: string = null;
  private enemyArr: Array<cc.Node> = null;
  public EnemyManager: cc.Node = null;

  start() {
    if (this.EnemyManager) {
      const enemyManagerComp = this.EnemyManager.getComponent(EnemyManager);
      if (enemyManagerComp) {
        this.nodeId = this.node.uuid; // 获取node.uuid
        this.enemyArr = enemyManagerComp.enemies; //获取enemies数组
      }
    }
  }

  update(dt) {
    // 移动
    if (!this.isPause && !this.isDie) {
      this.node.y -= 300 * dt;
      if (this.node.y < -40) {
        this.removeFromArr();
        this.node.destroy();
      }
    }
  }

  //死亡
  die() {
    this.isDie = true;

    // 从enemies中删除
    this.removeFromArr();

    // 加载爆炸音效
    cc.resources.load(
      "audio/explode",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.error("Failed to load audio:", err);
          return;
        }
        let audioId = cc.audioEngine.playEffect(clip, false);
        cc.audioEngine.setVolume(audioId, 1);
      }
    );

    // 加载爆炸动画
    this.animation = this.node.getComponent(cc.Animation);
    this.animation.play("enemy_down");

    // 动画结束后摧毁节点
    this.animation.on(
      cc.Animation.EventType.FINISHED,
      () => {
        this.node.destroy();
      },
      this
    );
  }

  /**
   * 在enemies中删除该Enemy节点
   */
  removeFromArr() {
    if (this.enemyArr && this.enemyArr.length > 0) {
      const index = this.enemyArr.findIndex(
        (enemy) => enemy.uuid === this.nodeId
      );
      if (index !== -1) {
        this.enemyArr.splice(index, 1);
      }
    }
  }

  // shoot() {
  //   let bullet = cc.instantiate(this.eBulletPre);
  //   // 设置子弹到场景中
  //   bullet.setParent(cc.director.getScene());
  //   // bullet.x = this.node.x;
  //   // bullet.y = this.node.y - 30;
  //   bullet.setPosition(this.node.position.x, this.node.position.y - 30);

  //   // 确保子弹控制脚本正确附加
  //   let bulletControl = bullet.getComponent("eBulletControl");
  // }
}
//this.shoot();
// 只调度一次射击
//if (!this.isDie) {
// 每秒调用一次shoot
// this.schedule(this.shoot, 2);
//}
