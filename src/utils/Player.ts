export default class Player {
  private audioContext: AudioContext = null as unknown as AudioContext;
  private currentTime = 0;
  private play = false;
  private duration = .5; // 500ms

  initialize = () => {
    this.audioContext = new AudioContext()
    var buffer = this.audioContext.createBuffer(1, 1, 22050);
    var node = this.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    this.currentTime = this.audioContext.currentTime;
  }

  start = () => {
    this.play = true;
  }

  playNote = (frequency: number, noteLength: number): Promise<void> => {
    return new Promise(resolve => {
      if (this.play) {
        var osc = this.audioContext.createOscillator();
        var gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.5;
        gainNode.connect(this.audioContext.destination)
        osc.connect(gainNode);
        osc.frequency.value = frequency;
        this.currentTime = this.audioContext.currentTime;
        osc.start(this.currentTime);
        osc.stop(this.currentTime + noteLength * this.duration);
        setTimeout(() => {
          resolve();
        }, (1100 * this.duration) * noteLength);
      }
    });
  }

  isPlaying = () => {
    return this.play;
  }

  stopPlaying = () => {
    this.play = false;
  }
}