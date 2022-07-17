import { Component, Host, h, Prop, State } from '@stencil/core';
import { GitHubUser } from '../../typings/GitHubUser';
import ghApi from '../../models/GitHubApi';

enum DATA_LOAD_STATE {
  LOADING,
  ERROR,
  LOADED,
}

@Component({
  tag: 'gga-user-card',
  styleUrl: 'gga-user-card.css',
  shadow: true,
})
export class GgaUserCard {
  @Prop()
  user: string;

  @Prop()
  showStats: boolean = true;

  @Prop()
  includeFollowers: boolean = true;

  @Prop()
  includeFollowing: boolean = true;

  @Prop()
  includeGists: boolean = true;

  @Prop()
  includeRepos: boolean = true;

  @Prop()
  includeTwitter: boolean = true;

  @State()
  dataLoadState: DATA_LOAD_STATE = DATA_LOAD_STATE.LOADING;

  @State()
  userData: null | GitHubUser = null;

  componentWillLoad() {
    console.log(this.user);
    ghApi.getUser(this.user).then(user => {
      this.dataLoadState = DATA_LOAD_STATE.LOADED;
      this.userData = user;
    });
  }

  getLoaderMarkup() {
    return (
      <div class="loader">
        <div class="loader__loader-stroke"></div>
      </div>
    );
  }

  createStat(label: string, value: number) {
    return (
      <div class="user-stats__stat">
        <div class="user-stats__value">{value}</div>
        <div class="user-stats__label">{label}</div>
      </div>
    );
  }

  userStatsFragment() {
    return (
      <div class="user-stats">
        {this.includeFollowers && this.createStat('Followers', this.userData.followers)}
        {this.includeFollowing && this.createStat('Following', this.userData.following)}
        {this.includeGists && this.createStat('Gists', this.userData.public_gists)}
        {this.includeRepos && this.createStat('Repos', this.userData.public_repos)}
      </div>
    );
  }

  userBioFragment() {
    if (!this.userData.bio) return null;

    return (
      <div class="user-bio">
        <p class="user-bio__paragraph">{this.userData.bio}</p>
      </div>
    );
  }

  userCommonInfoFragment() {
    return (
      <div class="user-common-info" style={{ backgroundImage: `url(${this.userData.avatar_url})` }}>
        <img class="user-common-info__profile-image" src={this.userData.avatar_url} alt="" />
        <span class="user-common-info__name">{this.userData.name}</span>
        <span class="user-common-info__login">{`@${this.userData.login}`}</span>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <slot>
          {this.dataLoadState === DATA_LOAD_STATE.LOADING ? this.getLoaderMarkup() : null}
          {this.userData && this.userCommonInfoFragment()}
          {this.userData && this.userBioFragment()}
          {this.userData !== null && this.userStatsFragment()}
        </slot>
      </Host>
    );
  }
}
