import BgControl from "./BgControl";
import BulletControl from "./BulletControl";
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
  enenmyManagerNode: cc.Node = null;

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
    return this.enenmyManagerNode.getComponent(EnemyManager);
  }

  //   gamePause() {
  //     this.getPlayerControl().isPause = true;
  //     this.getBackgroundControl().pause();
  //     //this.getEnemyManager().pause();
  //     console.log("调用 gamePause() 方法");

  //     const enemyManager = cc.find("EnemyManagerNode").getComponent(EnemyManager); // 根据实际节点名称调整
  //     if (enemyManager) {
  //       enemyManager.pause();
  //     } else {
  //       console.warn("未找到 EnemyManager 组件");
  //     }
  //   }
  // gamePause() {
  //   const playerNode = cc.find("/GamePlay/player"); // 更新为正确的路径
  //   if (playerNode) {
  //     const playerControl = playerNode.getComponent(PlayerControl);
  //     if (playerControl) {
  //       playerControl.isPause = true;
  //       playerControl.bullets.forEach((bullet) => {
  //         bullet.getComponent(BulletControl).isPause = true;
  //       });
  //     }
  //   }

  //   const enemyManagerNode = cc.find("EnemyManager"); // 更新为正确的路径
  //   if (enemyManagerNode) {
  //     const enemyManager = enemyManagerNode.getComponent(EnemyManager);
  //     if (enemyManager) {
  //       enemyManager.pause();
  //     }
  //   }
  // }

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
