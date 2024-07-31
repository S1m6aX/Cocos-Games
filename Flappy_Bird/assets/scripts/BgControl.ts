import BirdControl from "./BirdControl";
import GameControl from "./GameControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BgControl extends cc.Component {
  @property(cc.Node)
  Land: cc.Node = null;

  @property(cc.Node)
  Pipes: cc.Node = null;

  @property(cc.Node)
  Bird: cc.Node = null;

  @property(cc.Node)
  Game: cc.Node = null;

  private gap: number = 75;
  private counter: number = 0;
  private isPause: boolean = true;
  onLoad() {
    // Assuming all background sprites have the same width
  }

  start() {
    const game = this.Game.getComponent(GameControl);

    this.node.on(cc.Node.EventType.TOUCH_START, () => {
      if (!game.isOn) {
        game.gameStart();
      } else {
        this.Bird.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 400);

        cc.audioEngine.playEffect(
          this.Bird.getComponent(BirdControl).flyAudioClip,
          false
        );
      }
      this.Bird.getComponent(cc.Animation).play();
    });
  }

  update(dt) {
    this.moveBackground(dt);

    if (!this.Game.getComponent(GameControl).isPause) {
      this.movePipe(dt);
    }
  }

  moveBackground(dt) {
    this.Land.children.forEach((element) => {
      element.x -= 50 * dt;
      if (element.x <= -288) {
        element.x += 288 * 2;
      }
    });
  }
  movePipe(dt) {
    this.Pipes.children.forEach((element) => {
      const top = element.getChildByName("pipe_down");
      const bottom = element.getChildByName("pipe_up");
      element.x -= 150 * dt;
      if (element.x <= -170) {
        element.x += 510;
        element.y = Math.random() * 150 - 75;
        bottom.y = -this.gap;
        top.y = this.gap;
        this.counter += 1;
        element.active = true;
        if (this.counter != 0 && this.counter % 10 == 0 && this.gap > 25) {
          this.gap -= 5;
        }
      }
    });
  }
}
