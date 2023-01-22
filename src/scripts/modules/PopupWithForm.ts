import type { IConstructorPopupFull } from "./Popup";
import Popup from "./Popup";
import { IDataUser } from "./Card";

class PopupWithForm extends Popup {
  protected _values: any = {};
  private readonly _formActivePopup: HTMLFormElement | null;
  private _form!: HTMLFormElement;
  private _inputs: HTMLInputElement[];

  constructor({
    popupClass,
    handleSubmit,
    titleButton,
  }: IConstructorPopupFull) {
    super({
      popupClass: popupClass,
      handleSubmit: handleSubmit,
      titleButton: titleButton,
    });
    this._formActivePopup = this._popup.querySelector(".popup__form");

    if (this._formActivePopup) {
      this._form = this._formActivePopup;
    }

    this._inputs = Array.from(this._form.querySelectorAll(".popup__input"));
  }

  override close(): void {
    super.close();
    this._form.reset();
  }

  override setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (event: SubmitEvent) => {
      this.renderLoading({ isLoading: true });
      event.preventDefault();
      this._handleSubmit(this._getInputValues())
        .then(() => {
          this.close();
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            alert(err.message);
          } else {
            alert(err);
          }
        })
        .finally(() => {
          this.renderLoading({ isLoading: false });
        });
    });
  }

  public setInputValues(data: { [key: string]: string }) {
    this._inputs.forEach((input) => {
      const dataValue: string | undefined = data[input.name];
      if (dataValue) {
        input.value = dataValue;
      }
    });
  }

  private _getInputValues(): IDataUser {
    this._inputs.forEach((input) => {
      this._values[`${input.name}`] = input.value;
    });
    return this._values;
  }
}

export default PopupWithForm;
