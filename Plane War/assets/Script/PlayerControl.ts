const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  start() {
    // 移动
    this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
      this.node.setPosition(event.getLocation());
    });
    // 攻击 计时器
    this.schedule(() => {
      // 创建子弹
      let bullet = cc.instantiate(this.bulletPre);
      // 设置父物体
      bullet.setParent(cc.director.getScene());
      // 设置位置
      bullet.x = this.node.x;
      bullet.y = this.node.y + 70;
    }, 0.5);
    // 开启碰撞检测
    cc.director.getCollisionManager().enabled = true;
  }

  update() {}
}
