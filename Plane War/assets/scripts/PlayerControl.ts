import eBulletControl from "./eBulletControl";
import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  isDie: boolean = false;

  start() {
    if (!this.isDie) {
      // 移动
      this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
        this.node.setPosition(event.getLocation());
      });
      // 攻击 计时器
      this.schedule(this.shoot, 0.5);
    }

    // 开启碰撞检测
    cc.director.getCollisionManager().enabled = true;
  }

  shoot() {
    // 加载音效
    cc.loader.loadRes("audio/lazer", cc.AudioClip, (src, clip) => {
      let audioId = cc.audioEngine.playEffect(clip, false);
      cc.audioEngine.setVolume(audioId, 0.1);
    });

    // 创建子弹
    let bullet = cc.instantiate(this.bulletPre);
    // 设置父物体
    bullet.setParent(cc.director.getScene());
    // 设置位置
    bullet.x = this.node.x;
    bullet.y = this.node.y + 70;
  }

  onCollisionEnter(other) {
    // 如果碰到敌人，双双销毁
    if (other.tag == 1) {
      this.die();
      other.getComponent(EnemyControl).die();
    } else if (other.tag == 2) {
      // 如果碰到子弹
      this.die();
      other.getComponent(eBulletControl).destroy();
    }
  }

  die() {
    this.isDie = true;

    // 加载爆炸音效
    cc.loader.loadRes("audio/explode", cc.AudioClip, (src, clip) => {
      let audioId = cc.audioEngine.playEffect(clip, false);
      cc.audioEngine.setVolume(audioId, 1);
    });

    cc.loader.loadRes("img/hero1_die", cc.SpriteFrame, (err, res) => {
      this.node.getComponent(cc.Sprite).spriteFrame = res;
    });

    setTimeout(() => {
      this.node.destroy();
    }, 300);
  }

  update() {}
}
