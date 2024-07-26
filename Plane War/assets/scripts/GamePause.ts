import BgControl from "./BgControl";
import EnemyManager from "./EnemyManager";
import PlayerControl from "./PlayerControl";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GamePause extends cc.Component {
  @property(cc.Node)
  playerNode: cc.Node = null;

  @property(cc.Node)
  backgroundNode: cc.Node = null;

  @property(cc.Node)
  enemyManagerNode: cc.Node = null;

  start() {
    this.node.active = false;
  }

  getPlayerControl(): PlayerControl | null {
    return this.playerNode.getComponent(PlayerControl);
  }

  getBackgroundControl() {
    return this.backgroundNode.getComponent(BgControl);
  }

  getEnemyManager() {
    return this.enemyManagerNode.getComponent(EnemyManager);
  }

  gamePause() {
    this.getPlayerControl().pause();
    this.getBackgroundControl().pause();
    this.getEnemyManager().pause();
  }
  gameResume() {
    this.getPlayerControl().resume();
    this.getBackgroundControl().resume();
    this.getEnemyManager().resume();
  }
}
