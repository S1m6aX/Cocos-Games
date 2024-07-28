const { ccclass, property } = cc._decorator;

@ccclass
export default class BgControl extends cc.Component {
  @property({ type: cc.AudioClip })
  bgMusic: cc.AudioClip = null;

  public isPause: boolean = false;
  private audioId: number = -1;

  start() {
    this.playMusic();
    // Enable collision
    cc.director.getCollisionManager().enabled = true;
  }

  update(dt) {
    if (!this.isPause) {
      // Move background
      for (let bgNode of this.node.children) {
        bgNode.y -= 50 * dt;
        if (bgNode.y < -bgNode.height * 1.3) {
          bgNode.y += bgNode.height * 1.3 * 2;
        }
      }
    }
  }

  // Play background music
  playMusic() {
    if (this.bgMusic && !this.isPause) {
      this.audioId = cc.audioEngine.playMusic(this.bgMusic, true);
    }
  }

  // Pause background music
  pause() {
    this.isPause = true;
    if (this.audioId !== -1) {
      cc.audioEngine.pauseMusic(); // Pause the background music
    }
  }

  // Resume background music
  resume() {
    this.isPause = false;

    cc.audioEngine.resumeMusic(); // Resume music if ID is valid
  }
}
