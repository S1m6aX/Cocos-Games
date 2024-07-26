const { ccclass, property } = cc._decorator;

@ccclass
export default class GameReady extends cc.Component {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Node)
  clickNode: cc.Node = null;

  @property(cc.Node)
  playerNode: cc.Node = null;

  @property(cc.Node)
  enemyNode: cc.Node = null;

  private animation: cc.Animation = null;

  start() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

    // Get animation component
    if (this.titleNode) {
      this.animation = this.titleNode.getComponent(cc.Animation);
    }
  }
  onTouchStart(event) {
    if (this.animation) {
      this.animation.play("title");
      const duration =
        this.animation.getAnimationState("title").duration * 1000;
      setTimeout(() => {
        this.titleNode.active = false;
      }, duration);
    }

    if (this.clickNode) {
      this.clickNode.active = false;
    }

    // remove click event listener
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

    this.playerNode.active = true;
    this.enemyNode.active = true;
  }

  update(dt) {}
}
