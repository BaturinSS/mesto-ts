import { Popup } from '../components/Popup.js';

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupZoomSubtitle = this._popup.querySelector('.popup__subtitle');
    this._popupZoomImage = this._popup.querySelector('.popup__image');
  };

  open(nameImage, linkImage) {
    this._popupZoomImage.src = '';
    this._popupZoomImage.alt = '';
    this._popupZoomSubtitle.textContent = '';
    this._popupZoomImage.src = linkImage;
    this._popupZoomImage.alt = nameImage;
    this._popupZoomSubtitle.textContent = nameImage;
    super.open();
  };
};