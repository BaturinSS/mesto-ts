export interface IConfigValidation {
  CLASS_INPUT: string,
  CLASS_SUBMIT_BUTTON: string,
  CLASS_INACTIVE_BUTTON: string,
  CLASS_INPUT_ERROR: string,
  CLASS_INPUT_ERROR_ACTIVE: string
}

const configValidation: IConfigValidation = {
  CLASS_INPUT: 'popup__input',
  CLASS_SUBMIT_BUTTON: 'popup__save-button',
  CLASS_INACTIVE_BUTTON: `popup__save-button_disabled`,
  CLASS_INPUT_ERROR: 'popup__input_type_error',
  CLASS_INPUT_ERROR_ACTIVE: 'popup__input-error_active'
};

export default configValidation;