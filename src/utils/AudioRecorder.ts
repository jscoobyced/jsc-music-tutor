export interface AudioRecorderOptions {
  fftSize?: number;
  sampleRate?: number;
  maxDecibels?: number;
  minDecibels?: number;
}

const defaultRecorderOptions = {
  fftSize: 2048,
  sampleRate: 48000,
  maxDecibels: -20,
  minDecibels: -100
}

export default class AudioRecorder {

  // Web Media API objects
  private audioContext: AudioContext = null as unknown as AudioContext;
  private analyserNode: AnalyserNode = null as unknown as AnalyserNode;
  private mediaRecorder: MediaRecorder = null as unknown as MediaRecorder;
  private gainNode: GainNode = null as unknown as GainNode;

  // Configuration
  private frequencyStep = 0;

  // Data
  private isRecording = false;
  private isInitialized = false;
  private ondata?: (data: Uint8Array) => void = null as unknown as (data: Uint8Array) => void;

  /**
   * Initialize the whole environment. Must be called on user event (i.e. button or mouse click)
   * otherwise the security context will prevent creating a recorder.
   * @param options Optional override of default values
   * @param ondata Optional function to be called when data is available
   */
  initialize = (options?: AudioRecorderOptions, ondata?: (data: Uint8Array) => void) => {
    if (this.isInitialized) return new Promise(() => { });
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Setup Web Audio API objects
        this.ondata = ondata;
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioContext = new AudioContext({
          latencyHint: "interactive",
          sampleRate: (options && options?.sampleRate) || defaultRecorderOptions.sampleRate
        });
        this.analyserNode = new AnalyserNode(this.audioContext, {
          fftSize: (options && options?.fftSize) || defaultRecorderOptions.fftSize,
          maxDecibels: (options && options?.maxDecibels) || defaultRecorderOptions.maxDecibels,
          minDecibels: (options && options?.minDecibels) || defaultRecorderOptions.minDecibels
        });
        this.frequencyStep = Math.floor(10 * (this.audioContext.sampleRate / 2) / (this.analyserNode.fftSize / 2)) / 10;
        this.gainNode = this.audioContext.createGain();
        // Set the gain to 0 to mute the output and avoid echo
        this.gainNode.gain.value = 0;

        // Connect: microphone -> analyser -> gain -> audio context
        let source = this.audioContext.createMediaStreamSource(this.mediaRecorder.stream);
        source.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        // Setup events
        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          let dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
          this.analyserNode.getByteFrequencyData(dataArray);
          this.ondata && this.ondata(dataArray);
        }
        this.mediaRecorder.onstop = () => {
          this.mediaRecorder.stream.getTracks().forEach(track => {
            if (track.readyState === 'live') {
              track.stop();
            }
          });
        };
        this.isInitialized = true;
      });
  }

  /**
   * Start recording. Will do nothing if not initialized or already recording.
   * @param sample The sample size to send to the `ondata` function. Default
   * will send at the end of the recording.
   */
  start = (sample = 0) => {
    if (this.isInitialized && !this.isRecording) {
      this.mediaRecorder.start(sample);
    }
  }

  /**
   * Stop the recording.
   */
  stop = () => {
    if (this.isRecording) {
      this.mediaRecorder.stop();
    }
  }
}