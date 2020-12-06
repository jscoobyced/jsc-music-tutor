import { captureNote } from "./NoteFinder";

export default class AudioRecorder {

  // Web Media API objects
  private audioContext: AudioContext = null as unknown as AudioContext;
  private analyserNode: AnalyserNode = null as unknown as AnalyserNode;
  private mediaRecorder: MediaRecorder = null as unknown as MediaRecorder;
  private gainNode: GainNode = null as unknown as GainNode;

  // Configuration
  private globalK = 1;

  // Data
  private isRecording = false;
  private isInitialized = false;
  private sampleRate = 0;
  private timeDomainData = new Float32Array();
  private ondata?: (note: string) => void = null as unknown as (note: string) => void;

  /**
   * Initialize the whole environment. Must be called on user event (i.e. button or mouse click)
   * otherwise the security context will prevent creating a recorder.
   * @param options Optional override of default values
   * @param ondata Optional function to be called when data is available
   */
  initialize = (ondata?: (note: string) => void) => {
    this.audioContext = new AudioContext({
      latencyHint: "interactive"
    });
    if (this.audioContext.sampleRate > 160000) {
      this.globalK = 4;
    } else if (this.audioContext.sampleRate > 90000) {
      this.globalK = 2;
    }
    this.analyserNode = new AnalyserNode(this.audioContext, {
      fftSize: this.globalK * 4096,
      smoothingTimeConstant: 0
    });
    this.ondata = ondata;
    return navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    })
      .then(stream => {
        // Setup Web Audio API objects
        this.mediaRecorder = new MediaRecorder(stream);
        this.gainNode = this.audioContext.createGain();
        // Set the gain to 0 to mute the output and avoid echo
        this.gainNode.gain.value = 0;

        // Connect: microphone -> analyser -> gain -> audio context
        let source = this.audioContext.createMediaStreamSource(this.mediaRecorder.stream);
        source.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.timeDomainData = new Float32Array(this.analyserNode.fftSize);
        this.sampleRate = this.audioContext.sampleRate;

        // Setup events
        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          this.analyserNode.getFloatTimeDomainData(this.timeDomainData);
          let note = captureNote(this.timeDomainData, this.sampleRate, this.globalK);
          this.ondata && this.ondata(note);
        }
        this.mediaRecorder.onstop = () => {
          this.isRecording = false;
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
      this.isRecording = true;
      try {
        this.mediaRecorder.start(sample);
      } catch (e) {
        console.log(e);
      }
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