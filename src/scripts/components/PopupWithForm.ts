import type {ArgsHandleSubmit, IConstructorPopupFull} from './Popup';
import Popup from './Popup';


class PopupWithForm extends Popup {
  private readonly _formActivePopup: HTMLFormElement | null;
  private _form!: HTMLFormElement;
  private _inputs: HTMLInputElement[];

  constructor({popupClass, handleSubmit, titleButton}: IConstructorPopupFull) {
    super({popupClass: popupClass, handleSubmit: handleSubmit, titleButton: titleButton});
    this._formActivePopup = this._popup.querySelector('.popup__form');
    if (this._formActivePopup) this._form = this._formActivePopup
    this._inputs = Array.from(this._form.querySelectorAll('.popup__input'));
  }

  override close(): void {
    super.close();
    this._form.reset();
  }

  override setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (event: SubmitEvent) => {
      this.renderLoading({isLoading: true});
      event.preventDefault();
      this._handleSubmit(this._getInputValues())
        .then(() => this.close())
        .catch((err) => {
          if (err instanceof Error) {
            alert(err.message);
          }
          err.then((res) => {
            alert(res.message);
          });
        })
        .finally(() => this.renderLoading({isLoading: false}))
    });
  }

  public setInputValues(data) {
    this._inputs.forEach(input => {
      input.value = data[input.name];
    });
  }

  private _getInputValues(this: PopupWithForm) {
    const values: ArgsHandleSubmit = {};
    this._inputs.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }
}

export default PopupWithForm;