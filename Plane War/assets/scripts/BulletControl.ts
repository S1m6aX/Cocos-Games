const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {
  @property
  speed: number = 800;

  public isPause: boolean = false;
  start() {}

  update(dt) {
    // 移动
    if (!this.isPause) {
      this.node.y += this.speed * dt;
      // 出屏幕销毁
      if (this.node.y > 1146) {
        this.node.destroy();
      }
    }
  }

  onCollisionEnter(other) {
    if (
      other.tag == 2 ||
      other.tag === 3 ||
      other.tag === 4 ||
      other.tag === 5
    ) {
      return;
    }
    this.node.destroy();
  }
}
