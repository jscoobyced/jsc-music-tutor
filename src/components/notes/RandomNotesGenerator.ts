import { NoteData, Notes2Constant, Notes3Constant, Notes4Constant } from '../../utils/NoteConstants';

export const generateNotes = (startX: number, spaceX: number, color: string) => {
  const notes: NoteData[] = [];
  const all = Notes3Constant.concat(Notes4Constant).concat(Notes2Constant);
  let space = -10;
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      space += 10;
    }
    const note = all[Math.floor(Math.random() * all.length)];
    notes.push({
      cX: space + startX + i * spaceX,
      cY: note.y,
      color,
      name: note.n,
      frequency: note.f
    });
  }
  return notes;
}