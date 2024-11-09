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
    if (mainAppLayoutState.showAboutSketch) { // if already showing, hide everything
      setInitSketchAPIRes(null);
      mainAppLayoutState.setP5SketchRef(null);
      mainAppLayoutState.setNavStatusMessage(null);
      mainAppLayoutState.setSelectedVertex(null);
      mainAppLayoutState.setShowAboutSketch(false);
      mainAppLayoutState.setShowAboutSketchText(false);
    } else { // make needed requests and update using response
      await getAboutDetails().then(res => {
        setInitSketchAPIRes(res);
        mainAppLayoutState.setAboutSketchText(res.data.query);
        mainAppLayoutState.setNavStatusMessage(res.data.query.split('::').at(0)!)
      }).finally(() => {
        mainAppLayoutState.setShowWikiverseSketch(false);
        mainAppLayoutState.setShowAboutSketch(true);
        mainAppLayoutState.setShowAboutSketchText(true);
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
          <li id='ftr-item'><a onClick={handleAboutClick}>help</a></li>
        </ul>
      </div>
    </footer>
  );
};