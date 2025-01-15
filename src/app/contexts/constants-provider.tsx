import { FC, ReactNode, createContext, useContext, useMemo } from "react";


interface ConstantsProviderProps {
  children: ReactNode;
}

interface ConstantsProvider {
  _bl: string;
  GITHUB_URL: string;
  FRONTEND_URL: string;
  BACKEND_URL: string;
  MAILTO_URL: string;
}

const ConstantsContext = createContext<ConstantsProvider | undefined>(undefined);

export const ConstantsProvider: FC<ConstantsProviderProps> = ({ children }) => {
  const _bl = 'blank';
  const GITHUB_URL = 'https://github.com/horaciovelvetine';
  const FRONTEND_URL = GITHUB_URL + '/wikidata-universe-client';
  const BACKEND_URL = GITHUB_URL + '/wikidata-universe-api';
  const MAILTO_URL = 'mailto:horaciovelvetine@gmail.com'

  const ctxtValue = useMemo(() => ({ _bl, GITHUB_URL, FRONTEND_URL, BACKEND_URL, MAILTO_URL }), [_bl, GITHUB_URL, FRONTEND_URL, BACKEND_URL, MAILTO_URL])

  return (
    <ConstantsContext.Provider value={ctxtValue}>
      {children}
    </ConstantsContext.Provider>
  )
}

export const useConstants = (): ConstantsProvider => {
  const context = useContext(ConstantsContext);
  if (!context) {
    throw new Error('useConstants() error, must be used inside of the ConstantsProvider context.')
  }
  return context;
}