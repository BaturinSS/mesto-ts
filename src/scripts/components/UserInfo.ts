import {IDataUser} from "./Card";

interface IConstructorUserInfo {
  classProfileName: string,
  classProfileAbout: string,
  classProfileAvatar: string
}

export interface IGetUserInfo {
  name: IDataUser['name'],
  about: IDataUser['about']
}

class UserInfo {
  private readonly _nameElement: HTMLHeadingElement;
  private readonly _nameElementOrNull: HTMLHeadingElement | null;

  private readonly _aboutElement: HTMLParagraphElement;
  private readonly _aboutElementOrNull: HTMLParagraphElement | null;

  private readonly _avatarElement: HTMLImageElement;
  private readonly _avatarElementOrNull: HTMLImageElement | null;

  private _about!: IGetUserInfo['about'] | null;
  private _name!: IGetUserInfo['name'] | null;

  constructor({classProfileName, classProfileAbout, classProfileAvatar}: IConstructorUserInfo) {
    this._nameElementOrNull = document.querySelector(`.${classProfileName}`);
    if (this._nameElementOrNull) {
      this._nameElement = this._nameElementOrNull;
    } else throw new Error('No name element in profile')

    this._aboutElementOrNull = document.querySelector(`.${classProfileAbout}`);
    if (this._aboutElementOrNull) {
      this._aboutElement = this._aboutElementOrNull;
    } else throw new Error('No about element in profile')

    this._avatarElementOrNull = document.querySelector(`.${classProfileAvatar}`);
    if (this._avatarElementOrNull) {
      this._avatarElement = this._avatarElementOrNull;
    } else throw new Error('No about element in profile')


  };

  getUserInfo(): IGetUserInfo {
    this._name = this._nameElement.textContent;
    this._about = this._aboutElement.textContent;

    return {
      name: this._name ? this._name : 'No name',
      about: this._about ? this._about : 'No about'
    };
  };

  setUserInfo({name, about, avatar}: IDataUser): void {
    this._nameElement.textContent = name;
    this._aboutElement.textContent = about;
    this._avatarElement.src = avatar.toString();
  };
}

export default UserInfo;