import {IDataUser} from "./Card";
import {interceptionError, TInterceptionError} from "../utils/utils";

interface IConstructorUserInfo {
  classProfileName: string,
  classProfileAbout: string,
  classProfileAvatar: string
}

export interface IGetUserInfo {
  [key: string]: string
}

class UserInfo {
  protected readonly _interceptionError: TInterceptionError;

  private readonly _nameElement: HTMLHeadingElement;
  private readonly _nameElementOrNull: HTMLHeadingElement | null;

  private readonly _aboutElement: HTMLParagraphElement;
  private readonly _aboutElementOrNull: HTMLParagraphElement | null;

  private readonly _avatarElement: HTMLImageElement;
  private readonly _avatarElementOrNull: HTMLImageElement | null;

  private _about!: IGetUserInfo['about'] | null;
  private _name!: IGetUserInfo['name'] | null;

  constructor({classProfileName, classProfileAbout, classProfileAvatar}: IConstructorUserInfo) {
    this._interceptionError = interceptionError
    this._nameElementOrNull = document.querySelector(`.${classProfileName}`);
    if (this._nameElementOrNull) {
      this._nameElement = this._nameElementOrNull;
    } else {
      this._interceptionError(31, 'constructor', 'UserInfo.ts')
    }

    this._aboutElementOrNull = document.querySelector(`.${classProfileAbout}`);
    if (this._aboutElementOrNull) {
      this._aboutElement = this._aboutElementOrNull;
    } else {
      this._interceptionError(38, 'constructor', 'UserInfo.ts')
    }

    this._avatarElementOrNull = document.querySelector(`.${classProfileAvatar}`);
    if (this._avatarElementOrNull) {
      this._avatarElement = this._avatarElementOrNull;
    } else {
      this._interceptionError(45, 'constructor', 'UserInfo.ts')
    }
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