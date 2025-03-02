import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { dimensionsMeetMinimumRequirements } from "../../types";
import { getDeviceDimensions } from "../../utils/get-device-dimensions";

/**
 * Props for the DeviceCompatabilityProvider component
 * @interface DeviceCompatabilityProviderProps
 * @property {ReactNode} children - Child components to render
 */
interface DeviceCompatabilityProviderProps {
  children: ReactNode;
}

/**
 * Context value interface for device compatibility information
 * @interface DeviceCompatabilityContext
 * @property {boolean} meetsMinScreenSizeReq - Whether the device meets minimum screen size requirements
 */
interface DeviceCompatabilityContext {
  meetsMinScreenSizeReq: boolean;
}

/**
 * Context for providing device compatibility information throughout the application
 * @type {React.Context<DeviceCompatabilityContext | undefined>}
 */
const DeviceCompatabilityContext = createContext<
  DeviceCompatabilityContext | undefined
>(undefined);

/**
 * Provider component that manages device compatibility state and checks
 * if the current device meets minimum screen size requirements.
 *
 * @param {DeviceCompatabilityProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with children
 */
export const DeviceCompatabilityProvider = ({
  children,
}: DeviceCompatabilityProviderProps) => {
  const [meetsMinScreenSizeReq, setMeetMinScreenSizeReq] = useState(true);

  useEffect(() => {
    /**
     * Handles window resize events and updates compatibility state
     * based on current device dimensions
     */
    const handleResize = () => {
      const deviceMeetsRequirements = dimensionsMeetMinimumRequirements(
        getDeviceDimensions()
      );
      setMeetMinScreenSizeReq(deviceMeetsRequirements);
    };

    // Check dimensions on initial mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ meetsMinScreenSizeReq }),
    [meetsMinScreenSizeReq]
  );

  return (
    <DeviceCompatabilityContext.Provider value={contextValue}>
      {children}
    </DeviceCompatabilityContext.Provider>
  );
};

/**
 * Custom hook to access the DeviceCompatabilityContext
 *
 * @returns {DeviceCompatabilityContext} The device compatibility context value
 * @throws {Error} If used outside of DeviceCompatabilityProvider
 */
export const useDeviceCompatabilityCheck = (): DeviceCompatabilityContext => {
  const context = useContext(DeviceCompatabilityContext);
  if (!context) {
    throw new Error(
      "useDeviceCompatabilityCheck() error, must be used inside of the DeviceCompatabilityProvider context."
    );
  }
  return context;
};
