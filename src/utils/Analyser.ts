export default class Analyser {

  private audioContext: AudioContext;
  private analyserNode: AnalyserNode;
  private gainNode: GainNode;
  private myAudio: HTMLAudioElement;
  private source: MediaElementAudioSourceNode;
  private frequencyStep = 23.4;
  private dataArray: Uint8Array = null as unknown as Uint8Array

  constructor() {
    this.audioContext = new AudioContext()
    this.analyserNode = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    this.myAudio = document.querySelector("#my-audio") as HTMLAudioElement;
    this.source = this.audioContext.createMediaElementSource(this.myAudio);
    this.source.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.myAudio.onended = () => {
      this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(this.dataArray);
      this.dataArray.forEach((v, i) => {
        if (v > 150) {
          const frequency = (i + 1) * this.frequencyStep - this.frequencyStep / 2;
          console.log(frequency, v);
        }
      });
    };
  }

  processFrequency = (audioUrl: string) => {
    this.myAudio.src = audioUrl;
    this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.myAudio.play();
  }
}