const { ccclass, property } = cc._decorator;

@ccclass
export default class BgControl extends cc.Component {
  start() {
    // 播放背景音乐
    cc.resources.load(
      "audio/bg_music",
      cc.AudioClip,
      (err, src: cc.AudioClip) => {
        if (err) {
          console.error("Failed to load audio:", err);
          return;
        }
        let audioId = cc.audioEngine.playMusic(src, true);
      }
    );
  }

  update(dt) {
    // 移动
    // 遍历子物体（背景）
    for (let bgNode of this.node.children) {
      // 移动 50px/帧 -> 50px/秒
      bgNode.y -= 50 * dt;
      if (bgNode.y < -bgNode.height) {
        bgNode.y += bgNode.height * 2;
      }
    }
  }
}
