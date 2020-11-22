import AudioRecorder from '../../utils/AudioRecorder';
import Player from '../../utils/Player';
import { NoteData } from '../notes/NoteConstants';

export default class SheetHandler {
  private player = new Player();
  private recorder: AudioRecorder = new AudioRecorder();
  private playNotes: NoteData[] = [];
  private muteColor = '';
  private playColor = '';
  private updateNotes: (playNotes: NoteData[]) => void = () => { };
  private updateFrequencies: (frequencies: number[]) => void = () => { };
  private playComplete: () => void = () => { };
  private currentNote = 0;

  public initialize = (updateFrequencies?: (frequencies: number[]) => void,
    playComplete?: () => void) => {
    return new Promise(resolve => {
      this.player.initialize();
      this.recorder.initialize({}, this.onData)
        .then(() => {
          this.updateFrequencies = (updateFrequencies && updateFrequencies) || (() => { });
          this.playComplete = (playComplete && playComplete) || (() => { });
          resolve();
        });
    });
  }

  public startPlayAndRecord = (playNotes: NoteData[],
    updateNotes?: (playNotes: NoteData[]) => void,
    muteColor?: string,
    playColor?: string) => {
    this.playNotes = playNotes;
    this.updateNotes = (updateNotes && updateNotes) || (() => { });
    this.playColor = (playColor && playColor) || 'black';
    this.muteColor = (muteColor && muteColor) || 'green';
    this.currentNote = 0;
    this.player.start();
    this.playNext();
    this.recorder.start();
  }

  public stopRecordAndPlay = () => {
    this.player.stopPlaying();
    this.recorder.stop();
  }

  public playNext = () => {
    let frequency = 0;
    const newNotes = this.playNotes.map((note, index) => {
      if (index === this.currentNote) {
        frequency = note.frequency !== undefined ? note.frequency : 0;
        return {
          cX: note.cX,
          cY: note.cY,
          color: this.playColor,
          frequency: note.frequency
        }
      } else return {
        cX: note.cX,
        cY: note.cY,
        color: this.muteColor,
        frequency: note.frequency
      }
    });
    this.updateNotes(newNotes);
    this.player.playNote(frequency, 1)
      .then(() => {
        if (this.playNotes.length > this.currentNote + 1) {
          this.currentNote = this.currentNote + 1;
          this.playNext();
        }
        else
          this.playComplete();
      });
  }

  private onData = (data: Uint8Array) => {
    let max = 0;
    data.forEach((volume) => {
      if (volume > max) {
        max = volume;
      }
    });
    let frequencies: number[] = [];
    data.forEach((volume, index) => {
      if (volume > (max * .99)) {
        frequencies.push(this.recorder.getFrequency(index));
      }
    });
    this.updateFrequencies(frequencies);
  }
}