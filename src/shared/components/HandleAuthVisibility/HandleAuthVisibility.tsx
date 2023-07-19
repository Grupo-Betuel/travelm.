import { useEffect, useState } from 'react'
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook'

export interface IHandleAuthVisibilityProps {
  children: any
  visibleOn?: 'auth' | 'no-auth'
  className?: string
}
export const HandleAuthVisibility = ({
  children,
  visibleOn,
  className,
}: IHandleAuthVisibilityProps) => {
  const [mustBeRendered, setMustBeRendered] = useState(false)
  const { client } = useAuthClientHook()

  useEffect(() => {
    if (visibleOn === 'auth') {
      setMustBeRendered(!!client)
    } else if (visibleOn === 'no-auth') {
      setMustBeRendered(!client)
    }
  }, [children])

  return <>{mustBeRendered && <div className={className}>{children}</div>}</>
}
