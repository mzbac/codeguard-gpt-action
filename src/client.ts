import * as core from '@actions/core'
import {Octokit} from '@octokit/action'
import fetch from 'node-fetch'

export async function getRawFileContent(
  url: string
): Promise<string | undefined> {
  try {
    const response = await fetch(url)
    const text = await response.text()
    return text
  } catch (error) {
    core.error(JSON.stringify(error))
  }
}

export async function addCommentToPR(
  owner: string,
  repo: string,
  pullNumber: number,
  filePath: string,
  comment: string,
  commitId: string,
  octokit: Octokit
): Promise<void> {
  try {
    await octokit.request(
      'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments',
      {
        owner,
        repo,
        pull_number: pullNumber,
        body: comment,
        path: filePath,
        line: 1,
        side: 'RIGHT',
        commit_id: commitId
      }
    )
  } catch (error) {
    core.error(JSON.stringify(error, null, 2))
  }
}

export async function postCommentToPR(
  owner: string,
  repo: string,
  pullNumber: number,
  comment: string,
  octokit: Octokit
): Promise<void> {
  try {
    const result = await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner,
        repo,
        issue_number: pullNumber,
        body: comment
      }
    )
    // eslint-disable-next-line no-console
    console.log(`Comment posted successfully: ${result.data.html_url}`)
  } catch (error) {
    throw new Error(`Failed to post comment: ${error}`)
  }
}
