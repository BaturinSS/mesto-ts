import {type IConfigValidation} from "../utils/configValidation";
import {interceptionError, type TInterceptionError} from "../utils/utils";

interface IConstructor {
  formData: IConfigValidation,
  classPopup: string,
}

class FormValidator {
  private readonly _interceptionError: TInterceptionError;

  private readonly _formActivePopupOrNull: HTMLFormElement | null;
  private readonly _formActivePopup: HTMLFormElement;

  private readonly _submitButtonOrNull: HTMLButtonElement | null;
  private readonly _submitButton: HTMLButtonElement;

  private _inputErrorOrNull!: HTMLInputElement | null;
  private _inputError!: HTMLInputElement;

  private readonly _inactiveButtonClass: string;
  private readonly _inputErrorClass: string;
  private readonly _textErrorClass: string;
  private readonly _arrayInputsFormActive: HTMLInputElement[];

  constructor({formData, classPopup}: IConstructor) {
    const {
      CLASS_INACTIVE_BUTTON, CLASS_INPUT_ERROR,
      CLASS_INPUT_ERROR_ACTIVE,
      CLASS_SUBMIT_BUTTON, CLASS_INPUT
    } = formData;
    this._interceptionError = interceptionError;

    this._inactiveButtonClass = CLASS_INACTIVE_BUTTON;
    this._inputErrorClass = CLASS_INPUT_ERROR;
    this._textErrorClass = CLASS_INPUT_ERROR_ACTIVE;

    this._formActivePopupOrNull = document.querySelector(`.${classPopup}`);
    if (this._formActivePopupOrNull) {
      this._formActivePopup = this._formActivePopupOrNull
    } else {
      this._interceptionError(45, 'constructor', 'FormValidator.ts')
    }

    this._submitButtonOrNull = this._formActivePopup.querySelector(`.${CLASS_SUBMIT_BUTTON}`);
    if (this._submitButtonOrNull) {
      this._submitButton = this._submitButtonOrNull
    } else {
      this._interceptionError(47, 'constructor', 'FormValidator.ts')
    }

    this._arrayInputsFormActive =
      Array.from(this._formActivePopup.querySelectorAll(`.${CLASS_INPUT}`));
  }


  public clearErrorsForm(): void {
    this._arrayInputsFormActive.forEach((inputElement) => {
      inputElement.classList.remove(this._inputErrorClass);
      this._disableErrorText(inputElement);
    });
    this._changingButtonState();
  }

  public enableValidation(): void {
    this._arrayInputsFormActive.forEach((inputElement) => {
      this._setEventListeners(inputElement);
    });
  }

  private _deactivateButton(): void {
    this._submitButton.setAttribute('disabled', 'true');
    this._submitButton.classList.add(this._inactiveButtonClass);
  }

  private _activationButton(): void {
    this._submitButton.removeAttribute('disabled');
    this._submitButton.classList.remove(this._inactiveButtonClass);
  }

  private _hasInvalidInput(): boolean {
    return this._arrayInputsFormActive.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  private _changingButtonState(): void {
    if (!this._hasInvalidInput()) {
      this._activationButton();
    } else {
      this._deactivateButton();
    }
  }

  private _disableErrorText(inputElement: HTMLInputElement): void | never {
    this._inputErrorOrNull = this._formActivePopup.querySelector(`.${inputElement.id}-error`);
    if (this._inputErrorOrNull) {
      this._inputError = this._inputErrorOrNull;
      this._inputError.classList.remove(this._textErrorClass);
    } else {
      this._interceptionError(97, '_disableErrorText', 'FormValidator.ts')
    }
  }

  private _includeErrorText(inputElement: HTMLInputElement): void | never {
    this._inputErrorOrNull = this._formActivePopup.querySelector(`.${inputElement.id}-error`);
    if (this._inputErrorOrNull) {
      this._inputError = this._inputErrorOrNull;
      this._inputError.textContent = '';
      this._inputError.classList.add(this._textErrorClass);
      this._inputError.textContent = inputElement.validationMessage;
    } else {
      this._interceptionError(107, '_includeErrorText', 'FormValidator.ts')
    }
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
    this._formActivePopup.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    inputElement.addEventListener('input', () => {
      this._isValid(inputElement);
    });
  }
}

export default FormValidator;