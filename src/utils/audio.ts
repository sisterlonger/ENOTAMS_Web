// src/utils/audio.ts
// 在文件顶部导入音频文件
import warningAudio from '@/assets/audio/timeout.mp3';
import errorAudio from '@/assets/audio/timeout.mp3';
import infoAudio from '@/assets/audio/timeout.mp3';

class AudioAlert {
  private audio: HTMLAudioElement | null = null;

  private isSupported = false;

  private isUnlocked = false; // 记录音频是否已解锁

  constructor() {
    this.init();
  }

  private init() {
    // 检查浏览器是否支持Audio API
    this.isSupported = typeof Audio !== 'undefined';

    if (this.isSupported) {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      // 尝试解锁音频（某些浏览器需要用户交互后音频才能播放）
      this.unlockAudio();
    }
  }

  /**
   * 解锁音频（处理浏览器自动播放策略）
   */
  public unlockAudio(): void {
    if (!this.audio || this.isUnlocked) {
      return;
    }

    // 尝试播放一个无声的音频来解锁
    this.audio.volume = 0;
    this.play()
      .then(() => {
        this.isUnlocked = true;
        if (this.audio) {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.audio.volume = 1; // 恢复音量
        }
      })
      .catch(() => {
        console.log('音频需要用户交互才能解锁');
      });
  }

  /**
   * 播放告警声音
   */
  public async play(alertType: 'warning' | 'error' | 'info' = 'warning'): Promise<void> {
    if (!this.isSupported || !this.audio) {
      console.warn('浏览器不支持音频播放');
      return;
    }

    // 根据告警类型选择不同的音频文件
    let audioUrl = '';
    // 然后在 play 方法中使用
    switch (alertType) {
      case 'warning':
        audioUrl = warningAudio;
        break;
      case 'error':
        audioUrl = errorAudio;
        break;
      case 'info':
        audioUrl = infoAudio;
        break;
      default:
        audioUrl = warningAudio;
    }

    try {
      this.audio.src = audioUrl;
      this.audio.volume = 0.7; // 设置音量（0-1）

      // 尝试播放
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        await playPromise;
        console.log('告警声音播放成功');
      }
    } catch (error) {
      console.error('播放告警声音失败:', error);
      // 如果自动播放失败，尝试解锁音频
      if (!this.isUnlocked) {
        this.unlockAudio();
      }
    }
  }

  /**
   * 停止播放
   */
  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * 设置音量
   */
  public setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// 创建单例
const audioAlert = new AudioAlert();
export default audioAlert;
