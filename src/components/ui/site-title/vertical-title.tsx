import './vertical-title.css'

/**
 * For larger screens//positioned in grid position 4
 */
const ID = (sufx: string) => `vertical-title-${sufx}`
export const VerticalTitle = () => {
  return (
    <div id={'cont'}>
      <h1 id={ID('text')}>wikiverse</h1>
    </div>
  );
}