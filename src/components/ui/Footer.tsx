import { getAboutData, RequestResponse } from '../../api';
import './Footer.css';
import { Dispatch, FC, SetStateAction } from 'react';

interface FooterProps {
  setShowAboutSketch: Dispatch<SetStateAction<boolean>>;
  setInitSketchAPIRes: Dispatch<SetStateAction<RequestResponse | null>>
}

export const Footer: FC<FooterProps> = ({ setShowAboutSketch, setInitSketchAPIRes }) => {
  const bl = "_blank";
  const githubUrl = "https://github.com/horaciovelvetine";
  const frontendUrl = githubUrl + "/wikidata-universe-client";
  const backendUrl = githubUrl + "/wikidata-universe-api";

  const handleAboutClick = async () => {
    let prevState
    setShowAboutSketch(prev => {
      prevState = prev;
      return !prev
    })

    if (!prevState) {
      await getAboutData().then(res => {
        setInitSketchAPIRes(res);
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