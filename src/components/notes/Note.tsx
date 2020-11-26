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

  return (
    <>
      <ellipse cx={props.noteData.cX} cy={props.noteData.cY}
        rx={props.noteData.rX} ry={props.noteData.rY}
        fill={props.noteData.color}
        stroke={props.noteData.color} strokeWidth='1' />
      {addLine(props.noteData.cY)}
    </>
  );
}