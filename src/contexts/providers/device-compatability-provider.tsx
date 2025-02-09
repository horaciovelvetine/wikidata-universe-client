import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { getDeviceDiemnsions } from "../../utils/get-device-dimensions";

interface DeviceCompatabilityProviderProps {
  children: ReactNode;
}

interface DeviceCompatabilityProvider {
  meetsMinScreenSizeReq: boolean;
}

const DeviceCompatabilityContext = createContext<
  DeviceCompatabilityProvider | undefined
>(undefined);

export const DeviceCompatabilityProvider = ({
  children,
}: DeviceCompatabilityProviderProps) => {
  const [meetsMinScreenSizeReq, setMeetMinScreenSizeReq] = useState(true);

  useEffect(() => {
    // state for size provider
    const handleResize = () => {
      const deviceDimensions = getDeviceDiemnsions();
      if (deviceDimensions.meetsMinScreenSizeRequirements()) {
        setMeetMinScreenSizeReq(true);
      } else {
        setMeetMinScreenSizeReq(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ctxtValue = useMemo(
    () => ({ meetsMinScreenSizeReq }),
    [meetsMinScreenSizeReq]
  );

  return (
    <DeviceCompatabilityContext.Provider value={ctxtValue}>
      {children}
    </DeviceCompatabilityContext.Provider>
  );
};

export const useDeviceCompatabilityCheck = (): DeviceCompatabilityProvider => {
  const context = useContext(DeviceCompatabilityContext);
  if (!context) {
    throw new Error(
      "useDeviceCompatabilityCheck() error, must be used inside of the DeviceCompatabilityProvider context."
    );
  }
  return context;
};
