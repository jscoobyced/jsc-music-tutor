
export interface NoteData {
  cX: number;
  cY: number;
  rX?: number;
  rY?: number;
  color: string;
  frequency?: number;
  name?: string;
  soundFile?: string;
}

export interface SimpleNote {
  y: number,
  f: number,
  n: string
}

export const NoteConstant = {
  Do5: {
    y: 100,
    f: 523,
    n: "C5"
  },
  Re5: {
    y: 95,
    f: 587,
    n: "D5"
  },
  Mi5: {
    y: 90,
    f: 659,
    n: "E5"
  },
  Fa5: {
    y: 85,
    f: 698,
    n: "F5"
  },
  Sol5: {
    y: 80,
    f: 784,
    n: "G5"
  },
  La5: {
    y: 75,
    f: 880,
    n: "A5"
  },
  Si5: {
    y: 70,
    f: 988,
    n: "B5"
  },
  Do6: {
    y: 65,
    f: 1046,
    n: "C6"
  },
  Re6: {
    y: 60,
    f: 1175,
    n: "D6"
  },
  Mi6: {
    y: 55,
    f: 1319,
    n: "E6"
  },
  Fa6: {
    y: 50,
    f: 1397,
    n: "F6"
  },
  Sol6: {
    y: 45,
    f: 1568,
    n: "G6"
  },
  La6: {
    y: 40,
    f: 1760,
    n: "A6"
  },
  Si6: {
    y: 35,
    f: 1976,
    n: "B6"
  },
  None: {
    y: 0,
    f: 0,
    n: "None"
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