import './incompatible-screen-size-notice.css'
import { createRef, useEffect } from 'react'
import { showHideIncompatibleScreenNotice } from '../animations/show-hide-incompatible-screen-notice';
import { useDeviceCompatabilityCheck, useWikiverseService } from '../../../contexts';
import { GITHUB_URL, _bl, MAILTO_URL } from '../../../app';

const ID = (sufx: string) => `incompat-screen-notice-${sufx}`

export const IncompatibleScreenSizeNotice = () => {
  const { isOnline } = useWikiverseService()
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();

  const ContainerRef = createRef<HTMLDivElement>()

  useEffect(() => {
    const show = !meetsMinScreenSizeReq
    if (isOnline && show) { // show
      showHideIncompatibleScreenNotice(ContainerRef, show)
    } else {
      showHideIncompatibleScreenNotice(ContainerRef, false);
    }
  }, [meetsMinScreenSizeReq, isOnline, ContainerRef])

  return (
    <div id={ID('container')} ref={ContainerRef}>
      <div id={ID('layout')}>
        <h1 id={ID('title')}>Incompatible Device</h1>
        <p id={ID('main-text')}>the Wikiverse is currently only compatible with certain devices and your current device may not work as intended. Devices with a larger screen and access to a mouse make exploring data a lot more fun and are recommended!</p>
        <p id={ID('link-text')}>More details about the Wikiverse can be found on <a id={ID('frontend-link')} className={ID('link')} href={GITHUB_URL} target={_bl}>github</a>, or by <a id={ID('email-link')} href={MAILTO_URL} className={ID('link')}>emailing @horaciovelvetine</a></p>
      </div>
    </div >
  )
}