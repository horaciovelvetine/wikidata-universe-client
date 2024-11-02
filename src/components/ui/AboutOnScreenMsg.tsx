import './AboutOnScreenMsg.css'

import { FC, useEffect } from 'react';

import { RequestResponse } from '../../api';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';

const prfx = (sufx: string) => {
  return `about-${sufx}`;
}

// const AllAbout = {
//   1: {
//     mainTxt: 'This is a Vertex - it represents an Item (document technically) from Wikipedia, a simple floating in the Wikiverse (3D space).',
//     slides: null
//   },
//   2: {
//     mainTxt: 'A Vertex can represent just about anything you might be able to think of...',
//     slides: {
//       1: { txt: 'The Moon', url: 'https://en.wikipedia.org/wiki/Moon' },
//       2: { txt: 'World Peace', url: 'https://en.wikipedia.org/wiki/World_peace' },
//       3: { txt: 'or even...Kevin Bacon', url: 'https://en.wikipedia.org/wiki/Kevin_Bacon' }
//     },
//   },
//   3: {
//     mainTxt: 'Vertices inside of Wikipedia are connected to one another with Statements, and in the Wikiverse these are represented as Edges.',
//     slides: {
//       1: { txt: 'Edges describe the way in which 2 Vertices are related including: a source, a target, and a Property.' }
//     }
//   },
//   4: {
//     mainTxt: 'For example: Kevin Bacon is (employed) as an Actor.',
//     slides: {
//       1: { txt: 'The source (Vertex) - Kevin Bacon' },
//       2: { txt: 'The target (Vertex) - Actor' },
//       3: { txt: 'The Property is "Occupation"... technically' },
//       4: { txt: 'but I couldnt figure out how to make that grammar work in the example' }
//     }
//   },
//   5: {
//     mainTxt: `By selecting a Vertex Edges can be given a direction: incoming, or outgoing.`,
//     slides: {
//       1: { txt: `Outgoing Edges are pictured in RED` },
//       2: { txt: 'Incoming Edges are pictured in BLUE' },
//       3: { txt: 'often times two Edges share Endpoints and Properties, existing in paralell' },
//       4: { txt: 'so Paralell Edges are pictured in PURPLE' }
//     }
//   },
//   6: {
//     mainTxt: `Inside the Wikiverse as you click on Vertices, the universe builds itself by fetching related Vertices and placing them around you`,
//     slides: {
//       1: { txt: `Each new Vertex is pulled closer to Vertices where it shares Edges...` },
//       2: { txt: `and pushed away from any Vertex where it doesn't.` },
//       3: { txt: `Once a Vertex is positioned in the Wikiverse it stays locked there` },
//       // 4: { txt: `Unless you move it, with the Refresh Layout button` }
//     }
//   },
// };

interface AboutOnScreenMsgProps {
  mainAppLayoutState: MainAppLayoutState,
  initSketchAPIRes: RequestResponse | null
}

export const AboutOnScreenMsg: FC<AboutOnScreenMsgProps> = ({ initSketchAPIRes }) => {
  const msg = initSketchAPIRes?.data.query

  useEffect(() => { }, [])

  return (
    <div id={prfx('display')}>
      <div>
        <p id={prfx('main-text-body')}>{msg}</p>
      </div>
    </div>
  );
};