export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export async function getJSON<T>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<T> {
  return fetch(input, init).then<T>((response) => {
    return response.json()
  })
}
