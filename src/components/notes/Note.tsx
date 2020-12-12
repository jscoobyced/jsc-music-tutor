import React from 'react';
import { NoteData } from '../../utils/NoteConstants';

export const Note = (props: {
  noteData: NoteData,
  bY1: number,
  bY2: number,
  lineSpace: number
}) => {

  const bY1 = props.bY1 !== undefined ? props.bY1 : 0;
  const bY2 = props.bY2 !== undefined ? props.bY2 : 1000;

  const addLine = (cY: number, lines: any[] = []): any[] => {
    const newLines = lines;
    if (cY < bY1) {
      if (cY % props.lineSpace === 0) {
        newLines.push(<line key={'note-line-' + lines.length}
          x1={props.noteData.cX - 10} y1={cY}
          x2={props.noteData.cX + 10} y2={cY}
          stroke={props.noteData.color} strokeWidth='1' />);
      }
      return addLine(cY + (props.lineSpace / 2), newLines);
    } else if (cY > bY2) {
      if (cY % props.lineSpace === 0) {
        newLines.push(<line key={'note-line-' + lines.length}
          x1={props.noteData.cX - 10} y1={cY}
          x2={props.noteData.cX + 10} y2={cY}
          stroke={props.noteData.color} strokeWidth='1' />);
      }
      return addLine(cY - (props.lineSpace / 2), newLines);
    } else {
      return newLines;
    }
  }

  const shiftX = props.noteData.cX > 590 ? -520 : 0;
  const shiftY = props.noteData.cX > 590 ? 100 : 0;

  const duration = props.noteData.duration || 1;
  const color = duration >= 2 ? 'white' : props.noteData.color;
  const dot = duration === 1.5 ?
    <line
      x1={props.noteData.cX + 10 + shiftX} y1={props.noteData.cY + shiftY}
      x2={props.noteData.cX + 13 + shiftX} y2={props.noteData.cY + shiftY}
      stroke={props.noteData.color} strokeWidth='3' /> : '';

  const tail = duration === 4 ? '' :
    (props.noteData.cY < 70 ?
      <line
        x1={props.noteData.cX - 7 + shiftX} y1={props.noteData.cY + shiftY}
        x2={props.noteData.cX - 7 + shiftX} y2={props.noteData.cY + 30 + shiftY}
        stroke={props.noteData.color} strokeWidth='2' /> :
      <line
        x1={props.noteData.cX + 7 + shiftX} y1={props.noteData.cY + shiftY}
        x2={props.noteData.cX + 7 + shiftX} y2={props.noteData.cY - 30 + shiftY}
        stroke={props.noteData.color} strokeWidth='2' />);

  const short = props.noteData.duration === 0.5 ?
    (props.noteData.cY < 70 ?
      <line
        x1={props.noteData.cX - 7 + shiftX} y1={props.noteData.cY + 30 + shiftY}
        x2={props.noteData.cX + shiftX} y2={props.noteData.cY + 15 + shiftY}
        stroke={props.noteData.color} strokeWidth='3' /> :
      <line
        x1={props.noteData.cX + 7 + shiftX} y1={props.noteData.cY + shiftY}
        x2={props.noteData.cX + shiftX} y2={props.noteData.cY - 15 + shiftY}
        stroke={props.noteData.color} strokeWidth='1' />
    ) : '';

  return (
    <>
      <ellipse cx={props.noteData.cX + shiftX} cy={props.noteData.cY + shiftY}
        rx={props.noteData.rX} ry={props.noteData.rY}
        fill={color}
        stroke={props.noteData.color} strokeWidth='2' />
      {addLine(props.noteData.cY)}
      {tail}
      {dot}
      {short}
    </>
  );
}