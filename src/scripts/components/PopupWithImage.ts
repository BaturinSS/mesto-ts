import type {IConstructorPopup} from './Popup';
import Popup from './Popup';
import {ICardInfo} from "./Card";

class PopupWithImage extends Popup {
  private readonly _popupZoomSubtitleActivePopup: HTMLHeadingElement | null;
  private _popupZoomSubtitle!: HTMLHeadingElement;
  private readonly _popupZoomImageActivePopup: HTMLImageElement | null;
  private _popupZoomImage!: HTMLImageElement;

  constructor({popupClass}: IConstructorPopup) {
    super({popupClass: popupClass});
    this._popupZoomSubtitleActivePopup = this._popup.querySelector('.popup__subtitle');
    if (this._popupZoomSubtitleActivePopup) this._popupZoomSubtitle = this._popupZoomSubtitleActivePopup;
    this._popupZoomImageActivePopup = this._popup.querySelector('.popup__image');
    if (this._popupZoomImageActivePopup) this._popupZoomImage = this._popupZoomImageActivePopup;
  }

  override open(cardInfo: ICardInfo): void {
    this._popupZoomImage.src = '';
    this._popupZoomImage.alt = '';
    this._popupZoomSubtitle.textContent = '';
    this._popupZoomImage.src = cardInfo.link.toString();
    this._popupZoomImage.alt = cardInfo.name;
    this._popupZoomSubtitle.textContent = cardInfo.name;
    super.open();
  }
}

export default PopupWithImage;
