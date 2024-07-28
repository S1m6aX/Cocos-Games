import EnemyControl from "./EnemyControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoomControl extends cc.Component {
  @property(cc.Node)
  enemyContainer: cc.Node = null;

  @property(cc.Label)
  boomLabel: cc.Label = null;

  public amount: number = 0;
  start() {
    this.node.active = false;
  }

  boom() {
    if (this.amount <= 0) {
      return;
    }
    this.enemyContainer.children.forEach((enemy) => {
      enemy.getComponent(EnemyControl).die();
    });
    this.updateAmount(-1);
  }

  updateAmount(num: number) {
    this.amount += num;
    this.boomLabel.string = this.amount.toString();
  }

  // update (dt) {}
}
