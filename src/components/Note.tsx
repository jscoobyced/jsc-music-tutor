import React from 'react';

export interface NoteProps {
  cX: number;
  cY: number;
  color: string;
}

export const NoteConstant = {
  rX: 6,
  rY: 4,
  Do5: {
    y: 100,
    f: 523
  },
  Re5: {
    y: 95,
    f: 587
  },
  Mi5: {
    y: 90,
    f: 659
  },
  Fa5: {
    y: 85,
    f: 698
  },
  Sol5: {
    y: 80,
    f: 784
  },
  La5: {
    y: 75,
    f: 880
  },
  Si5: {
    y: 70,
    f: 988
  },
  Do6: {
    y: 65,
    f: 1046
  },
  Re6: {
    y: 60,
    f: 1175
  },
  Mi6: {
    y: 55,
    f: 1319
  },
  Fa6: {
    y: 50,
    f: 1397
  },
  Sol6: {
    y: 45,
    f: 1568
  },
  La6: {
    y: 40,
    f: 1760
  },
  Si6: {
    y: 35,
    f: 1976
  }
}

export const Notes5Constant = [NoteConstant.Do5,
NoteConstant.Re5, NoteConstant.Mi5, NoteConstant.Fa5,
NoteConstant.Sol5, NoteConstant.La5,
NoteConstant.Si5];

export const Notes6Constant = [NoteConstant.Do6,
NoteConstant.Re6, NoteConstant.Mi6, NoteConstant.Fa6,
NoteConstant.Sol6, NoteConstant.La6,
NoteConstant.Si6];

export const Note = (props: NoteProps) => {

  return (
    <ellipse cx={props.cX} cy={props.cY}
      rx={NoteConstant.rX} ry={NoteConstant.rY}
      fill={props.color}
      stroke={props.color} strokeWidth='1' />
  );
}