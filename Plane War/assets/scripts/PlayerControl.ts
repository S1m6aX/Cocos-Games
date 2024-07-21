import eBulletControl from "./eBulletControl";
import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  private isDie: boolean = false;

  private animation: cc.Animation = null;

  start() {
    if (!this.isDie) {
      // move
      this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
        this.node.setPosition(event.getLocation());
      });
      // attack timer
      this.schedule(this.shoot, 0.5);

      let animation = this.node.getComponent(cc.Animation);
      animation.play("player_fly");
    }

    // enable collision
    cc.director.getCollisionManager().enabled = true;
  }

  shoot() {
    // load sound effect
    cc.resources.load(
      "audio/lazer",
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
    bullet.setParent(cc.director.getScene());
    // set position
    bullet.x = this.node.x;
    bullet.y = this.node.y + 70;
  }

  onCollisionEnter(other) {
    // Both destroyed if hits enemy
    if (other.tag == 1) {
      this.die();
      other.getComponent(EnemyControl).die();
    } else if (other.tag == 2) {
      // if hits bullet
      this.die();
      other.getComponent(eBulletControl).destroy();
    }
  }

  die() {
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
        this.node.destroy();
      },
      this
    );
  }

  update() {}
}
