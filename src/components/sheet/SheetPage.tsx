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
  const [currentFrequency, setCurrentFrequency] = React.useState("");

  const verifyNote = (frequency: number, noteCount: number) => {
    if (frequency > 0 && currentPlayer.isPlaying()) {
      currentPlayer.playNote(frequency, 1)
        .then(() => {
          if (noteCount < playNotes.length && currentPlayer.isPlaying()) {
            createPromise();
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
        recorder.start((frequencies) => {
          let average = 0;
          if (frequencies.length > 0) {
            let i = 0;
            frequencies.forEach(v => {
              if (i === 0) {
                // v is frequency
                average += v;
              } else {
                // v is volume
              }
              i = 1 - i;
            });
            average = average / (frequencies.length / 2);
          }
          setCurrentFrequency(average.toFixed(1));
        });
        return recorder;
      });
  }

  const record = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setCurrentFrequency("");
    createPromise();
  };

  const createPromise = () => {
    startRecording()
      .then(audioRecorder => {
        setTimeout(() => {
          audioRecorder.stop();
        }, 10000);
      });
  }

  return (
    <div className='sheet-page'>
      Click the 'Start' button to start listening for your audio <sup
        className='tooltip-info'
        title='You will have to accept the permissions to capture audio.'>(?)</sup> then play the notes as they display.
      <Sheet playNotes={playNotes} />
      <div>Current frequency: {currentFrequency}.</div>
      <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisabled} />
      <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisabled} />
      <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisabled} />
      <input type='button' value='Record' onClick={record} />

    </div>
  );
}