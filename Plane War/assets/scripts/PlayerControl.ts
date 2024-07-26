import BulletControl from "./BulletControl";
import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  @property(cc.Node)
  GamePlay: cc.Node = null;

  @property(cc.Node)
  BulletContainer: cc.Node = null;

  public isPause = false;
  private isDie: boolean = false;
  private animation: cc.Animation = null;

  protected onLoad(): void {
    this.node.active = false;
  }

  start() {
    if (!this.isPause && !this.isDie) {
      // move
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      // attack timer
      this.schedule(this.shoot, 0.5);

      let animation = this.node.getComponent(cc.Animation);
      animation.play("player_fly");
    }
  }

  onTouchMove(event) {
    // Stop movement if game paused
    if (!this.isPause) {
      this.node.setPosition(event.getLocation());
    }
  }

  shoot() {
    if (this.isPause || this.isDie) {
      return;
    }

    // load sound effect
    cc.resources.load(
      "audio/razer",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.error("Failed to load audio:", err);
          return;
        }
        let audioId = cc.audioEngine.playEffect(clip, false);
        cc.audioEngine.setVolume(audioId, 0.1);
      }
    );

    // create bullet
    let bullet = cc.instantiate(this.bulletPre);
    // set parent
    bullet.setParent(this.BulletContainer);
    // set position
    bullet.x = this.node.x;
    bullet.y = this.node.y + 70;
  }

  onCollisionEnter(other) {
    // Both destroyed if hits enemy
    if (other.tag == 1) {
      this.die();
      other.getComponent(EnemyControl).die();
    }
  }

  die() {
    if (!this.node.active) {
      return;
    }
    this.isDie = true;

    // load explode sound
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

    // Load and play blowup animation
    this.animation = this.node.getComponent(cc.Animation);
    this.animation.play("player_blowup");

    // Add an event listener for the animation end
    this.animation.on(
      "finished",
      function () {
        this.node.active = false;
      },
      this
    );
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

  update() {}
}
