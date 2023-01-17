export class Card {
  constructor(cardInfo, selectorTemplate, handleImageClick, handleDeleteClick, userId, handleLikeClick) {
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

  _getTemplate() {
    const elementCard = document
      .querySelector(`#${this._selectorTemplate}`)
      .content
      .querySelector('.elements__element')
      .cloneNode(true);
    return elementCard;
  };

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector('.elements__title').textContent = this._name;
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

  _setEventListeners() {
    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._id);
    });
    this._likeButton.addEventListener('click', () => this._handleLikeClick(this._id));
    this._elementImage.addEventListener('click', () => this._handleImageClick());
  };

  deleteCard() {
    this._element.remove();
    this._element = null;
  }

  _fillLike() {
    this._likeButton.classList.add('elements__group_active');
  };

  _removeLike() {
    this._likeButton.classList.remove('elements__group_active');
  };

  isLiked() {
    return this._likes.find(user => user._id === this._userId);
  }

  setLikes(newLikes) {
    this._likes = newLikes;
    this._likeCountElement.textContent = this._likes.length;
    if (this.isLiked()) {
      this._fillLike()
    } else {
      this._removeLike();
    }
  }
}