const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreManager extends cc.Component {
  @property(cc.Node)
  buffManagerNode: cc.Node = null;

  public score: number = null;

  start() {
    this.score = 0;
  }

  public updateScore(amount: number) {
    this.score += amount;
    this.getComponent(cc.Label).string = this.score.toString();
  }

  // update (dt) {}
}
