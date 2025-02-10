import "./incompatible-device-notice.css";

import { GITHUB_URL, _bl, MAILTO_URL } from "../../app";
import {
  useDeviceCompatabilityCheck,
  useWikiverseService,
} from "../../contexts";
import { useComponentID } from "../../hooks";

/**
 * Displays a notice when the Wikiverse detects the client is using an  incompatible device.
 * If the device is incompatible, it displays a message informing the user about the
 * incompatibility and provides links for more information. It will not render if the
 * WikiverseService is not online
 *
 * @remarks
 * This component uses the `useComponentID` hook to generate unique IDs for its elements,
 * the `useWikiverseService` hook to check if the user is online, and the
 * `useDeviceCompatabilityCheck` hook to check if the device meets the minimum screen size requirements.
 *
 * @see {@link useComponentID}
 * @see {@link useWikiverseService}
 * @see {@link useDeviceCompatabilityCheck}
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
