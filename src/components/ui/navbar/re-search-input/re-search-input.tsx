import "./re-search-input.css";
import { Search, SearchDngr } from "../../../../assets/icons";
import {
  createRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";

import {
  errorShakeReSearchContainer,
  moveReSearchInputInView,
  showHideReSearchInput,
} from "..";
import { errorToggleIconVisibility } from "../../../features";
import { P5Sketch } from "../../../../types";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
  WikiverseServiceResponse,
} from "../../../../contexts";

interface ReSearchInputProps {
  sketchRef: P5Sketch;
  setInitSketchData: Dispatch<SetStateAction<WikiverseServiceResponse | null>>;
}

const ID = (sufx: string) => `re-search-${sufx}`;

export const ReSearchInput = ({
  sketchRef,
  setInitSketchData,
}: ReSearchInputProps) => {
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();
  const { getQueryData } = useWikiverseService();
  const [query, setQuery] = useState(sketchRef.state.query());

  const ReSearchCont = createRef<HTMLDivElement>();
  const InputRef = createRef<HTMLInputElement>();
  const IconRef = createRef<HTMLImageElement>();
  const DngrIconRef = createRef<HTMLImageElement>();

  useEffect(() => {
    // tell sketch how to update query...
    sketchRef.state.addQuerySubscriber(setQuery);
    moveReSearchInputInView(ReSearchCont);
  });

  useEffect(() => {
    // hide input when screen to small...
    showHideReSearchInput(ReSearchCont, meetsMinScreenSizeReq);
  }, [meetsMinScreenSizeReq, ReSearchCont]);

  const handleNewSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await getQueryData(query)
      .then(res => {
        setInitSketchData(res);
      })
      .catch(() => {
        errorShakeReSearchContainer(InputRef, ReSearchCont);
        errorToggleIconVisibility(IconRef, DngrIconRef);
      });
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    sketchRef.state.setQuery(e.target.value);
  };

  return (
    <div id={ID("container")} ref={ReSearchCont}>
      <div id={ID("icon-container")}>
        <img id={ID("icon")} src={Search} ref={IconRef} />
        <img id={ID("error-icon")} src={SearchDngr} ref={DngrIconRef} />
      </div>
      <form id={ID("form")} onSubmit={handleNewSearchSubmit}>
        <input
          id={ID("input")}
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          ref={InputRef}
        />
      </form>
    </div>
  );
};
