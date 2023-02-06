import { getAuthData } from '../../../utils/auth.utils'
import { PropsWithChildren, useEffect, useState } from 'react'

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
  const authToken: string = getAuthData('access_token') as string
  const [mustBeRendered, setMustBeRendered] = useState(false)

  useEffect(() => {
    if (visibleOn === 'auth') {
      setMustBeRendered(!!authToken)
    } else if (visibleOn === 'no-auth') {
      setMustBeRendered(!authToken)
    }
  }, [children])

  return (
    <div className={`${className} ${!mustBeRendered ? 'd-none' : undefined}`}>
      {children}
    </div>
  )
}
