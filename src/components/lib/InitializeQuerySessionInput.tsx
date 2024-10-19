import './InitializeQuerySessionInput.css'
import GlobeLogo from '../../assets/imgs/globe-outline-no-bg-white.svg'
import { Search } from '../../assets/icons'

import { ChangeEvent, createRef, Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from 'react';

import { getQueryData, RequestResponse } from '../../api';
import { errorShakeInvalidElement, toggleElementOpacity, fadeElementAndRemoveDisplay, INPUT_STATE } from '../';
import { MainAppLayoutSessionState } from '../../app/MainAppLayout';

const wikidataHomepage = 'https://www.wikidata.org/wiki/Wikidata:Main_Page';
const prfx = (suffix: string) => { return 'init-query-session-' + suffix };

interface InitializeQuerySessionInputProps {
  sessionSettingsState: MainAppLayoutSessionState
  setInitialQueryResponse: Dispatch<SetStateAction<RequestResponse | null>>;
}

export const InitializeQuerySessionInput: FC<InitializeQuerySessionInputProps> = ({ sessionSettingsState, setInitialQueryResponse }) => {
  const { setIsLoading, setActiveQuerySession, useOfflineData, apiOnline } = sessionSettingsState;
  const [localInput, setLocalInput] = useState<string>('');
  const [locInpValid, setLocInpValid] = useState<INPUT_STATE>(INPUT_STATE.PLACEHOLDER);

  const contRef = createRef<HTMLDivElement>();
  const invalidContRef = createRef<HTMLDivElement>();
  const submitRef = createRef<HTMLButtonElement>();
  const inputRef = createRef<HTMLInputElement>();

  const curElRefs = () => { return { container: contRef.current!, invalidCont: invalidContRef.current!, submit: submitRef.current!, input: inputRef.current! } }

  useEffect(() => { // fade the element in on render...
    if (!useOfflineData && apiOnline) {
      toggleElementOpacity(contRef.current!, true, '400ms')
    } else if (!apiOnline) {
      fadeElementAndRemoveDisplay(contRef.current!, '1ms')
    }
  }, [])

  const submitInitQueryRequestHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { container, invalidCont, submit, input } = curElRefs();

    if (locInpValid !== INPUT_STATE.VALID) {
      errorShakeInvalidElement(input);
      errorShakeInvalidElement(submit);
      return;
    }

    setIsLoading(true);
    await getQueryData(localInput).then(res => {

      if (res.status === 200) {
        setActiveQuerySession(true);
        setInitialQueryResponse(res);
        fadeElementAndRemoveDisplay(container, '250ms')
      } else {
        toggleElementOpacity(invalidCont, true, '150ms')
        setTimeout(() => {
          toggleElementOpacity(invalidCont, false, '150ms')
        }, 2000)
        setIsLoading(false);
        setLocInpValid(INPUT_STATE.INVALID);
        errorShakeInvalidElement(input);
        errorShakeInvalidElement(submit);
      }
    })
  }

  const initQueryInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLocalInput(e.target.value);
    const alphanumericRegex = /^[a-z0-9\s]+$/i;

    if (localInput.length === 0) {
      setLocInpValid(INPUT_STATE.EMPTY);
    } else if (alphanumericRegex.test(localInput)) {
      setLocInpValid(INPUT_STATE.VALID);
    } else {
      setLocInpValid(INPUT_STATE.INVALID);
    }
  }

  return (
    <div id={prfx('input-main-cont')} ref={contRef} >
      <div id={prfx('invalid-cont')} ref={invalidContRef} >
        <p id={prfx('invalid-msg')} > Unable to find any results for: "{localInput}".</p >
      </div >

      <div id={prfx('globe-logo-cont')} >
        <img id={prfx('globe-logo-img')} src={GlobeLogo} alt='Wikipedia Globe Logo' />
      </div >

      <div id={prfx('heading-cont')}>
        <h1 id={prfx('title')} >explore <a id={prfx('wm-homepage-link')} href={wikidataHomepage} target='_blank' >Wikipedia</a> graphically</h1>
      </div >

      <div id={prfx('form-cont')}>
        <form id={prfx('form')} onSubmit={submitInitQueryRequestHandler}>
          <input id={prfx('input')} ref={inputRef} type='text' placeholder='Search...' onChange={initQueryInputChangeHandler} />
          <button id={prfx('submit-btn')} ref={submitRef} type='submit'>
            <div id='icon-adjustment-layer'>
              < img id={prfx('search-icon')} src={Search} />
            </div >
          </button>
        </form>
      </div>
    </div >
  );
};