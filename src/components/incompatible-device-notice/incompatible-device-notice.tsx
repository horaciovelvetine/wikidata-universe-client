import "./incompatible-device-notice.css";

import { GITHUB_URL, _bl, MAILTO_URL } from "../../app";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
} from "../../providers";
import { useComponentID } from "../../hooks";

/**
 * Notice mesage displayed on screen when the application detects the clients device is incompatible.
 * Message display state is tied to the @see DeviceCompatabilityProvider which maintains the effect looking
 * for screen resizing. This component will not display when the @see ServiceOfflineNotice is being displayed.
 */

export const IncompatibleDeviceNotice = (): JSX.Element => {
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
