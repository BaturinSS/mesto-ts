import {type IConfigValidation} from "../utils/configValidation";
import {
  MESSAGE_ERROR_NOT_ELEMENT_BUTTON_SUBMIT,
  MESSAGE_ERROR_NOT_ELEMENT_FORM_POPUP,
  MESSAGE_ERROR_NOT_ELEMENT_INPUT_ERROR
} from "../utils/constants";

interface IConstructor {
  formData: IConfigValidation,
  classPopup: string,
}

export class FormValidator {
  private readonly _formActivePopup: HTMLFormElement | null;
  private readonly _submitButton: HTMLButtonElement | null;
  private readonly _inactiveButtonClass: string;
  private readonly _inputErrorClass: string;
  private readonly _textErrorClass: string;
  private readonly _arrayInputsFormActive: HTMLInputElement[] = [];

  constructor({formData, classPopup}: IConstructor) {
    this._inactiveButtonClass = formData.inactiveButtonClass;
    this._inputErrorClass = formData.inputErrorClass;
    this._textErrorClass = formData.textErrorClass;
    this._formActivePopup = document.querySelector(`.${classPopup}`);

    if (this._formActivePopup) {
      this._submitButton =
        this._formActivePopup.querySelector(`.${formData.submitButtonClass}`);

      this._arrayInputsFormActive =
        Array.from(this._formActivePopup.querySelectorAll(`.${formData.inputClass}`));
    } else {
      throw new Error(MESSAGE_ERROR_NOT_ELEMENT_FORM_POPUP);
    }
  }


  public clearErrorsForm(): void {
    this._arrayInputsFormActive.forEach((inputElement) => {
      inputElement.classList.remove(this._inputErrorClass);
      this._disableErrorText(inputElement);
    });
    this._changingButtonState();
  }

  public enableValidation(this: FormValidator): void {
    this._arrayInputsFormActive.forEach((inputElement) => {
      this._setEventListeners(inputElement);
    });
  }

  private _deactivateButton(): void | never {
    if (this._submitButton) {
      this._submitButton.setAttribute('disabled', 'true');
      this._submitButton.classList.add(this._inactiveButtonClass);
    } else {
      throw new Error(MESSAGE_ERROR_NOT_ELEMENT_BUTTON_SUBMIT)
    }
  }

  private _activationButton(): void | never {
    if (this._submitButton) {
      this._submitButton.removeAttribute('disabled');
      this._submitButton.classList.remove(this._inactiveButtonClass);
    } else {
      throw new Error(MESSAGE_ERROR_NOT_ELEMENT_BUTTON_SUBMIT)
    }
  }

  private _hasInvalidInput(): boolean {
    return this._arrayInputsFormActive.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  private _changingButtonState(): void {
    const validityFormActive = this._hasInvalidInput();
    if (!validityFormActive) {
      this._activationButton();
    } else {
      this._deactivateButton();
    }
  }

  private _disableErrorText(inputElement: HTMLInputElement): void {
    let inputError: HTMLInputElement | null;
    if (this._formActivePopup) {
      inputError = this._formActivePopup.querySelector(`.${inputElement.id}-error`);
      if (inputError) {
        inputError.classList.remove(this._textErrorClass);
      } else throw new Error(MESSAGE_ERROR_NOT_ELEMENT_INPUT_ERROR)
    } else {
      throw new Error(MESSAGE_ERROR_NOT_ELEMENT_FORM_POPUP)
    }

  }

  private _includeErrorText(inputElement: HTMLInputElement): void {
    let inputError: HTMLInputElement | null;
    if (this._formActivePopup) {
      inputError = this._formActivePopup.querySelector(`.${inputElement.id}-error`);
      if (inputError) {
        inputError.textContent = '';
        inputError.classList.add(this._textErrorClass);
        inputError.textContent = inputElement.validationMessage;
      } else throw new Error(MESSAGE_ERROR_NOT_ELEMENT_INPUT_ERROR)
    } else throw new Error(MESSAGE_ERROR_NOT_ELEMENT_FORM_POPUP)
  }

  private _isValid(inputElement: HTMLInputElement): void {
    if (!inputElement.validity.valid) {
      inputElement.classList.add(this._inputErrorClass);
      this._includeErrorText(inputElement);
    } else {
      inputElement.classList.remove(this._inputErrorClass);
      this._disableErrorText(inputElement);
    }

    this._changingButtonState();
  }

  private _setEventListeners(inputElement: HTMLInputElement): void {
    if (this._formActivePopup) {
      this._formActivePopup.addEventListener('submit', (event) => {
        event.preventDefault();
      });
    } else throw new Error(MESSAGE_ERROR_NOT_ELEMENT_FORM_POPUP)


    inputElement.addEventListener('input', () => {
      this._isValid(inputElement);
    });
  }
}