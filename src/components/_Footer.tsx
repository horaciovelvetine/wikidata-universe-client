import '../styles/components/Footer.css';
import { IApiStatus } from "../interfaces";

interface FooterProps {
  apiStatus: IApiStatus;
}

export const Footer: React.FC<FooterProps> = ({ apiStatus }) => {
  const githubUrl = "https://github.com/horaciovelvetine";
  const frontendUrl = githubUrl + "/wikidata-universe-client";
  const backendUrl = githubUrl + "/wikidata-universe-api";
  const learnMoreUrl = githubUrl + "/ForceDrawnGraphs"

  return (
    <>
      <div id="related-links-container">
        <ul id="related-links-list">
          <li id="related-link">Github: <a href={frontendUrl}>Frontend</a> | <a href={backendUrl}>Backend</a></li>
          <li id="related-link">©2024 by <a href={githubUrl}>@horaciovelvetine</a></li>
          <li id="related-link">About <a href={learnMoreUrl}>Wikiverse</a></li>
        </ul>
      </div>
    </>
  );
};