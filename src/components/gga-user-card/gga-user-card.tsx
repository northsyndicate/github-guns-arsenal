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

  loader() {
    return (
      <div class="gga-user-card__loader">
        <div class="gga-user-card__loader-stroke"></div>
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

  userBioContainer() {
    return (
      <div class="user-bio-container">
        <p>{this.userData.bio}</p>
      </div>
    );
  }

  userCommonInfo() {
    return (
      <div class="user-common">
        <img class="user-common__profile-picture" src={this.userData.avatar_url} alt="" />
        <div class="user-common__info-container">
          <span class="user-common__profile-name">{this.userData.name}</span>
          <span class="user-common__profile-login">{this.userData.login} </span>
        </div>
      </div>
    );
  }

  visitGhProfileFragment() {
    return (
      <div class="visit-gh-profile">
        <a href={this.userData.html_url} class="visit-gh-profile__button">
          Visit
        </a>
      </div>
    );
  }

  userAdditionalInfo() {
    return (
      <div class="user-additional-container">
        <div class="user-additional-container__item">{this.userData.twitter_username}</div>
        <div class="user-additional-container__item">{this.userData.location}</div>
        <div class="user-additional-container__item">{this.userData.hireable || 'no'}</div>
      </div>
    );
  }

  userStatsContainer() {
    return (
      <div class="user-stats">
        <div class="user-stats__stats-container">
          {this.includeFollowers && this.createStat('Followers', this.userData.followers)}
          {this.includeFollowing && this.createStat('Following', this.userData.following)}
          {this.includeGists && this.createStat('Gists', this.userData.public_gists)}
          {this.includeRepos && this.createStat('Repos', this.userData.public_repos)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <slot>
          {this.dataLoadState === DATA_LOAD_STATE.LOADING ? this.loader() : null}
          {this.userData !== null && this.userCommonInfo()}
          {this.userData !== null && this.userAdditionalInfo()}
          {this.userData !== null ? this.userBioContainer() : null}
          {this.userData !== null && this.showStats ? this.userStatsContainer() : null}
          {this.userData && this.visitGhProfileFragment()}
        </slot>
      </Host>
    );
  }
}
