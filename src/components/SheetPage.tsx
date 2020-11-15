import React from 'react';
import Player from '../Player';
import { Notes5Constant, Notes6Constant, Note } from './Note';
import './SheetPage.scss';

interface NoteData {
  cX: number;
  cY: number;
  color: string;
  frequency: number;
}

export const SheetPage = () => {

  const startX = 60;
  const spaceX = 30;
  const muteColor = 'black';
  const playColor = 'red';

  const generateNotes = () => {
    const notes: NoteData[] = [];
    const all = Notes5Constant.concat(Notes6Constant);
    let space = -10;
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        space += 10;
      }
      const note = all[Math.floor(Math.random() * all.length)];
      notes.push({
        cX: space + startX + i * spaceX,
        cY: note.y,
        color: muteColor,
        frequency: note.f
      });
    }
    return notes;
  }

  const [playNotes, setPlayNotes] = React.useState(generateNotes);
  const [isButtonDisable, setIsButtonDisable] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState(new Player());

  const startPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    currentPlayer.initialize();
    setIsButtonDisable(true);
    playNext(0);
  }

  const resetNotes = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setPlayNotes(generateNotes());
  }

  const stopPlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsButtonDisable(false);
    currentPlayer.stopPlaying();
  }

  const playNext = (noteCount: number) => {
    let frequency = 0;
    const newNotes = playNotes.map((note, index) => {
      if (index === noteCount) {
        frequency = note.frequency;
        return {
          cX: note.cX,
          cY: note.cY,
          color: playColor,
          frequency: note.frequency
        }
      } else return {
        cX: note.cX,
        cY: note.cY,
        color: muteColor,
        frequency: note.frequency
      }
    });
    setPlayNotes(newNotes);
    if (frequency > 0 && currentPlayer.isPlaying()) {
      currentPlayer.playNote(frequency, 1);
    }
    if (noteCount < playNotes.length && currentPlayer.isPlaying()) {
      setTimeout(() => playNext(noteCount + 1), 1000);
    } else {
      setIsButtonDisable(false);
    }
  }

  const renderAllNotes = () => {
    return playNotes.map((note, index) => {
      return <Note key={'note-' + index} cX={note.cX} cY={note.cY} color={note.color} />
    });
  }

  return (
    <div className='sheet-page'>
      Click the 'Start' button to start listening for your audio <sup
        className='tooltip-info'
        title='You will have to accept the permissions to capture audio.'>(?)</sup> then play the notes as they display.
      <div className='music-sheet'>
        <svg height='150' width='580'>
          <g fill='#000'
            transform='matrix(0.00412361,0,0,-0.00541348,23.104083,105.53238)'>
            <path
              d="m 4105,12786 c -316,-74 -634,-356 -926,-821 -166,-264 -374,-711 -455,-975 -51,-171 -65,-514 -30,-785 41,-324 146,-784 252,-1107 14,-43 24,-84 22,-91 -2,-11 -657,-632 -867,-823 -67,-62 -373,-388 -464,-496 -523,-619 -801,-1286 -869,-2081 -17,-209 9,-484 71,-723 79,-308 232,-622 432,-891 94,-126 346,-378 472,-472 353,-264 725,-419 1167,-488 94,-15 174,-18 435,-17 176,0 358,5 405,11 47,6 87,9 89,7 5,-4 5,-6 71,-909 33,-446 49,-717 45,-765 -22,-283 -73,-486 -170,-680 -108,-215 -282,-377 -482,-449 -98,-36 -356,-86 -522,-102 -123,-12 -184,-4 -216,27 -15,16 -20,81 -7,100 4,5 48,34 97,64 261,155 417,330 470,526 21,76 22,246 2,340 -42,198 -158,385 -310,500 -240,182 -569,203 -824,53 -80,-47 -232,-200 -277,-279 C 1603,1266 1563,1038 1610,854 1654,682 1757,513 1915,355 2171,99 2414,7 2835,6 c 276,-1 444,35 632,133 376,198 619,573 687,1062 33,237 35,211 -74,1051 -55,427 -100,783 -100,791 0,9 21,22 53,32 166,53 569,246 710,338 313,206 582,583 768,1075 80,211 109,361 116,594 10,320 -42,573 -172,844 -317,657 -1011,1060 -1733,1004 -75,-6 -168,-17 -206,-25 -38,-8 -70,-14 -71,-12 -1,1 -12,72 -23,157 -44,320 -142,1026 -147,1057 -5,29 5,43 133,190 806,922 1330,1804 1446,2434 115,621 113,1107 -6,1454 -83,245 -223,429 -426,560 -71,46 -75,47 -165,51 -58,2 -114,-1 -152,-10 z m 221,-586 c 101,-74 167,-237 195,-480 14,-128 6,-430 -16,-580 -16,-110 -50,-247 -65,-265 -5,-6 -23,-51 -41,-100 -69,-196 -214,-443 -383,-655 -135,-167 -294,-336 -602,-636 l -301,-294 -31,128 c -63,254 -75,347 -76,587 -1,360 38,510 246,965 223,486 417,787 682,1059 129,131 321,301 342,301 5,0 28,-13 50,-30 z M 3184,7793 c 15,-115 50,-365 77,-558 27,-192 49,-357 49,-366 0,-10 -23,-23 -67,-39 -102,-35 -263,-115 -361,-179 -481,-317 -769,-804 -812,-1375 -27,-356 77,-655 320,-919 176,-191 460,-360 631,-374 58,-5 72,-3 89,12 36,33 25,49 -62,90 -331,159 -459,342 -487,697 -19,235 18,448 113,643 141,289 389,507 685,604 35,12 65,20 66,19 1,-2 11,-73 23,-158 36,-262 197,-1423 282,-2039 45,-320 79,-585 77,-587 -2,-3 -53,-16 -113,-30 -161,-37 -380,-32 -669,17 -1063,181 -1615,856 -1651,2019 -7,221 6,324 66,502 111,334 360,713 815,1243 150,176 886,985 895,985 3,0 18,-93 34,-207 z m 786,-1728 c 472,-104 832,-475 916,-945 37,-207 7,-666 -60,-910 -68,-248 -170,-425 -343,-591 -129,-124 -292,-225 -474,-293 l -67,-25 -6,42 c -3,23 -26,188 -51,367 -24,179 -108,780 -185,1335 -77,556 -140,1015 -140,1022 0,6 15,14 33,16 64,10 303,-2 377,-18 z"
            />
          </g>
          <line x1='10' y1='50' x2='560' y2='50' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='10' y1='60' x2='560' y2='60' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='10' y1='70' x2='560' y2='70' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='10' y1='80' x2='560' y2='80' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='10' y1='90' x2='560' y2='90' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='11' y1='50' x2='11' y2='90' stroke='rgb(0,0,0)' strokeWidth='2' />
          <line x1='12' y1='50' x2='12' y2='90' stroke='rgb(0,0,0)' strokeWidth='2' />
          <line x1='15' y1='50' x2='15' y2='90' stroke='rgb(0,0,0)' strokeWidth='2' />
          <line x1='170' y1='50' x2='170' y2='90' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='300' y1='50' x2='300' y2='90' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='430' y1='50' x2='430' y2='90' stroke='rgb(0,0,0)' strokeWidth='1' />
          <line x1='560' y1='50' x2='560' y2='90' stroke='rgb(0,0,0)' strokeWidth='1' />
          {renderAllNotes()}
        </svg>
        <input type='button' value='New' onClick={resetNotes} disabled={isButtonDisable} />
        <input type='button' value='Start' onClick={startPlay} disabled={isButtonDisable} />
        <input type='button' value='Stop' onClick={stopPlay} disabled={!isButtonDisable} />
      </div>
    </div>
  );
}