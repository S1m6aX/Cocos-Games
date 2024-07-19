const { ccclass, property } = cc._decorator;

@ccclass
export default class BgControl extends cc.Component {
  start() {}

  update(dt) {
    // 移动
    // 遍历子物体（背景）
    for (let bgNode of this.node.children) {
      // 移动 50px/帧 -> 50px/秒
      bgNode.y -= 50 * dt;
      if (bgNode.y < -850) {
        bgNode.y += 852 * 2;
      }
    }
  }
}
