import BgControl from "./BgControl";
import BuffManager from "./BuffManager";
import EnemyManager from "./EnemyManager";
import GamePlay from "./GamePlay";
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

  @property(cc.Node)
  buffManager: cc.Node = null;

  @property(cc.Node)
  gameplay: cc.Node = null;

  start() {
    // this.node.active = false;
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

  getBuffManger() {
    return this.buffManager.getComponent(BuffManager);
  }

  getGameplay() {
    return this.gameplay.getComponent(GamePlay);
  }
  gamePause() {
    this.getPlayerControl().pause();
    this.getBackgroundControl().pause();
    this.getEnemyManager().pause();
    this.getBuffManger().pause();
    this.getGameplay().pauseTimer();
  }
  gameResume() {
    this.getPlayerControl().resume();
    this.getBackgroundControl().resume();
    this.getEnemyManager().resume();
    this.getBuffManger().resume();
    this.getGameplay().startTimer();
  }
}
