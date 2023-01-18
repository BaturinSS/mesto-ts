export interface IConfigValidation {
  [key: string]: string
}

const configValidation: IConfigValidation = {
  inputClass: 'popup__input',
  submitButtonClass: 'popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input_type_error',
  textErrorClass: 'popup__input-error_active'
};

export default configValidation;