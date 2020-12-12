import { NoteConstant, SimpleNote } from '../../utils/NoteConstants';
import { generateSong } from './SongUtil';

export const generateNotes = (startX: number, spaceX: number, color: string) => {
  const all: SimpleNote[] = [
    NoteConstant.Mi4,
    NoteConstant.Re4,
    NoteConstant.Do4,
    NoteConstant.Re4,
    NoteConstant.Mi4,
    NoteConstant.Mi4,
    NoteConstant.Mi4,
    NoteConstant.Re4,
    NoteConstant.Re4,
    NoteConstant.Re4,
    NoteConstant.Mi4,
    NoteConstant.Sol4,
    NoteConstant.Sol4,
    NoteConstant.Mi4,
    NoteConstant.Re4,
    NoteConstant.Do4,
    NoteConstant.Re4,
    NoteConstant.Mi4,
    NoteConstant.Mi4,
    NoteConstant.Mi4,
    NoteConstant.Mi4,
    NoteConstant.Re4,
    NoteConstant.Re4,
    NoteConstant.Mi4,
    NoteConstant.Re4,
    NoteConstant.Do4,
  ];
  const durations = [
    1.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2,
    1.5, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4
  ];
  return generateSong(all, durations, startX, spaceX, color);
}