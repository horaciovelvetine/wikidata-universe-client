import './vertical-title.css'
import { FC } from "react"

/**
 * For larger screens//positioned in grid position 4
 */
const ID = (sufx: string) => `vertical-title-${sufx}`
export const VerticalTitle: FC = () => {
  return (
    <div id={'cont'}>
      <h1 id={ID('text')}>wikiverse</h1>
    </div>
  );
}