interface ILikes {
  about: string,
  avatar: URL,
  cohort: string,
  name: string,
  _id: string
}

interface IOwner extends ILikes {
}

interface ICardInfo {
  createdAt: Date,
  likes: ILikes[],
  link: URL,
  name: string,
  owner: IOwner,
  _id: string
}

type TFuncHandleClick = (id: string) => Promise<string>

interface ICardConstructor {
  cardInfo: ICardInfo,
  selectorTemplate: string,
  handleImageClick: () => void,
  handleDeleteClick: TFuncHandleClick,
  userId: string,
  handleLikeClick: TFuncHandleClick,
}

export class Card {
  private readonly _name: string;
  private readonly _link: URL;
  private readonly _likes: ILikes[];
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _ownerId: string;
  private readonly _selectorTemplate: string;
  private readonly _handleImageClick: () => void;
  private readonly _handleDeleteClick: TFuncHandleClick;
  private readonly _handleLikeClick: TFuncHandleClick;
  private _element!: Node;

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
      const elementTitle = this._element.querySelector('.elements__title')
        .textContent = this._name;
    }

    this._deleteButton = this._element.querySelector('.elements__delete');
    this._elementImage = this._element.querySelector('.elements__mask-group');
    this._likeButton = this._element.querySelector('.elements__group');
    this._likeCountElement = this._element.querySelector('.elements__number-likes');
    this._setEventListeners();
    this._elementImage.src = this._link;
    this._elementImage.alt = this._name;
    this.setLikes(this._likes);
    if (this._ownerId !== this._userId) {
      this._deleteButton.style.display = 'none';
    }

    return this._element;
  };

  public deleteCard() {
    this._element.remove();
    this._element = null;
  }

  public isLiked() {
    return this._likes.find(user => user._id === this._userId);
  }

  public setLikes(newLikes) {
    this._likes = newLikes;
    this._likeCountElement.textContent = this._likes.length;
    if (this.isLiked()) {
      this._fillLike()
    } else {
      this._removeLike();
    }
  }

  private _getTemplate = (): Node => {
    const elementCardTemplate: HTMLTemplateElement | null =
      document.querySelector(`#${this._selectorTemplate}`);

    if (elementCardTemplate) {
      const elementCardTemplateContent = elementCardTemplate.content;

      if (elementCardTemplateContent) {
        const elementCardElement: HTMLTemplateElement | null =
          elementCardTemplateContent.querySelector('.elements__element');

        if (elementCardElement) {
          return elementCardElement.cloneNode(true)
        } else throw new Error('No clone element card')
      } else throw new Error('No elements in template card')
    } else throw new Error('No template card')
  };

  private _setEventListeners() {
    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._id);
    });
    this._likeButton.addEventListener('click', () => this._handleLikeClick(this._id));
    this._elementImage.addEventListener('click', () => this._handleImageClick());
  };

  private _fillLike() {
    this._likeButton.classList.add('elements__group_active');
  };

  private _removeLike() {
    this._likeButton.classList.remove('elements__group_active');
  };
}