import "./incompatible-device-notice.css";

import { GITHUB_URL, _bl, MAILTO_URL } from "../../app";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
} from "../../providers";
import { useComponentID } from "../../hooks";

/**
 * Notice mesage displayed on screen when the application detects the clients device is incompatible.
 * Message display state is tied to the {@link DeviceCompatabilityProvider} which maintains the useEffect() looking
 * for screen resizing.
 *
 * @remark
 * This component will not display when the {@link ServiceOfflineNotice} is being displayed.
 *
 * @hook
 * - useDeviceCompatabilityCheck() - listens for screen resizes to show/hide the notice
 */

export const IncompatibleDeviceNotice = () => {
  const { ID } = useComponentID("incompatible-device-notice");
  const { isOnline } = useWikiverseService();
  const { meetsMinScreenSizeReq } = useDeviceCompatabilityCheck();

  return (
    <div
      id={ID("container")}
      className={isOnline && !meetsMinScreenSizeReq ? "on-screen" : ""}
    >
      <div id={ID("layout")}>
        <h1 id={ID("title")}>Incompatible Device</h1>
        <p id={ID("main-text")}>
          the Wikiverse is currently only compatible with certain devices and
          your current device may not work as intended. Devices with a larger
          screen and access to a mouse make exploring data a lot more fun and
          are recommended!
        </p>
        <p id={ID("link-text")}>
          More details about the Wikiverse can be found on{" "}
          <a
            id={ID("frontend-link")}
            className={ID("link")}
            href={GITHUB_URL}
            target={_bl}
          >
            github
          </a>
          , or by{" "}
          <a id={ID("email-link")} href={MAILTO_URL} className={ID("link")}>
            emailing.
          </a>
        </p>
      </div>
    </div>
  );
};
