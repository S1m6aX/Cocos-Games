import GamePause from "./GamePause";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnControl extends cc.Component {
  // 用于拖放 GamePause 节点的属性
  @property(cc.Node)
  gamePauseNode: cc.Node = null;

  @property(cc.Node)
  gameReadyNode: cc.Node = null;

  @property(cc.Node)
  pauseButton: cc.Node = null;

  @property(cc.Node)
  restartButton: cc.Node = null;

  @property(cc.Node)
  continueButton: cc.Node = null;

  @property(cc.Node)
  homeButton: cc.Node = null;

  @property(cc.Node)
  scoreManager: cc.Node = null;

  onLoad() {
    this.bindButton(this.pauseButton, this.onPauseButtonClick);
    this.bindButton(this.restartButton, this.onRestartButtonClick);
    this.bindButton(this.continueButton, this.onContinueButtonClick);
    this.bindButton(this.homeButton, this.onHomeButtonClick);
  }

  bindButton(buttonNode: cc.Node, callback: Function) {
    buttonNode.on("click", callback, this);
  }

  onPauseButtonClick() {
    // 显示GamePause页面
    this.gamePauseNode.active = true;
    // 暂停Player
    this.gamePauseNode.getComponent(GamePause).gamePause();
  }

  onRestartButtonClick() {
    // 重新开始游戏逻辑
    cc.director.loadScene(cc.director.getScene().name);
  }

  onContinueButtonClick() {
    // 关闭GamePause页面
    this.gamePauseNode.active = false;
    this.gamePauseNode.getComponent(GamePause).gameResume();
  }

  onHomeButtonClick() {
    // 回到主页逻辑
    cc.director.loadScene(cc.director.getScene().name);
  }
}
