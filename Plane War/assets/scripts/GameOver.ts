import BuffControl from "./BuffControl";
import BuffManager from "./BuffManager";
import GamePause from "./GamePause";
import GamePlay from "./GamePlay";
import PlayerControl from "./PlayerControl";
import ScoreManager from "./ScoreManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {
  @property(cc.Node)
  gamePause: cc.Node = null;

  @property(cc.Node)
  scoreManager: cc.Node = null;

  @property(cc.Node)
  gamePlay: cc.Node = null;

  @property(cc.Node)
  buffManager: cc.Node = null;

  @property(cc.Node)
  playerNode: cc.Node = null;

  @property(cc.Label)
  scoreLabel: cc.Label = null;

  @property(cc.Label)
  timeLabel: cc.Label = null;

  @property(cc.Label)
  buffLabel: cc.Label = null;

  @property(cc.Label)
  accuracyLabel: cc.Label = null;

  start() {
    this.node.active = false;
  }

  show() {
    // 获取组件
    const gamePauseComponent = this.gamePause.getComponent(GamePause);
    const scoreManagerComponent = this.scoreManager.getComponent(ScoreManager);
    const gamePlayComponent = this.gamePlay.getComponent(GamePlay);
    const buffComponent = this.buffManager.getComponent(BuffManager);
    const playerComponent = this.playerNode.getComponent(PlayerControl);

    // 执行暂停操作
    gamePauseComponent.gamePause();
    this.node.active = true;

    // 获取分数和时间
    const score = scoreManagerComponent.score;
    const targetTime = gamePlayComponent.gameTime;
    const buff = buffComponent.buffCount;
    const accuracy =
      (playerComponent.bulletHit / playerComponent.bulletCount) * 100; // 计算百分比

    // 动态更新时间和分数，依次显示
    this.updateLabelWithAnimation(this.scoreLabel, 0, score, 1, () => {
      this.updateLabelWithAnimation(this.timeLabel, 0, targetTime, 1, () => {
        this.updateLabelWithAnimation(this.buffLabel, 0, buff, 1, () => {
          this.updateLabelWithAnimation(
            this.accuracyLabel,
            0,
            accuracy,
            1,
            () => {
              this.accuracyLabel.string = accuracy.toFixed(2) + "%"; // 显示百分比
            }
          );
        });
      });
    });

    // 暂停计时器
    gamePlayComponent.pauseTimer();
  }

  updateLabelWithAnimation(
    label: cc.Label,
    start: number,
    end: number,
    duration: number,
    callback?: () => void
  ) {
    // 计算动画的时间间隔和步数
    const steps = 100;
    const interval = duration / steps; // 原本的间隔时间
    const stepValue = (end - start) / steps;
    let currentValue = start;

    // 使用 setTimeout 实现逐步更新
    const updateStep = () => {
      currentValue += stepValue;
      if (currentValue >= end) {
        currentValue = end;
        label.string = Math.floor(currentValue).toString();
        if (callback) callback(); // 执行回调函数
        return;
      }
      label.string = Math.floor(currentValue).toString();
      setTimeout(updateStep, interval); // 减少停顿
    };

    updateStep();
  }

  restart() {
    cc.director.loadScene(cc.director.getScene().name);
  }
}
