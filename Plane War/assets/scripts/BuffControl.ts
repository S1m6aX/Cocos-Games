const { ccclass, property } = cc._decorator;

@ccclass
export default class BuffControl extends cc.Component {
  private speed: number = 100;
  public isPause: boolean = false;

  start() {}

  update(dt) {
    if (!this.isPause) {
      this.node.y -= dt * this.speed;
    }
    if (this.node.y < -110) {
      this.destroy;
    }
  }

  onCollisionEnter(other) {
    // player
    if (other.tag == 5) {
      this.node.destroy();
    }
  }
}
