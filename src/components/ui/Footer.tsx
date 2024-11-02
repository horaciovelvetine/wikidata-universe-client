import { getAboutDetails, RequestResponse } from '../../api';
import { MainAppLayoutState } from '../../app/MainAppLayoutState';
import './Footer.css';
import { Dispatch, FC, SetStateAction } from 'react';

interface FooterProps {
  mainAppLayoutState: MainAppLayoutState;
  setInitSketchAPIRes: Dispatch<SetStateAction<RequestResponse | null>>
}

export const Footer: FC<FooterProps> = ({ mainAppLayoutState, setInitSketchAPIRes }) => {
  const bl = "_blank";
  const githubUrl = "https://github.com/horaciovelvetine";
  const frontendUrl = githubUrl + "/wikidata-universe-client";
  const backendUrl = githubUrl + "/wikidata-universe-api";

  const handleAboutClick = async () => {
    if (mainAppLayoutState.showAboutSketch) {
      mainAppLayoutState.setP5SketchRef(null);
      setInitSketchAPIRes(null);
      mainAppLayoutState.setSelectedVertex(null);
      mainAppLayoutState.setShowAboutSketch(false);
    } else {
      await getAboutDetails().then(res => {
        setInitSketchAPIRes(res);
      }).finally(() => {
        mainAppLayoutState.setShowAboutSketch(true);
      })
    }
  }

  return (
    <footer>
      <div id='container'>
        <ul id='list'>
          <li id='ftr-item'>
            <a href={frontendUrl} target={bl}>frontend</a>{" "}/{" "}
            <a href={backendUrl} target={bl}>backend</a>
          </li>
          <li id='ftr-item'>©2024 by <a href={githubUrl} target={bl}>@horaciovelvetine</a></li>
          <li id='ftr-item'>about <a onClick={handleAboutClick}>wikiverse</a></li>
        </ul>
      </div>
    </footer>
  );
};