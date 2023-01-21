import {type IConfigTemplateCard} from "../utils/configTemplateCard";
import {interceptionError, type TInterceptionError} from "../utils/utils";

export interface IDataUser {
  about: string,
  avatar: URL,
  cohort: string,
  name: string,
  _id: string
}

interface ILikes extends IDataUser {
}

interface IOwner extends IDataUser {
}

export interface ICardInfo {
  createdAt: Date,
  likes: ILikes[],
  link: URL,
  name: string,
  owner: IOwner,
  _id: string
}

export type TFuncHandleClick = (id: string) => void

export interface ICardConstructor {
  cardInfo: ICardInfo,
  configTemplateCard: IConfigTemplateCard
  handleImageClick: () => void,
  handleDeleteClick: TFuncHandleClick,
  userId: string,
  handleLikeClick: TFuncHandleClick,
}

class Card {
  private readonly _interceptionError: TInterceptionError;
  private readonly _name: ICardInfo['name'];
  private readonly _link: ICardInfo['link'];
  private _likes: ILikes[];
  private readonly _id: ICardInfo['_id'];
  private readonly _userId: ICardConstructor['userId'];
  private readonly _ownerId: IDataUser['_id'];
  private readonly _configTemplateCard: IConfigTemplateCard
  private readonly _handleImageClick: ICardConstructor['handleImageClick'];
  private readonly _handleDeleteClick: ICardConstructor['handleDeleteClick'];
  private readonly _handleLikeClick: ICardConstructor['handleLikeClick'];
  private _element: HTMLTemplateElement | null = null;
  private _elementTitle: HTMLTitleElement | null = null;
  private _deleteButton: HTMLButtonElement | null = null;
  private _elementImage: HTMLImageElement | null = null;
  private _likeButton: HTMLButtonElement | null = null;
  private _likeCountElement: HTMLSpanElement | null = null;
  private _elementCardTemplate: HTMLTemplateElement | null = null;
  private _elementCardElement: HTMLLIElement | null = null;

  constructor(
    {
      cardInfo, configTemplateCard, handleImageClick,
      handleDeleteClick, userId, handleLikeClick
    }: ICardConstructor) {

    this._configTemplateCard = configTemplateCard
    this._name = cardInfo.name;
    this._link = cardInfo.link;
    this._likes = cardInfo.likes;
    this._id = cardInfo._id;
    this._userId = userId;
    this._ownerId = cardInfo.owner._id;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
    this._interceptionError = interceptionError;
  };

  public generateCard = (): HTMLTemplateElement | never => {
    const {
      CLASS_TITLE_CARD_TEMPLATE,
      CLASS_BUTTON_DELETE_CARD_TEMPLATE, CLASS_IMAGE_CARD_TEMPLATE,
      CLASS_BUTTON_LIKE_CARD_TEMPLATE, CLASS_INFO_LIKE_CARD_TEMPLATE
    } = this._configTemplateCard;
    this._element = this._getTemplate();

    if (this._element) {
      this._elementTitle =
        this._element.querySelector(`.${CLASS_TITLE_CARD_TEMPLATE}`);

      if (this._elementTitle) {
        this._elementTitle.textContent = this._name;

      } else this._interceptionError(92, 'generateCard', 'Card.ts')
    } else this._interceptionError(94, 'generateCard', 'Card.ts')

    this._deleteButton =
      this._element.querySelector(`.${CLASS_BUTTON_DELETE_CARD_TEMPLATE}`);

    this._elementImage =
      this._element.querySelector(`.${CLASS_IMAGE_CARD_TEMPLATE}`);

    this._likeButton =
      this._element.querySelector(`.${CLASS_BUTTON_LIKE_CARD_TEMPLATE}`);

    this._likeCountElement =
      this._element.querySelector(`.${CLASS_INFO_LIKE_CARD_TEMPLATE}`);

    this._setEventListeners();
    this.setLikes(this._likes);

    if (this._elementImage) {
      this._elementImage.src = this._link.toString();
      this._elementImage.alt = this._name;
    }

    if (this._ownerId !== this._userId && this._deleteButton)
      this._deleteButton.style.display = 'none';

    return this._element;
  };

  public deleteCard(this: Card): void | never {
    if (this._element) {
      this._element.remove();
      this._element = null;
    } else this._interceptionError(125, 'deleteCard', 'Card.ts')
  }

  public isLiked(this: Card): ILikes | undefined {
    return this._likes.find(user => user._id === this._userId);
  }

  public setLikes(newLikes: ILikes[]): void {
    this._likes = newLikes;

    if (this._likeCountElement)
      this._likeCountElement.textContent = this._likes.length.toString();

    this.isLiked() ? this._fillLike() : this._removeLike()
  }

  private _getTemplate = (): HTMLTemplateElement | never => {
    const {
      ID_SECTION_CARD_TEMPLATE, CLASS_ELEMENT_CARD_TEMPLATE
    } = this._configTemplateCard;

    this._elementCardTemplate =
      document.querySelector(`#${ID_SECTION_CARD_TEMPLATE}`);

    if (this._elementCardTemplate) {
      const elementCardTemplateContent = this._elementCardTemplate.content;

      if (elementCardTemplateContent) {
        this._elementCardElement =
          elementCardTemplateContent.querySelector(`.${CLASS_ELEMENT_CARD_TEMPLATE}`);

        if (this._elementCardElement) {
          return this._elementCardElement.cloneNode(true) as HTMLTemplateElement
        } else this._interceptionError(161, '_getTemplate', 'Card.ts')
      } else this._interceptionError(162, '_getTemplate', 'Card.ts')
    } else this._interceptionError(163, '_getTemplate', 'Card.ts')
  };

  private _setEventListeners(): void | never {
    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', () => {
        this._handleDeleteClick(this._id);
      });
    } else this._interceptionError(171, '_setEventListeners', 'Card.ts')

    if (this._likeButton) {
      this._likeButton.addEventListener('click', () => {
        this._handleLikeClick(this._id);
      });
    } else this._interceptionError(177, '_setEventListeners', 'Card.ts')

    if (this._elementImage) {
      this._elementImage.addEventListener('click', () => {
        this._handleImageClick();
      });
    } else this._interceptionError(183, '_setEventListeners', 'Card.ts')
  };

  private _fillLike(): void | never {
    const {CLASS_BUTTON_LIKE_CARD_TEMPLATE} = this._configTemplateCard;

    if (this._likeButton) {
      this._likeButton.classList.add(`${CLASS_BUTTON_LIKE_CARD_TEMPLATE}_active`);
    } else this._interceptionError(191, '_fillLike', 'Card.ts')
  };

  private _removeLike(): void | never {
    const {CLASS_BUTTON_LIKE_CARD_TEMPLATE} = this._configTemplateCard;

    if (this._likeButton) {
      this._likeButton.classList.remove(`${CLASS_BUTTON_LIKE_CARD_TEMPLATE}_active`);
    } else this._interceptionError(199, '_removeLike', 'Card.ts')
  };
}

export default Card;