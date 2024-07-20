import PlayerControl from "./PlayerControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class eBulletControl extends cc.Component {
  @property
  speed: number = 1000;

  start() {}

  update(dt) {
    // 移动
    this.node.y -= this.speed * dt;

    if (this.node.y < -30) {
      this.node.destroy();
    }
  }

  onCollisionEnter(other) {
    if (other.tag == 2) {
      other.getComponent(PlayerControl).die();
      this.node.destroy();
    }
  }
}
