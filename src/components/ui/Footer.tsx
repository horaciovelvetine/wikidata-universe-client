import './Footer.css';
import { FC } from 'react';

export const Footer: FC = () => {
  const bl = "_blank";
  const githubUrl = "https://github.com/horaciovelvetine";
  const frontendUrl = githubUrl + "/wikidata-universe-client";
  const backendUrl = githubUrl + "/wikidata-universe-api";
  const learnMoreUrl = githubUrl + "/ForceDrawnGraphs";

  return (
    <footer>
      <div id='container'>
        <ul id='list'>
          <li id='ftr-item'>github{" "}
            <a href={frontendUrl} target={bl}>frontend</a>{" "}/{" "}
            <a href={backendUrl} target={bl}>backend</a>
          </li>
          <li id='ftr-item'>©2024 by <a href={githubUrl} target={bl}>@horaciovelvetine</a></li>
          <li id='ftr-item'>about <a href={learnMoreUrl} target={bl}>wikiverse</a></li>
        </ul>
      </div>
    </footer>
  );
};