import {ICardInfo, IDataUser} from "./Card";

export type ArgsHandleSubmit = { [key: string]: string }

interface IHandleSubmit {
  (args: ICardInfo): Promise<void>

  (args: IDataUser): Promise<void>
}

export interface IConstructorPopup {
  popupClass: string,
}

interface IConstructorPopupImplementations extends IConstructorPopup {
  titleButton?: string,
  handleSubmit?: IHandleSubmit
}

export interface IConstructorPopupFull extends IConstructorPopup {
  titleButton: string,
  handleSubmit: IHandleSubmit
}

export interface IConstructorPopupTwoValues extends IConstructorPopup {
  titleButton: string,
}

abstract class Popup {
  protected readonly _buttonSubmit!: HTMLButtonElement;
  protected _handleSubmit!: IConstructorPopupFull['handleSubmit'];
  protected readonly _titleButton!: string;
  protected readonly _textDefault!: string;
  protected readonly _popup: HTMLDivElement;
  private readonly _buttonSubmitActivePopup!: HTMLButtonElement | null;
  private readonly _textButton!: string | null;
  private readonly _popupActive: HTMLDivElement | null;
  private readonly _popupClass: IConstructorPopup['popupClass'];
  private _elementTarget!: HTMLElement;

  protected constructor({popupClass}: IConstructorPopup)
  protected constructor({popupClass, titleButton}: IConstructorPopupTwoValues)
  protected constructor({popupClass, titleButton, handleSubmit}: IConstructorPopupFull)
  protected constructor({popupClass, titleButton, handleSubmit}: IConstructorPopupImplementations) {
    this._popupClass = popupClass;
    this._popupActive = document.querySelector(`.${this._popupClass}`);

    if (this._popupActive) {
      this._popup = this._popupActive;
    } else throw new Error(`No section popup ${this._popupClass}`);

    if (typeof titleButton === "string") {
      this._titleButton = titleButton;
      this._buttonSubmitActivePopup = this._popup.querySelector('.popup__save-button');
      if (this._buttonSubmitActivePopup) {
        this._buttonSubmit = this._buttonSubmitActivePopup;
        this._textButton = this._buttonSubmit.textContent
        this._textDefault = this._textButton ? this._textButton : '';
      } else throw new Error('No element submit button')
    }

    if (typeof handleSubmit === "function") {
      this._handleSubmit = handleSubmit;
    }
  }

  public open(data?: ICardInfo): void {
    if (this._popup) {
      this._popup.classList.add('popup_opened');

    } else throw new Error(`No section popup ${this._popupClass}`);

    document.addEventListener('keydown', this._handleEscClose);
  }

  public close(this: Popup): void {
    if (this._popup) {
      this._popup.classList.remove('popup_opened');

    } else throw new Error(`No section popup ${this._popupClass}`);

    document.removeEventListener('keydown', this._handleEscClose);
  }

  public setEventListeners(this: Popup): void {
    if (this._popup) {
      this._popup.addEventListener('mousedown', (evt: MouseEvent) => {
        this._elementTarget = evt.target as HTMLElement;

        if (this._elementTarget.classList.contains('popup_opened') ||
          this._elementTarget.classList.contains('popup__image-cross')) {
          this.close();
        }
      });
    } else throw new Error(`No section popup ${this._popupClass}`);
  }

  public renderLoading({isLoading}: { isLoading: boolean }): void {
    if (isLoading) {
      this._buttonSubmit.textContent = this._titleButton;
      this._buttonSubmit.setAttribute('disabled', 'true');
    } else {
      this._buttonSubmit.textContent = this._textDefault;
    }
  }

  private _handleEscClose = (evt: KeyboardEvent): void => {
    if (evt.key === 'Escape') this.close();
  }
}

export default Popup;