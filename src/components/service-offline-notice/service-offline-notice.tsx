import "./service-offline-notice.css";

import { Exclaims, Question } from "../../assets/icons";
import { useWikiverseService } from "../../providers";
import { useComponentID } from "../../hooks";

/**
 * Component which subscribes to the WikiverseService's @state isOnline, if this is false the
 * element takes presedence over all other interactivity in the app and displays a large notice
 * to the user on-screen
 */
export const ServiceOfflineNotice = (): JSX.Element => {
  const { ID } = useComponentID("offline-notice");
  const { isOnline } = useWikiverseService();

  return (
    <div id={ID("container")} className={isOnline ? "" : "on-screen"}>
      <div id={ID("text-container")}>
        <h1>the Wikiverse is offline.</h1>
        <h3>refresh the page or try again later.</h3>
      </div>
      <div id={ID("img-container")}>
        <img src={Question} id={ID("question-icon")} />
        <img src={Exclaims} id={ID("exclaims-icon")} />
      </div>
    </div>
  );
};
