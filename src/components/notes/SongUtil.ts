import { NoteData, SimpleNote } from '../../utils/NoteConstants';

export const generateSong = (all: SimpleNote[],
  durations: number[],
  startX: number, spaceX: number, color: string) => {
  const notes: NoteData[] = [];

  let space = -10;
  let total = 0;
  for (let i = 0; i < all.length; i++) {
    if (total % 4 === 0) {
      space += 10;
    }
    const note = all[i];
    const cX = space + startX + total * spaceX;
    total += durations[i];
    notes.push({
      cX,
      cY: note.y,
      color,
      duration: durations[i],
      name: note.n,
      frequency: note.f
    });
  }
  return notes;
}