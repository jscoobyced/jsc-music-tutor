import React from 'react';
import AudioRecorder from '../../utils/Recorder';
import Player from '../../utils/Player';
import { generateNotes } from '../notes/RandomNotesGenerator';
import { Sheet } from './Sheet';
import './SheetPage.scss';

export const SheetPage = () => {

  const startX = 80;
  const spaceX = 30;
  const muteColor = 'black';
  const playColor = 'red';

  const populateNotes = () => generateNotes(startX, spaceX, muteColor);

  const [playNotes, setPlayNotes] = React.useState(populateNotes());
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [currentPlayer] = React.useState(new Player());

  const verifyNote = (frequency: number, noteCount: number) => {
    if (frequency > 0 && currentPlayer.isPlaying()) {
      currentPlayer.playNote(frequency, 1)
        .then(() => {
          if (noteCount < playNotes.length && currentPlayer.isPlaying()) {
            startRecording()
              .then(audioRecorder => {
                setTimeout(() => {
                  audioRecorder.stop()
                    .then((audioData) => {
                      audioData.play()
                        .then(() => {
                          playNext(noteCount + 1);
                        });
                    })
                }, 3000);
              });
          } else {
            setIsButtonDisabled(false);
          }
        });
    }
  }

  const startPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    currentPlayer.initialize();
    setIsButtonDisabled(true);
    playNext(0);
  }

  const resetNotes = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setPlayNotes(populateNotes());
  }

  const stopPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsButtonDisabled(false);
    currentPlayer.stopPlaying();
  }

  const playNext = (noteCount: number) => {
    let frequency = 0;
    const newNotes = playNotes.map((note, index) => {
      if (index === noteCount) {
        frequency = note.frequency !== undefined ? note.frequency : 0;
        return {
          cX: note.cX,
          cY: note.cY,
          color: playColor,
          frequency: note.frequency
        }
      } else return {
        cX: note.cX,
        cY: note.cY,
        color: muteColor,
        frequency: note.frequency
      }
    });
    setPlayNotes(newNotes);
    verifyNote(frequency, noteCount);
  }

  const startRecording = () => {
    let recorder: AudioRecorder = new AudioRecorder();
    return recorder.initialize()
      .then(() => {
        recorder.start();
        return recorder;
      });
  }

  const record = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    startRecording()
      .then(audioRecorder => {
        setTimeout(() => {
          audioRecorder.stop()
            .then((audioData) => {
              audioData.play();
            })
        }, 3000);
      });
  };

  return (
    <div className='sheet-page'>
      Click the 'Start' button to start listening for your audio <sup
        className='tooltip-info'
        title='You will have to accept the permissions to capture audio.'>(?)</sup> then play the notes as they display.
      <Sheet playNotes={playNotes} />
      <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisabled} />
      <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisabled} />
      <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisabled} />
      <input type='button' value='Record' onClick={record} />

    </div>
  );
}