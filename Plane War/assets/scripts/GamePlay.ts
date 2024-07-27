const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlay extends cc.Component {
  public gameTime: number = 0;
  private timerInterval: number = 1; // 每秒更新一次
  private elapsedTime: number = 0;
  public isPause: boolean = false;
  private isTimerRunning: boolean = false; // 用于控制计时器的状态

  onLoad() {
    this.gameTime = 0;
  }

  start() {}

  update(dt) {
    if (this.isTimerRunning) {
      this.elapsedTime += dt;
      while (this.elapsedTime >= this.timerInterval) {
        this.elapsedTime -= this.timerInterval;
        this.gameTime += this.timerInterval;
      }
    }
  }

  // 启动计时器
  startTimer() {
    this.isTimerRunning = true;
  }

  // 暂停计时器
  pauseTimer() {
    this.isTimerRunning = false;
  }

  // 手动重置计时器
  resetTimer() {
    this.gameTime = 0;
    this.elapsedTime = 0;
  }
}
