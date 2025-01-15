import './incompatible-screen-size-notice.css'
import { createRef, FC, useEffect } from 'react'
import { useConstants, useWikiverseService } from '../../../app';
import { useDeviceCompatabilityCheck } from '../../../app/contexts/device-compatability-provider';
import { showHideIncompatibleScreenNotice } from '../animations/show-hide-incompatible-screen-notice';

const ID = (sufx: string) => `incompat-screen-notice-${sufx}`

export const IncompatibleScreenSizeNotice: FC = () => {
  const { isOnline } = useWikiverseService()
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const { _bl, GITHUB_URL, MAILTO_URL } = useConstants();

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