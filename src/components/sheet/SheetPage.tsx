import React from 'react';
import { SimpleNote } from '../../utils/NoteConstants';
import { generateNotes as generateRandomNotes } from '../notes/RandomNotesGenerator';
import { generateNotes as generateMaryNotes } from '../notes/MaryLamb';
import { Sheet } from './Sheet';
import SheetHandler from './SheetHandler';
import './SheetPage.scss';
import { SheetSelector } from './SongSelector';

export const SheetPage = (props: {
  sheetHandler: SheetHandler
}) => {

  const startX = 80;
  const spaceX = 30;
  const muteColor = 'black';
  const playColor = 'green';

  const populateNotes = (music: string) => {
    if (music === 'mary') {
      return generateMaryNotes(startX, spaceX, muteColor);
    } else {
      return generateRandomNotes(startX, spaceX, muteColor);
    }
  }

  const [playNotes, setPlayNotes] = React.useState(populateNotes(''));
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [currentNote, setCurrentNote] = React.useState("");
  const [playedNote, setPlayedNote] = React.useState("");
  const [noteGenerator, setNoteGenerator] = React.useState('random');
  const [congratulations, setCongratulations] = React.useState("");

  const updateNote = (expectedNote: string, currentNote: string) => {
    setPlayedNote(currentNote);
    return expectedNote === currentNote;
  }

  const onPlay = (note: SimpleNote) => {
    setCurrentNote((note.n && note.n) || "-");
  }

  const playComplete = (isComplete: boolean) => {
    props.sheetHandler.stopRecordAndPlay();
    setIsButtonDisabled(false);
    setCurrentNote("");
    setPlayedNote("");
    playNotes.forEach(note => note.color = muteColor);
    setPlayNotes(playNotes);
    if (isComplete) {
      setCongratulations('Well done!');
    }
  }

  const startPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setCongratulations('');
    props.sheetHandler.initialize(updateNote, playComplete, onPlay)
      .then(() => {
        setIsButtonDisabled(true);
        props.sheetHandler.startPlayAndRecord(playNotes, setPlayNotes, muteColor, playColor);
      });
  }

  const resetNotes = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updatePartition(noteGenerator);
  }

  const updatePartition = (music: string) => {
    props.sheetHandler.stopRecordAndPlay();
    setPlayNotes(populateNotes(music));
  }

  const stopPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    playComplete(false);
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setNoteGenerator(event.target.value);
    updatePartition(event.target.value);
  }

  return (
    <div className='sheet-page'>
      Click the 'Start' button to have the first note play and record your instrument on the microphone. You will have to accept the permissions
      to capture audio the first time. The next note will play once you have played the correct note.
      <br /><br /><i>Be mindeful of surrounding noise. I recommend using a microphone for the guitar.</i>
      <Sheet playNotes={playNotes} />
      <SheetSelector onChange={onChange} />
      <div className='play-complete'>{congratulations}</div>
      <div className='display-notes'>Current note: {currentNote}</div>
      <div className='display-notes'>Played note: {playedNote}</div>
      <div className='action-buttons'>
        <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisabled} />
        <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisabled} />
        <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisabled} />
      </div>

    </div>
  );
}