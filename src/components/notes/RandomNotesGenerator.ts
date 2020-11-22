import { NoteData, Notes5Constant, Notes6Constant } from './NoteConstants';

export const generateNotes = (startX: number, spaceX: number, color: string) => {
  const notes: NoteData[] = [];
  const all = Notes5Constant.concat(Notes6Constant);
  let space = -10;
  for (let i = 0; i < 4; i++) {
    if (i % 4 === 0) {
      space += 10;
    }
    const note = all[Math.floor(Math.random() * all.length)];
    notes.push({
      cX: space + startX + i * spaceX,
      cY: note.y,
      color,
      frequency: note.f
    });
  }
  return notes;
}