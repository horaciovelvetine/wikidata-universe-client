import './footer.css';
import { FC } from 'react';
import { useConstants } from '../../../app';

const ID = (sufx: string) => `footer-${sufx}`

export const Footer: FC = () => {
  const { _bl, GITHUB_URL, FRONTEND_URL, BACKEND_URL } = useConstants();

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
      </ul>
    </footer>
  );
}