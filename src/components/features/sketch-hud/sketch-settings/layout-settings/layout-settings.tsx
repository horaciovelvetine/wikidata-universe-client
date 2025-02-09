import { Fetch } from '../../../../../assets/icons';
import { useWikiverseService } from '../../../../../contexts';
import { P5Sketch } from '../../../../../types';
import './layout-settings.css'
import { ChangeEvent, useState } from "react"

interface LayoutSettingsProps {
  sketchRef: P5Sketch;
}

const ID = (sufx: string) => `layout-settings-${sufx}`;

export const LayoutSettings = ({ sketchRef }: LayoutSettingsProps) => {
  const { post } = useWikiverseService()
  const [attractionMultRef, setAttractionMultRef] = useState(sketchRef.state.attractionMult());
  const [repulsionMultRef, setRepulsionMultRef] = useState(sketchRef.state.repulsionMult());
  const [dataDensityRef, setDataDensityRef] = useState(sketchRef.state.dataDensity());

  const handleDensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val >= 0 && val <= 1) {
      setDataDensityRef(val);
      sketchRef.state.setDataDensity(val);
    }
  }

  const handleAttrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val >= 0 && val <= 5) {
      setAttractionMultRef(val)
      sketchRef.state.setAttractionMult(val);
    }
  }

  const handleRepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val >= 0 && val <= 5) {
      setRepulsionMultRef(val);
      sketchRef.state.setRepulsionMult(val);
    }
  }

  const handleRefreshLayoutRequest = () => {
    sketchRef.refreshLayoutPositions(post);
  }

  return (
    <fieldset id={ID('container')}>
      <legend>
        <h4 id={ID('title')}>layout</h4>
      </legend>
      <ul id={ID('list')}>
        <LayoutSettingOption
          key='attr-force-layout-setting'
          lbl='Attraction Force'
          dsc='The tendency of related topics to clump together'
          val={attractionMultRef}
          min={0}
          max={5}
          step={0.05}
          handler={handleAttrChange} />

        <LayoutSettingOption
          key='rep-force-layout-setting'
          lbl='Repulsion Force'
          dsc='The tendency of un-related topics to push away from one another'
          val={repulsionMultRef}
          min={0}
          max={5}
          step={0.05}
          handler={handleRepChange} />

        <LayoutSettingOption
          key='data-dens-layout-setting'
          lbl='Density'
          dsc='Effects the overall size of the Wikiverse'
          val={dataDensityRef}
          min={0}
          max={1}
          step={0.0001}
          handler={handleDensityChange} />
        <hr />
        <li id={'refresh-layout-option'}>
          <div className={ID('option-text')} id={'refresh-layout-text-container'}>
            <label>Refresh Layout</label>
            <p>Re-positions the current set of topics and edges to optimize overall search shape (experimental)</p>
          </div>
          <button id={'refresh-layout-button'} onClick={handleRefreshLayoutRequest}>
            <img src={Fetch} id={'refresh-layout-icon'} />
          </button>
        </li>
      </ul>
    </fieldset>
  )
}

interface LayoutSettingOptionProps {
  lbl: string;
  dsc: string;
  val: number | undefined;
  min: number;
  max: number;
  step: number;
  handler: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LayoutSettingOption = ({ lbl, dsc, val, min, max, step, handler }: LayoutSettingOptionProps) => {
  return (
    <li className={ID('option')}>
      <div className={ID('option-text')}>
        <label>{lbl}</label>
        <p>{dsc}</p>
      </div>
      <input type='number' min={min} max={max} step={step} value={val} onChange={handler} />
    </li>
  )
}