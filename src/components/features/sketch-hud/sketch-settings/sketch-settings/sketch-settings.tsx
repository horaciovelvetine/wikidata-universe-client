import './sketch-settings.css'
import { createRef, FC, useEffect, useState } from 'react'

import { Settings } from '../../../../../assets/icons'
import { showHideSettingsMenu } from '../../../animations/show-hide-settings-menu'
import { BehaviorSettings, LayoutSettings, MouseSettings, OnScreenSettings } from '..'
import { WikiverseSketch } from '../../../../../types'
import { UnfocusClickToCloseWrapper } from '../hooks/use-unfocus-click-to-close-wrapper';

interface SketchSettingsProps {
  sketchRef: WikiverseSketch;
}

const ID = (sufx: string) => `sketch-settings-${sufx}`

export const SketchSettings: FC<SketchSettingsProps> = ({ sketchRef }) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(sketchRef.state.showSketchSettings());

  const menuDisplayRef = createRef<HTMLDivElement>();

  useEffect(() => { // tell sketch how to let React know settings menu is open...
    sketchRef.state.addshowSketchsettingsSubscriber(setShowSettingsMenu);
  })

  useEffect(() => {
    showHideSettingsMenu(menuDisplayRef, showSettingsMenu)
  }, [showSettingsMenu, menuDisplayRef])

  const handleGearIconClick = () => {
    sketchRef.state.toggleShowSketchSettings();
  }

  const handleUnfocusClick = () => {
    if (showSettingsMenu) {
      sketchRef.state.toggleShowSketchSettings();
    }
  }


  return (
    <div id={ID('container')}>
      <UnfocusClickToCloseWrapper onOutsideClickCallback={handleUnfocusClick}>
        <div id={ID('icon-container')}>
          {/* <img id={ID('refresh-icon')} src={Fetch} onClick={handleRefreshClick} /> */}
          <img id={ID('gear-icon')} src={Settings} onClick={handleGearIconClick} />
        </div>
        <div id={ID('menu-display')} ref={menuDisplayRef} onWheel={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
          <div id={ID('menu-layout-container')}>
            <div id={ID('split-col-layout')}>
              <OnScreenSettings {...{ sketchRef }} />
              <MouseSettings {...{ sketchRef }} />
            </div>
            <BehaviorSettings {...{ sketchRef }} />

            <LayoutSettings {...{ sketchRef }} />
          </div>
        </div>
      </UnfocusClickToCloseWrapper >
    </div >
  )
}