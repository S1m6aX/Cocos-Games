import BoomControl from "./BoomControl";
import BulletControl from "./BulletControl";
import EnemyControl from "./EnemyControl";
import GameOver from "./GameOver";
import GamePause from "./GamePause";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  @property(cc.Prefab)
  leftBullet: cc.Prefab;

  @property(cc.Prefab)
  rightBullet: cc.Prefab;

  @property(cc.Node)
  GamePlay: cc.Node = null;

  @property(cc.Node)
  BulletContainer: cc.Node = null;

  @property(cc.Node)
  Boom: cc.Node = null;

  @property(cc.Node)
  Gameover: cc.Node = null;

  public isPause = false;
  public isDualShooting = false;
  public bulletHit: number = 0;
  public bulletCount: number = 0;

  private isDie: boolean = false;
  private animation: cc.Animation = null;
  private shootTime: number = 0.2;
  private shootAudioClip: cc.AudioClip = null; // 缓存音效
  private dualShootDuration: number = 10;

  protected onLoad(): void {
    this.node.active = false;
    // 加载并缓存音效
    cc.resources.load(
      "audio/razer",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.error("Failed to load audio:", err);
          return;
        }
        this.shootAudioClip = clip;
      }
    );
  }

  start() {
    if (!this.isPause && !this.isDie) {
      // 设置触摸移动事件
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      // 安排初始射击定时器
      this.schedule(this.shoot, this.shootTime);

      // 播放飞行动画
      let animation = this.node.getComponent(cc.Animation);
      if (animation) {
        animation.play("player_fly");
      }
    }
  }

  onTouchMove(event) {
    if (!this.isPause) {
      this.node.setPosition(event.getLocation());
    }
  }

  shoot() {
    if (this.isPause || this.isDie) {
      return;
    }

    // 创建子弹
    let bullet = cc.instantiate(this.bulletPre);
    bullet.setParent(this.BulletContainer);
    bullet.setPosition(this.node.position.x, this.node.position.y + 70);

    this.bulletCount += 1;
    // 播放音效
    if (this.shootAudioClip) {
      let audioId = cc.audioEngine.playEffect(this.shootAudioClip, false);
      cc.audioEngine.setVolume(audioId, 0.1);
    }
  }

  dualShoot() {
    if (!this.isPause) {
      // 创建左子弹
      let leftBullet = cc.instantiate(this.leftBullet);
      leftBullet.setParent(this.BulletContainer);
      leftBullet.setPosition(this.node.x - 32, this.node.y + 30);

      // 创建右子弹
      let rightBullet = cc.instantiate(this.rightBullet);
      rightBullet.setParent(this.BulletContainer);
      rightBullet.setPosition(this.node.x + 32, this.node.y + 30);

      this.bulletCount += 2;

      // 播放音效
      if (this.shootAudioClip) {
        let audioId = cc.audioEngine.playEffect(this.shootAudioClip, false);
        cc.audioEngine.setVolume(audioId, 0.1);
      }
    }
  }

  onCollisionEnter(other) {
    // 碰到敌人
    if (other.tag === 1) {
      this.die();
      other.getComponent(EnemyControl).die();
    } else if (other.tag === 2) {
      return;
    } else if (other.tag === 3) {
      // 切换到双发子弹模式
      this.unschedule(this.shoot);
      this.schedule(this.dualShoot, this.shootTime); // 调整 dualShoot 的间隔时间

      // 10秒后恢复到单发子弹模式
      this.scheduleOnce(() => {
        this.unschedule(this.dualShoot);
        this.schedule(this.shoot, this.shootTime); // 调整 shoot 的间隔时间
      }, 10); // 10秒后恢复
    } else if (other.tag === 4) {
      const boomControl = this.Boom.getComponent(BoomControl);
      boomControl.updateAmount(1);
    }
  }

  die() {
    if (!this.node.active) {
      return;
    }
    this.isDie = true;

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

    // 播放爆炸动画
    this.animation = this.node.getComponent(cc.Animation);
    if (this.animation) {
      this.animation.play("player_blowup");
      this.animation.on(
        "finished",
        () => {
          this.node.active = false;
        },
        this
      );
    }

    this.gameover();
  }

  pause() {
    this.isPause = true;

    if (this.BulletContainer) {
      this.BulletContainer.children.forEach((bullet) => {
        const bulletControl = bullet.getComponent(BulletControl);
        if (bulletControl) {
          bulletControl.isPause = true;
        }
      });
    }
  }

  resume() {
    this.isPause = false;

    if (this.BulletContainer) {
      this.BulletContainer.children.forEach((bullet) => {
        const bulletControl = bullet.getComponent(BulletControl);
        if (bulletControl) {
          bulletControl.isPause = false;
        }
      });
    }
  }

  update(dt) {
    if (this.isPause || this.isDie) {
      return;
    }
  }

  gameover() {
    const Game = this.Gameover.getComponent(GameOver);
    Game.show();
  }
}
