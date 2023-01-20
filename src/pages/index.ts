import "../pages/index.css";
import Card, {ICardInfo, IDataUser} from "../scripts/components/Card";
import FormValidator from "../scripts/components/FormValidator";
import Section from "../scripts/components/Section";
import PopupWithImage from "../scripts/components/PopupWithImage";
import PopupWithForm from "../scripts/components/PopupWithForm";
import PopupWithConfirm from "../scripts/components/PopupWithConfirm";
import UserInfo from "../scripts/components/UserInfo";
import configValidation from "../scripts/utils/configValidation";
import Api from "../scripts/components/Api";
import {
  CLASS_ELEMENT_BUTTON_OPEN_POPUP_ADD_CARD,
  CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_AVATAR,
  CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_PROFILE,
  CLASS_ELEMENT_FORM_ADD_CARD,
  CLASS_ELEMENT_FORM_EDIT_AVATAR,
  CLASS_ELEMENT_FORM_EDIT_PROFILE,
  ID_SECTION_CARD_TEMPLATE
} from "../scripts/utils/constants";
import {IConstructorPopupFull} from "../scripts/components/Popup";

export const api = new Api({
  baseUrl: new URL('https://mesto.nomoreparties.co/v1/cohort-39'),
  headers: {
    'authorization': 'ef26a870-ce14-4ae0-b138-67948bcf24ea',
    'Content-Type': 'application/json'
  }
});

const profileOpenPopupButtonEdit: HTMLButtonElement | null =
  document.querySelector(`.${CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_PROFILE}`);

const avatarOpenPopupButtonEdit: HTMLButtonElement | null =
  document.querySelector(`.${CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_AVATAR}`);

const profileOpenPopupButtonAdd: HTMLButtonElement | null =
  document.querySelector(`.${CLASS_ELEMENT_BUTTON_OPEN_POPUP_ADD_CARD}`);

const formAddCardValidator = new FormValidator({
  formData: configValidation,
  classPopup: CLASS_ELEMENT_FORM_ADD_CARD
});

const formEditProfileValidator = new FormValidator({
  formData: configValidation,
  classPopup: CLASS_ELEMENT_FORM_EDIT_PROFILE
});

const formEditAvatarValidator = new FormValidator({
  formData: configValidation,
  classPopup: CLASS_ELEMENT_FORM_EDIT_AVATAR
});

const section = new Section({
  funcRenderer: addCard,
  containerClass: "elements__cards"
});

const popupWithImage = new PopupWithImage({
  popupClass: "popup_type_image-zoom"
});

const popupAddImage = new PopupWithForm(<IConstructorPopupFull>{
  popupClass: "popup_type_card-add",
  handleSubmit: submitAddCardForm,
  titleButton: "Добавляем карточку..."
});

const popupEditProfile = new PopupWithForm(<IConstructorPopupFull>{
  popupClass: "popup_type_profile-edit",
  handleSubmit: submitEditProfileForm,
  titleButton: "Сохраняем..."
});

const popupEditAvatar = new PopupWithForm(<IConstructorPopupFull>{
  popupClass: "popup_type_avatar-edit",
  handleSubmit: submitEditAvatarForm,
  titleButton: "Меняем аватар..."
});

const popupDeleteCard = new PopupWithConfirm({
  popupClass: "popup_type_delete-confirm",
  titleButton: "Удаляем карточку..."
});

const userInfo = new UserInfo({
  classProfileName: "profile__name",
  classProfileAbout: "profile__subtitle",
  classProfileAvatar: "profile__avatar",
});

function autoDate(): void {
  const elementCopyright: HTMLSpanElement | null = document.querySelector(".footer__copyright");
  if (elementCopyright) {
    elementCopyright.textContent = `© 2022 - ${new Date().getFullYear()}. Батурин Сергей`;
  } else throw new Error('No element "footer__copyright"')
}

let userId: string;

function openEditProfilePopup() {
  popupEditProfile.setInputValues(userInfo.getUserInfo());
  formEditProfileValidator.clearErrorsForm();
  popupEditProfile.open();
}

function openAddImagePopup() {
  formAddCardValidator.clearErrorsForm();
  popupAddImage.open();
}

function openEditAvatarPopup() {
  formEditAvatarValidator.clearErrorsForm();
  popupEditAvatar.open();
}

function submitEditAvatarForm(dataUser: IDataUser): Promise<void> {
  return api
    .editAvatar(dataUser)
    .then((dataUserNew) => {
      userInfo.setUserInfo(dataUserNew);
    });
}

function submitAddCardForm(cardInfo: ICardInfo): Promise<void> {
  return api
    .addCard(cardInfo)
    .then((res) => {
      addCard({
        cardInfo: res,
        isCreatedSubmit: true
      });
      deleteLastCard();
    });
}

function submitEditProfileForm(dataUser: IDataUser) {
  return api
    .editUserInfo(dataUser)
    .then((dataUserNew: IDataUser) => {
      userInfo.setUserInfo(dataUserNew);
    });
}

function deleteLastCard() {
  const elementList: HTMLUListElement | null =
    document.querySelector(".elements__cards");
  if (elementList) {
    const lastElement: Element | null = elementList.lastElementChild;
    if (lastElement) lastElement.remove();
  } else throw new Error('No element last in elementList "elements__cards"')
}

export interface IAddCard {
  cardInfo: ICardInfo,
  isCreatedSubmit: boolean
}

function addCard({cardInfo, isCreatedSubmit}: IAddCard) {
  section.setItem({
    element: createCard(cardInfo),
    isCreatedSubmit: isCreatedSubmit
  });
}

function createCard(cardInfo: ICardInfo): HTMLTemplateElement {
  const card = new Card({
      cardInfo: cardInfo,
      idTemplate: ID_SECTION_CARD_TEMPLATE,
      handleImageClick: (): void => {
        popupWithImage.open(cardInfo);
      },
      handleDeleteClick: (id: string) => {
        popupDeleteCard.open();
        popupDeleteCard.changeSubmitHandler(() => {
          api
            .deleteCard(id)
            .then(() => {
              card.deleteCard();
              popupDeleteCard.close();
              api
                .getCards()
                .then((cardList: ICardInfo[]) => {
                  addCard({
                    cardInfo: cardList[cardList.length - 1],
                    isCreatedSubmit: false
                  });
                })
                .catch(outputError)
            })
            .catch(outputError)
            .finally(() => {
              popupDeleteCard.renderLoading({isLoading: false});
            });
        });
      },
      userId: userId,
      handleLikeClick: (id) => {
        if (card.isLiked()) {
          api
            .deleteLike(id)
            .then((res: ICardInfo) => {
              card.setLikes(res.likes);
            })
            .catch(outputError)
        } else {
          api
            .addLike(id)
            .then(({likes}) => {
              card.setLikes(likes);
            })
            .catch(outputError)
        }
      }
    }
  );
  return card.generateCard();
}

Promise.all([api.getCurrentUserInfo(), api.getCards()])
  .then(([dataUser, cards]) => {
    userInfo.setUserInfo(dataUser);
    userId = dataUser._id;
    section.rendererItems(cards);
  })
  .catch(outputError)

function outputError(err: unknown): void {
  if (err instanceof Error) {
    console.log(err.message);
  } else console.log(err)
}

if (profileOpenPopupButtonEdit) {
  profileOpenPopupButtonEdit.addEventListener(
    "click",
    openEditProfilePopup
  );
} else throw new Error('No element about edit button')

if (profileOpenPopupButtonAdd) {
  profileOpenPopupButtonAdd.addEventListener(
    "click",
    openAddImagePopup
  );
} else throw new Error('No element card add button')

if (avatarOpenPopupButtonEdit) {
  avatarOpenPopupButtonEdit.addEventListener(
    "click",
    openEditAvatarPopup
  );
} else throw new Error('No element avatar edit button')

formAddCardValidator.enableValidation();
formEditProfileValidator.enableValidation();
formEditAvatarValidator.enableValidation();

popupWithImage.setEventListeners();
popupAddImage.setEventListeners();
popupEditProfile.setEventListeners();
popupDeleteCard.setEventListeners();
popupEditAvatar.setEventListeners();

autoDate();
