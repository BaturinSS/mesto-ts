export class UserInfo {
  constructor({ profileNameSelector, profileJobSelector, avatarSelector }) {
    this._nameElement = document.querySelector(profileNameSelector);
    this._jobElement = document.querySelector(profileJobSelector);
    this._avatar = document.querySelector(avatarSelector);
  };

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent
    };
  };

  setUserInfo(title, job, avatar) {
    this._nameElement.textContent = title;
    this._jobElement.textContent = job;
    this._avatar.src = avatar;
  };
};