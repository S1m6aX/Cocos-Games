import BgControl from "./BgControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameControl extends cc.Component {
  @property(cc.Node)
  Bg: cc.Node = null;

  @property(cc.Node)
  Bird: cc.Node = null;

  @property(cc.Node)
  Score: cc.Node = null;

  public isOn: boolean = false;
  public isPause: boolean = true;
  public score: number = 0;

  // LIFE-CYCLE CALLBACKS:
  onLoad() {}

  start() {
    const background = this.Bg.getComponent(BgControl);
    const gameReady = this.node.getChildByName("GameReady");
    const gameOver = this.node.getChildByName("GameOver");
    gameReady.active = true;
    gameOver.active = false;
  }

  // update (dt) {}

  pause() {
    // this.Bg.getComponent(BgControl).isPause = true;
  }

  gameStart() {
    this.isOn = true;
    this.isPause = false;
    cc.director.getPhysicsManager().enabled = true; // Enable physics on first touch
    this.Bird.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 400);
    this.Bird.getComponent(cc.RigidBody).gravityScale = 5;
    this.node.getChildByName("GameReady").active = false;
  }

  gameOver() {
    this.isOn = false;
    this.isPause = true;
    this.node.getChildByName("GameOver").active = true;
    this.Bg.off(cc.Node.EventType.TOUCH_START);

    const medal = this.node
      .getChildByName("GameOver")
      .getChildByName("mask")
      .getChildByName("medals");
    const shift = Math.floor(this.score / 10);
    if (this.score <= 80) {
      medal.x = 66 - shift * 44;
    } else {
      medal.x = -66;
    }

    this.node
      .getChildByName("GameOver")
      .getChildByName("score")
      .getComponent(cc.Label).string = this.score.toString();
  }

  restart() {
    cc.director.loadScene(cc.director.getScene().name);
  }

  scored() {
    this.score += 1;
    this.node.getChildByName("Score").getComponent(cc.Label).string =
      this.score.toString();
  }
}
