import '../styles/components/RelatedLinksInfobox.css';
import { IApiStatus } from "../interfaces";

interface FooterProps {
  apiStatus: IApiStatus;
}

export const Footer: React.FC<FooterProps> = ({ apiStatus }) => {
  const githubUrl = "https://github.com/horaciovelvetine";
  const frontendUrl = "https://github.com/horaciovelvetine";
  const backendUrl = "https://github.com/horaciovelvetine";

  return (
    <>
      <div id="related-links-container">
        <ul id="related-links-list">
          <li id="related-link">Github: <a href={frontendUrl}>Frontend</a> | <a href={backendUrl}>Backend</a></li>
          <li id="related-link">©2024 by <a href={githubUrl}>@horaciovelvetine</a></li>
          <li id="status-link">API Status: <i>{apiStatus.status}</i> {apiStatus.message}</li>
        </ul>
      </div>
    </>
  );
};