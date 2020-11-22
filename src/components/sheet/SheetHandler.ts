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

  public startPlayAndRecord = (playNotes: NoteData[],
    updateNotes?: (playNotes: NoteData[]) => void,
    muteColor?: string,
    playColor?: string) => {
    this.playNotes = playNotes;
    this.updateNotes = (updateNotes && updateNotes) || (() => { });
    this.playColor = (playColor && playColor) || 'black';
    this.muteColor = (muteColor && muteColor) || 'green';
    this.player.initialize();
    this.recorder.initialize();
    this.playNext(0);
  }

  public stopRecordAndPlay = () => {
    this.player.stopPlaying();
  }

  public startRecording = (frequency: number) => {
    return this.recorder.initialize()
      .then(() => {
        this.recorder.start();
      });
  }

  public playNext = (noteCount: number) => {
    let frequency = 0;
    const newNotes = this.playNotes.map((note, index) => {
      if (index === noteCount) {
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
    this.player.playNote(frequency, 1);
    //this.startRecording(frequency);
  }
}