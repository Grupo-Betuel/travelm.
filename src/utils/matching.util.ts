import { values } from 'lodash'
import { cleanText } from './text.utils'

export const isNotEmptyObject = (obj: any) => {
  const str = JSON.stringify(obj)
  return str !== '{}' && str !== '[]'
}

export function deepMatch<T>(value: any, values: T[] = []): T[] {
  if (!values) return []
  const results = values.filter((item) =>
    cleanText(JSON.stringify(item)).includes(cleanText(value))
  )
  console.log('results', results)
  return results
}
