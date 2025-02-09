import './footer.css';
import { Dispatch, FC, SetStateAction } from 'react';
import { useConstants, useWikiverseService, WikiverseServiceResponse } from '../../../app';

interface FooterProps {
  setIsTutorialSketch: Dispatch<SetStateAction<boolean>>;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

const ID = (sufx: string) => `footer-${sufx}`

export const Footer: FC<FooterProps> = ({ setIsTutorialSketch, setInitSketchData }) => {
  const { _bl, GITHUB_URL, FRONTEND_URL, BACKEND_URL } = useConstants();
  const { getTutorial } = useWikiverseService();

  const handleTutorialClick = async () => {
    /**
     //TODO: vett parallel updates doesnt cause adverse side effect
     * @todo - parallel updates of state w/ memoized state possible err source
     * @check - in search click on tutorial
     * @check - landing page clicks on tutorial
     * @check - offline clicks on tutorial
     */
    setIsTutorialSketch(prev => !prev);
    setInitSketchData(await getTutorial('1'));
  }

  return (
    <footer id={ID('main')}>
      <ul id={ID('contents-list')}>
        <li className='footer-list-content' id={ID('repo-links')}>
          <a href={FRONTEND_URL} target={_bl}>frontend</a>{" "}/{" "}
          <a href={BACKEND_URL} target={_bl}>backend</a>
        </li>
        <li className='footer-list-content' id={ID('copy-statement')}>
          ©2024 by <a href={GITHUB_URL} target={_bl}> @horaciovelvetine</a>
        </li>
        <li className='footer-list-content' id={ID('tutorial-container')}>
          <a id={ID('tutorial-link')} onClick={handleTutorialClick}>Click</a> for a tutorial
        </li>
      </ul>
    </footer>
  );
}