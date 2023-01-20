import Popup, {type IConstructorPopupTwoValues} from "./Popup";

class PopupWithConfirm extends Popup {
  constructor({popupClass, titleButton}: IConstructorPopupTwoValues) {
    super({popupClass: popupClass, titleButton: titleButton});
  }

  override open() {
    super.open();
    this._buttonSubmit.removeAttribute('disabled');
  }

  public changeSubmitHandler(newSubmitHandler: () => void) {
    this._handleSubmit = newSubmitHandler;
  }

  override setEventListeners = (): void => {
    super.setEventListeners();
    this._buttonSubmit.addEventListener('click', () => {
      this.renderLoading({isLoading: true});
      this._handleSubmit();
    })
  }
}

export default PopupWithConfirm;