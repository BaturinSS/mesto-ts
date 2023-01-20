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

interface ICardInfo {
  createdAt: Date,
  likes: ILikes[],
  link: URL,
  name: string,
  owner: IOwner,
  _id: string
}

type TFuncHandleClick = (id: string) => void

interface ICardConstructor {
  cardInfo: ICardInfo,
  selectorTemplate: string,
  handleImageClick: () => void,
  handleDeleteClick: TFuncHandleClick,
  userId: string,
  handleLikeClick: TFuncHandleClick,
}

class Card {
  private readonly _name: string;
  private readonly _link: URL;
  private _likes: ILikes[];
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _ownerId: string;
  private readonly _selectorTemplate: string;
  private readonly _handleImageClick: () => void;
  private readonly _handleDeleteClick: TFuncHandleClick;
  private readonly _handleLikeClick: TFuncHandleClick;
  private _element: HTMLTemplateElement | null = null;
  private _elementTitle: HTMLTitleElement | null = null;
  private _deleteButton: HTMLButtonElement | null = null;
  private _elementImage: HTMLImageElement | null = null;
  private _likeButton: HTMLButtonElement | null = null;
  private _likeCountElement: HTMLSpanElement | null = null;
  private _elementCardTemplate: HTMLTemplateElement | null = null;
  private _elementCardElement: HTMLLIElement | null = null;

  constructor({cardInfo, selectorTemplate, handleImageClick, handleDeleteClick, userId, handleLikeClick}
                : ICardConstructor) {
    this._name = cardInfo.name;
    this._link = cardInfo.link;
    this._likes = cardInfo.likes;
    this._id = cardInfo._id;
    this._userId = userId;
    this._ownerId = cardInfo.owner._id;
    this._selectorTemplate = selectorTemplate;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  };

  public generateCard = () => {
    this._element = this._getTemplate();

    if (this._element) {
      this._elementTitle = this._element.querySelector('.elements__title');

      if (this._elementTitle) {
        this._elementTitle.textContent = this._name;

      } else throw new Error('No element in template card "title".')
    } else throw new Error('No element in template card.')

    this._deleteButton = this._element.querySelector('.elements__delete');
    this._elementImage = this._element.querySelector('.elements__mask-group');
    this._likeButton = this._element.querySelector('.elements__group');
    this._likeCountElement = this._element.querySelector('.elements__number-likes');
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

  public deleteCard(this: Card): void {
    if (this._element) {
      this._element.remove();
      this._element = null;
    } else throw new Error('No element Card')
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

  private _getTemplate = (): HTMLTemplateElement => {
    this._elementCardTemplate =
      document.querySelector(`#${this._selectorTemplate}`);

    if (this._elementCardTemplate) {
      const elementCardTemplateContent = this._elementCardTemplate.content;

      if (elementCardTemplateContent) {
        this._elementCardElement =
          elementCardTemplateContent.querySelector('.elements__element');

        if (this._elementCardElement) {
          return this._elementCardElement.cloneNode(true) as HTMLTemplateElement
        } else throw new Error('No clone element card')
      } else throw new Error('No elements in template card')
    } else throw new Error('No template card')
  };

  private _setEventListeners(): void {
    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', () => {
        this._handleDeleteClick(this._id);
      });
    } else throw new Error('No element delete button');

    if (this._likeButton) {
      this._likeButton.addEventListener('click', () => {
        this._handleLikeClick(this._id);
      });
    } else throw new Error('No element like button');

    if (this._elementImage) {
      this._elementImage.addEventListener('click', () => {
        this._handleImageClick();
      });
    } else throw new Error('No element image');
  };

  private _fillLike(): void {
    if (this._likeButton) {
      this._likeButton.classList.add('elements__group_active');
    } else throw  new Error('No element button like');
  };

  private _removeLike(): void {
    if (this._likeButton) {
      this._likeButton.classList.remove('elements__group_active');
    } else throw new Error('No element button like');
  };
}

export default Card;