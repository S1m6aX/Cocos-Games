const { ccclass, property } = cc._decorator;

type EnemyData = {
  type: string;
  hp: number;
  speed: number;
  width: number;
  height: number;
  img_fly: string;
  img_hit: string;
  anime: string;
};

@ccclass
export default class EnemyControl extends cc.Component {
  // @property(cc.Prefab)
  // eBulletPre: cc.Prefab = null; // 子弹预设体

  public isPause: boolean = false;
  public EnemyManager: cc.Node = null;
  private animation: cc.Animation = null; // 动画
  private isDie: boolean = false; // 是否死亡s
  private originalSpriteFrame: cc.SpriteFrame;

  private type: string;
  private hp: number;
  private speed: number;
  private width: number;
  private height: number;
  private img_fly: string;
  private img_hit: string;
  private anime: string;

  start() {}

  update(dt) {
    // 移动
    if (!this.isPause && !this.isDie) {
      this.node.y -= this.speed * dt;
      if (this.node.y < -1 * this.height) {
        this.node.destroy();
      }
    }
  }

  protected init(enemy: EnemyData) {
    this.type = enemy.type;
    this.hp = enemy.hp;
    this.speed = enemy.speed;
    this.width = enemy.width;
    this.height = enemy.height;
    this.img_fly = enemy.img_fly;
    this.img_hit = enemy.img_hit;
    this.anime = enemy.anime;

    if (this.type === "Boss") {
      this.node.getComponent(cc.Animation).play(this.img_fly);
    } else {
      cc.resources.load(
        this.img_fly,
        cc.SpriteFrame,
        (err, spriteFrame: cc.SpriteFrame) => {
          if (err) {
            console.error(err);
            return;
          }
          const sprite = this.getComponent(cc.Sprite);
          sprite.spriteFrame = spriteFrame;
          this.originalSpriteFrame = sprite.spriteFrame;
        }
      );
    }
  }

  onCollisionEnter(other) {
    if (other.tag == 2) {
      this.hp--;
      if (this.hp == 0) {
        this.die();
        return;
      }
      // 播放被击中动画
      const animation = this.node.getComponent(cc.Animation);
      const sprite = this.node.getComponent(cc.Sprite);
      if (animation) {
        if (this.type === "Boss") {
          // Boss 播放被击中动画，之后恢复飞行动画
          animation.play(this.img_hit);
          animation.on(
            cc.Animation.EventType.FINISHED,
            () => {
              // 播放飞行动画以恢复
              animation.play(this.img_fly);
            },
            this
          );
        } else {
          // 对于其他类型的敌人，播放被击中动画并恢复原始spriteFrame
          animation.play(this.img_hit);
          animation.on(
            cc.Animation.EventType.FINISHED,
            () => {
              if (sprite && this.originalSpriteFrame) {
                sprite.spriteFrame = this.originalSpriteFrame;
              }
            },
            this
          );
        }
      } else {
        console.error("No animation component found on enemy");
      }
    }
  }

  //死亡
  die() {
    this.isDie = true;

    // 禁用碰撞组件
    const collider = this.node.getComponent(cc.Collider);
    if (collider) {
      collider.enabled = false;
    }

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
    this.animation.play(this.anime);

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
