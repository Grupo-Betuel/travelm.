import { useEffect, useState } from 'react';
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook';

export interface IHandleAuthVisibilityProps {
  children: any
  visibleOn?: 'auth' | 'no-auth'
  className?: string
}
export function HandleAuthVisibility({
  children,
  visibleOn,
  className,
}: IHandleAuthVisibilityProps) {
  const [mustBeRendered, setMustBeRendered] = useState(false);
  const { client } = useAuthClientHook();

  useEffect(() => {
    if (visibleOn === 'auth') {
      setMustBeRendered(!!client);
    } else if (visibleOn === 'no-auth') {
      setMustBeRendered(!client);
    }
  }, [children]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{mustBeRendered && <div className={className}>{children}</div>}</>;
}
