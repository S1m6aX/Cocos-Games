import PlayerControl from "./PlayerControl";
import ScoreManager from "./ScoreManager";

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
  point: number;
};

@ccclass
export default class EnemyControl extends cc.Component {
  @property(cc.Node)
  ScoreManager: cc.Node = null;

  @property(cc.Node)
  playerNode: cc.Node = null;

  public isPause: boolean = false;
  public EnemyManager: cc.Node = null;
  private animation: cc.Animation = null; // 动画
  private isDie: boolean = false; // 是否死亡
  private originalSpriteFrame: cc.SpriteFrame;

  private type: string;
  private hp: number;
  private speed: number;
  private width: number;
  private height: number;
  private img_fly: string;
  private img_hit: string;
  private anime: string;
  private point: number;

  start() {}

  update(dt) {
    if (!this.isPause && !this.isDie) {
      this.node.y -= this.speed * dt;
      if (this.node.y < -1 * this.height) {
        this.node.destroy();
      }
    }
  }

  protected init(enemy: EnemyData, scoreManager: cc.Node, playerNode: cc.Node) {
    this.type = enemy.type;
    this.hp = enemy.hp;
    this.speed = enemy.speed;
    this.width = enemy.width;
    this.height = enemy.height;
    this.img_fly = enemy.img_fly;
    this.img_hit = enemy.img_hit;
    this.anime = enemy.anime;
    this.point = enemy.point;
    this.ScoreManager = scoreManager;
    this.playerNode = playerNode;

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
      this.playerNode.getComponent(PlayerControl).bulletHit += 1;
      this.hp--;
      if (this.hp == 0) {
        this.die();
        return;
      }

      const animation = this.node.getComponent(cc.Animation);
      const sprite = this.node.getComponent(cc.Sprite);

      if (animation) {
        animation.off(cc.Animation.EventType.FINISHED); // 先移除旧的回调
        if (this.type === "Boss") {
          animation.play(this.img_hit);
          animation.on(
            cc.Animation.EventType.FINISHED,
            () => {
              animation.play(this.img_fly);
            },
            this
          );
        } else {
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

  die() {
    this.isDie = true;

    const collider = this.node.getComponent(cc.Collider);
    if (collider) {
      collider.enabled = false;
    }

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

    this.animation = this.node.getComponent(cc.Animation);
    this.animation.play(this.anime);

    this.animation.on(
      cc.Animation.EventType.FINISHED,
      () => {
        this.node.destroy();
      },
      this
    );

    const scoreMgr = this.ScoreManager.getComponent(ScoreManager);
    scoreMgr.updateScore(this.point);
  }
}
