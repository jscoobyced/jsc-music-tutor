import AudioRecorder from '../../utils/AudioRecorder';
import Player from '../../utils/Player';
import { NoteConstant, NoteData, SimpleNote } from '../../utils/NoteConstants';

export default class SheetHandler {
  private player = new Player();
  private recorder: AudioRecorder = new AudioRecorder();
  private playNotes: NoteData[] = [];
  private muteColor = '';
  private playColor = '';
  private updateNotes: (playNotes: NoteData[]) => void = () => { };
  private updateNote: (expectedNote: string, currentNote: string) => boolean = () => true;
  private onPlay: (note: SimpleNote) => void = () => { };
  private playComplete: () => void = () => { };
  private currentNote = 0;
  private currentFrequency = 0;
  private ready = false;

  public initialize = (updateNotes?: (expectedNote: string, currentNote: string) => boolean,
    playComplete?: () => void,
    onPlay?: (note: SimpleNote) => void) => {
    return new Promise(resolve => {
      this.player.initialize();
      this.recorder.initialize(this.onData)
        .then(() => {
          this.updateNote = (updateNotes && updateNotes) || (() => true);
          this.playComplete = (playComplete && playComplete) || (() => { });
          this.onPlay = (onPlay && onPlay) || (() => { });
          this.ready = false;
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
    this.ready = false;
    if (this.currentNote >= this.playNotes.length) {
      this.playComplete();
      return;
    }
    this.currentFrequency = 0;
    let notePlaying: SimpleNote = NoteConstant.None;
    const newNotes = this.playNotes.map((note, index) => {
      if (index === this.currentNote) {
        notePlaying = {
          f: (note.frequency && note.frequency) || 0,
          y: (note.cY && note.cY) || 0,
          n: (note.name && note.name) || ""
        };
        this.currentFrequency = note.frequency !== undefined ? note.frequency : 0;
        return {
          cX: note.cX,
          cY: note.cY,
          color: this.playColor,
          name: note.name,
          frequency: note.frequency
        }
      } else return {
        cX: note.cX,
        cY: note.cY,
        color: this.muteColor,
        name: note.name,
        frequency: note.frequency
      }
    });
    this.updateNotes(newNotes);
    notePlaying && this.onPlay(notePlaying);
    this.player.playNote(this.currentFrequency, 1)
      .then(() => {
        this.ready = true;
        this.currentNote = this.currentNote + 1;
      });
  }

  private onData = (actualNote: string) => {
    if (!this.ready || this.currentNote > this.playNotes.length) return;
    let expectedNote = (this.playNotes[this.currentNote - 1].name ?? this.playNotes[this.currentNote - 1].name) || "";
    const noteFound = this.updateNote(expectedNote, actualNote);
    if (noteFound && this.ready) {
      this.playNext();
    }
  }
}