import { createContext } from 'react';
import { AppViewportHeightClassNames } from 'src/pages/_app';

export interface IAppViewportHeightContextValue {
  appViewportHeightClassName: AppViewportHeightClassNames;
  setAppviewPortHeightClassName: (value: AppViewportHeightClassNames) => void
}

export const AppViewportHeightContext = createContext<IAppViewportHeightContextValue>(
  {} as IAppViewportHeightContextValue,
);
