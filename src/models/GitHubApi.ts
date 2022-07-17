import { GitHubUser } from '../typings/GitHubUser'

export default class GitHubApi {

  static async getUser(user: string): Promise<GitHubUser> {
    const response = await fetch(`https://api.github.com/users/${user}`)
    const userData: GitHubUser = await response.json()
    return userData
  }

}
