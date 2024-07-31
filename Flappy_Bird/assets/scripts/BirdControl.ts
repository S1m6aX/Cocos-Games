import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BirdControl extends cc.Component {
  @property(cc.Node)
  Game: cc.Node = null;

  public flyAudioClip: cc.AudioClip = null;
  private scoreAudioClip: cc.AudioClip = null;
  private hitAudioClip: cc.AudioClip = null;

  onLoad() {
    // cc.director.getPhysicsManager().enabled = false;
    cc.director.getCollisionManager().enabled = true;
    cc.director.getPhysicsManager().enabled = true;
    this.node.getComponent(cc.RigidBody).gravityScale = 0;

    cc.resources.load(
      "sound/sfx_wing",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.log("Failed to load audio: " + err);
          return;
        }
        this.flyAudioClip = clip;
      }
    );

    cc.resources.load(
      "sound/sfx_hit",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.log("Failed to load audio: " + err);
          return;
        }
        this.hitAudioClip = clip;
      }
    );

    cc.resources.load(
      "sound/sfx_point",
      cc.AudioClip,
      (err, clip: cc.AudioClip) => {
        if (err) {
          console.log("Failed to load audio: " + err);
          return;
        }
        this.scoreAudioClip = clip;
      }
    );
  }

  start() {}

  protected update(dt: number): void {
    // this.node.y -= 200 * dt;
  }

  onBeginContact(contact, self, other) {
    this.Game.getComponent(GameControl).gameOver();
  }

  onCollisionEnter(other) {
    if (other.tag === 1) {
      this.Game.getComponent(GameControl).scored();
      cc.audioEngine.playEffect(this.scoreAudioClip, false);
    } else {
      this.Game.getComponent(GameControl).gameOver();
      cc.audioEngine.playEffect(this.hitAudioClip, false);
    }
  }

  startFalling() {
    cc.director.getPhysicsManager().enabled = true;
  }
}
