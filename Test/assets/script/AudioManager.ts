const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  start() {
    /* 通过组件播放

    // 获取播放器组件
    let player: cc.AudioSource = this.getComponent(cc.AudioSource);

    // 加载音频 type:cc.AudioClip声音片段
    cc.loader.loadRes("lazer", cc.AudioClip, (res, clip) => {
      // 赋值音频
      player.clip = clip;

      //播放
      player.play();

      **
       * 是否正在播放
       * player.isPlaying();
       *
       * 暂停
       * player.pause();
       *
       * 恢复
       * player.resume();
       *
       * 停止
       * player.stop();
       *
       * 循环
       * player.loop = true;
       *
       * 音量
       * player.volume = 1;
       *
    
    })
    */

    cc.loader.loadRes("lazer", cc.AudioClip, (res, clip) => {
      // 播放
      let audioId: number = cc.audioEngine.playMusic(clip, true);
      /*
      
      // 是否正在播放
      cc.audioEngine.isMusicPlaying();

      // 暂停
      cc.audioEngine.pause(audioId); // 音效
      cc.audioEngine.pauseMusic(); // 背景音乐，不可重叠

      // 恢复
      cc.audioEngine.resume(audioId);

      // 停止
      cc.audioEngine.stop(audioId);
      // 循环
      cc.audioEngine.setLoop(audioId, true);
      // 音量
      cc.audioEngine.setVolume(audioId, 1);
      */
    });
  }

  // update (dt) {}
}
