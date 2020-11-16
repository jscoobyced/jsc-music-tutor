import React from 'react';
import { NoteData } from './NoteConstants';

export const Note = (props: NoteData) => {

  return (
    <ellipse cx={props.cX} cy={props.cY}
      rx={props.rX} ry={props.rY}
      fill={props.color}
      stroke={props.color} strokeWidth='1' />
  );
}