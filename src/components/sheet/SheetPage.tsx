import React from 'react';
import { NoteConstant, NoteData, SimpleNote } from '../notes/NoteConstants';
import { generateNotes } from '../notes/RandomNotesGenerator';
import { Sheet } from './Sheet';
import SheetHandler from './SheetHandler';
import './SheetPage.scss';

export const SheetPage = (props: {
  sheetHandler: SheetHandler
}) => {

  const startX = 80;
  const spaceX = 30;
  const muteColor = 'black';
  const playColor = 'green';
  const threshold = 25;

  const populateNotes = () => generateNotes(startX, spaceX, muteColor);

  const [playNotes, setPlayNotes] = React.useState(populateNotes());
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useState("");

  const updateFrequencies = (frequency: number, frequencies: number[]) => {
    let noteFound = false;
    frequencies.forEach(currentFrequency => {
      if (Math.abs(frequency - currentFrequency) < threshold) {
        noteFound = true;
      }
    })
    return noteFound;
  }

  const onPlay = (note: SimpleNote) => {
    setCurrentNote((note.n && note.n) || "-");
  }

  const playComplete = () => {
    props.sheetHandler.stopRecordAndPlay();
    setIsButtonDisabled(false);
    setCurrentNote("");
  }

  const startPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.sheetHandler.initialize(updateFrequencies, playComplete, onPlay)
      .then(() => {
        setIsButtonDisabled(true);
        props.sheetHandler.startPlayAndRecord(playNotes, setPlayNotes, muteColor, playColor);
      });
  }

  const resetNotes = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.sheetHandler.stopRecordAndPlay();
    setPlayNotes(populateNotes());
  }

  const stopPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    playComplete();
  }

  const record = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const noteData: NoteData = {
      cX: 100,
      cY: NoteConstant.La5.y,
      color: 'green',
      frequency: NoteConstant.La5.f
    }
    props.sheetHandler.initialize(updateFrequencies, playComplete)
      .then(() => {
        setIsButtonDisabled(true);
        props.sheetHandler.startPlayAndRecord([noteData], setPlayNotes, muteColor, playColor);
      });
  };

  return (
    <div className='sheet-page'>
      Click the 'Start' button to have the first note play and record your instrument on the microphone. You will have to accept the permissions
      to capture audio the first time. The next note will play once you have played the correct note.
      <br /><br /><i>You need to use a headphone to listen to the audio otherwise the microphone will hear the note and move to the next note.</i>
      <Sheet playNotes={playNotes} />
      <div>Current note: {currentNote}.</div>
      <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisabled} />
      <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisabled} />
      <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisabled} />
      <input type='button' value='Record' onClick={record} />

    </div>
  );
}