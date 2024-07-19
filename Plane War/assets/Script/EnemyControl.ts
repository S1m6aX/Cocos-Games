const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {
  // 是否死亡
  isDie: boolean = false;
  start() {}

  update(dt) {
    // 移动
    if (!this.isDie) {
      this.node.y -= 300 * dt;
    }

    if (this.node.y < -850) {
      this.node.destroy();
    }
  }

  //死亡
  die() {
    this.isDie = true;
    // 加载爆炸图片
    cc.loader.loadRes("enemy0_die", cc.SpriteFrame, (err, res) => {
      this.node.getComponent(cc.Sprite).spriteFrame = res;
    });
    // 300毫秒后销毁
    setTimeout(() => {
      this.node.destroy();
    }, 300);
  }
}
