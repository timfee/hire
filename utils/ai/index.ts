import resumeMessage from './resumeMessage'
import websiteMessage from './websiteMessage'

export const prompts: {
  [keyof: string]: (company: string, role?: string) => string
} = {
  resumeMessage,
  websiteMessage,
}
