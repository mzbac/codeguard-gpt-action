/* eslint-disable filenames/match-regex */
/* eslint-disable sort-imports */
import {sendPostRequest} from 'chatgpt-plus-api-client'
import {promptForJson} from './prompt'
import {Suggestions} from './utils'

export async function getSuggestions(
  textWithLineNumber: string,
  linesToReview: {start: number; end: number}[]
): Promise<Suggestions> {
  const response = await sendPostRequest({
    prompt: promptForJson(
      textWithLineNumber,
      linesToReview.map(({start, end}) => `line ${start}-${end}`).join(',')
    )
  })

  let suggestions
  try {
    suggestions = JSON.parse(response.message.content.parts[0])
  } catch (err) {
    throw new Error(
      `ChatGPT response is not a valid json:\n ${response.message.content.parts[0]}`
    )
  }
  return suggestions
}