import React from 'react';
import { Note } from '../notes/Note';
import { NoteData } from '../../utils/NoteConstants';

export const Sheet = (props: {
  playNotes: NoteData[]
}) => {

  const firstLine = 50;
  const lineSpace = 10;
  const numberOfLines = 5;
  const rX = 6;
  const rY = 4;

  const renderAllNotes = () => {
    return props.playNotes.map((note, index) => {
      const noteData = {
        rX, rY,
        cX: note.cX, cY: note.cY,
        color: note.color,
        duration: note.duration
      }
      return <Note key={'note-' + index} noteData={noteData} lineSpace={lineSpace}
        bY1={firstLine} bY2={firstLine + (numberOfLines - 1) * lineSpace} />
    });
  }

  const generateHorizontalLines = () => {
    let step = 100;
    let lines = [];
    for (let j = 0; j < Math.ceil(props.playNotes.length / 16); j++) {
      for (let i = 0; i < numberOfLines; i++) {
        lines.push(<line key={'line-h-' + j + '-' + i}
          x1='10' y1={firstLine + lineSpace * i + step * j}
          x2='580' y2={firstLine + lineSpace * i + step * j}
          stroke='rgb(0,0,0)' strokeWidth='1' />);
      }

    }
    return lines;
  }

  const generateVerticalLines = () => {
    let step = 100;
    let base = 50;
    let lines: JSX.Element[] = [];
    for (let i = 0; i < Math.ceil(props.playNotes.length / 16); i++) {
      lines = lines.concat(generateYVerticalLines(base + step * i, step * i));
    }
    return lines;
  }

  const generateYVerticalLines = (cY: number, step: number) => {
    let lines = [];
    lines.push(<line key={'line-v-' + cY + '-' + 0}
      x1='11' y1={step + 50} x2='11' y2={step + 90}
      stroke='rgb(0,0,0)' strokeWidth='2' />);
    let start = 0;
    for (let i = 0; i < 4; i++) {
      lines.push(<line key={'line-v-' + cY + '-' + (i + 1)}
        x1={190 + i * start + i * 30} y1={cY}
        x2={190 + i * start + i * 30} y2={cY + 40}
        stroke='rgb(0,0,0)' strokeWidth='1' />);
      start = 100;
    }
    return lines;
  }

  const height = 150 + 100 * Math.floor(props.playNotes.length / 16);

  return (
    <div className='music-sheet'>
      <svg height={height} width='600'>
        <g fill='#000'
          transform='matrix(0.00412361,0,0,-0.00541348,23.104083,105.53238)'>
          <path
            d="m 4105,12786 c -316,-74 -634,-356 -926,-821 -166,-264 -374,-711 -455,-975 -51,-171 -65,-514 -30,-785 41,-324 146,-784 252,-1107 14,-43 24,-84 22,-91 -2,-11 -657,-632 -867,-823 -67,-62 -373,-388 -464,-496 -523,-619 -801,-1286 -869,-2081 -17,-209 9,-484 71,-723 79,-308 232,-622 432,-891 94,-126 346,-378 472,-472 353,-264 725,-419 1167,-488 94,-15 174,-18 435,-17 176,0 358,5 405,11 47,6 87,9 89,7 5,-4 5,-6 71,-909 33,-446 49,-717 45,-765 -22,-283 -73,-486 -170,-680 -108,-215 -282,-377 -482,-449 -98,-36 -356,-86 -522,-102 -123,-12 -184,-4 -216,27 -15,16 -20,81 -7,100 4,5 48,34 97,64 261,155 417,330 470,526 21,76 22,246 2,340 -42,198 -158,385 -310,500 -240,182 -569,203 -824,53 -80,-47 -232,-200 -277,-279 C 1603,1266 1563,1038 1610,854 1654,682 1757,513 1915,355 2171,99 2414,7 2835,6 c 276,-1 444,35 632,133 376,198 619,573 687,1062 33,237 35,211 -74,1051 -55,427 -100,783 -100,791 0,9 21,22 53,32 166,53 569,246 710,338 313,206 582,583 768,1075 80,211 109,361 116,594 10,320 -42,573 -172,844 -317,657 -1011,1060 -1733,1004 -75,-6 -168,-17 -206,-25 -38,-8 -70,-14 -71,-12 -1,1 -12,72 -23,157 -44,320 -142,1026 -147,1057 -5,29 5,43 133,190 806,922 1330,1804 1446,2434 115,621 113,1107 -6,1454 -83,245 -223,429 -426,560 -71,46 -75,47 -165,51 -58,2 -114,-1 -152,-10 z m 221,-586 c 101,-74 167,-237 195,-480 14,-128 6,-430 -16,-580 -16,-110 -50,-247 -65,-265 -5,-6 -23,-51 -41,-100 -69,-196 -214,-443 -383,-655 -135,-167 -294,-336 -602,-636 l -301,-294 -31,128 c -63,254 -75,347 -76,587 -1,360 38,510 246,965 223,486 417,787 682,1059 129,131 321,301 342,301 5,0 28,-13 50,-30 z M 3184,7793 c 15,-115 50,-365 77,-558 27,-192 49,-357 49,-366 0,-10 -23,-23 -67,-39 -102,-35 -263,-115 -361,-179 -481,-317 -769,-804 -812,-1375 -27,-356 77,-655 320,-919 176,-191 460,-360 631,-374 58,-5 72,-3 89,12 36,33 25,49 -62,90 -331,159 -459,342 -487,697 -19,235 18,448 113,643 141,289 389,507 685,604 35,12 65,20 66,19 1,-2 11,-73 23,-158 36,-262 197,-1423 282,-2039 45,-320 79,-585 77,-587 -2,-3 -53,-16 -113,-30 -161,-37 -380,-32 -669,17 -1063,181 -1615,856 -1651,2019 -7,221 6,324 66,502 111,334 360,713 815,1243 150,176 886,985 895,985 3,0 18,-93 34,-207 z m 786,-1728 c 472,-104 832,-475 916,-945 37,-207 7,-666 -60,-910 -68,-248 -170,-425 -343,-591 -129,-124 -292,-225 -474,-293 l -67,-25 -6,42 c -3,23 -26,188 -51,367 -24,179 -108,780 -185,1335 -77,556 -140,1015 -140,1022 0,6 15,14 33,16 64,10 303,-2 377,-18 z"
          />
        </g>

        {generateHorizontalLines()}
        {generateVerticalLines()}
        {renderAllNotes()}
      </svg>
    </div>
  );
}