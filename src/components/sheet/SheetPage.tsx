import React from 'react';
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
  const playColor = 'red';

  const populateNotes = () => generateNotes(startX, spaceX, muteColor);

  const [playNotes, setPlayNotes] = React.useState(populateNotes());
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const startPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsButtonDisabled(true);
    props.sheetHandler.startPlayAndRecord(playNotes, setPlayNotes, muteColor, playColor);
  }

  const resetNotes = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.sheetHandler.stopRecordAndPlay();
    setPlayNotes(populateNotes());
  }

  const stopPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.sheetHandler.stopRecordAndPlay();
    setIsButtonDisabled(false);
  }



  const record = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.sheetHandler.startRecording(440);
  };

  return (
    <div className='sheet-page'>
      Click the 'Start' button to start listening for your audio <sup
        className='tooltip-info'
        title='You will have to accept the permissions to capture audio.'>(?)</sup> then play the notes as they display.
      <Sheet playNotes={playNotes} />
      <div>Current frequency: <span id='frequency'></span>.</div>
      <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisabled} />
      <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisabled} />
      <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisabled} />
      <input type='button' value='Record' onClick={record} />

    </div>
  );
}