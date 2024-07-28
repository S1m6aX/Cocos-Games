import BuffControl from "./BuffControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuffManager extends cc.Component {
  @property(cc.Prefab)
  DualPre: cc.Prefab;

  @property(cc.Prefab)
  BoomPre: cc.Prefab;

  @property(cc.Node)
  ScoreManager: cc.Node = null;

  @property(cc.Node)
  BuffContainer: cc.Node = null;

  public isPause: boolean = false;
  public buffCount: number = 0;
  // onLoad () {}

  start() {
    this.schedule(this.spawnBoom, Math.random() * 45 + 45);
    this.schedule(this.spawnDual, Math.random() * 15 + 20);
  }

  spawnBoom() {
    if (!this.isPause) {
      const boomBuff = cc.instantiate(this.BoomPre);
      boomBuff.x = Math.random() * 580 + 30;
      boomBuff.y = 1476.8;
      boomBuff.setParent(this.BuffContainer);
      this.buffCount += 1;
    }
  }

  spawnDual() {
    if (!this.isPause) {
      const dualBuff = cc.instantiate(this.DualPre);
      dualBuff.x = Math.random() * 582 + 29;
      dualBuff.y = 1476.8;
      dualBuff.setParent(this.BuffContainer);
      this.buffCount += 1;
    }
  }

  pause() {
    this.isPause = true;
    this.BuffContainer.children.forEach((buff) => {
      const buffControl = buff.getComponent(BuffControl);

      buffControl.isPause = true;
    });
  }

  resume() {
    this.isPause = false;
    this.BuffContainer.children.forEach((buff) => {
      const buffControl = buff.getComponent(BuffControl);

      buffControl.isPause = false;
    });
  }

  update(dt) {}
}
