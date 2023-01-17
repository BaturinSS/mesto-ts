import "../pages/index.css";
import {Card} from "../scripts/components/Card";
import {FormValidator} from "../scripts/components/FormValidator";
import {Section} from "../scripts/components/Section";
import {PopupWithImage} from "../scripts/components/PopupWithImage";
import {PopupWithForm} from "../scripts/components/PopupWithForm";
import {PopupWithConfirm} from "../scripts/components/PopupWithConfirm";
import {UserInfo} from "../scripts/components/UserInfo";
import {config} from "../scripts/utils/configValidation";
import * as constants from "../scripts/utils/constants";
import {
  CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_AVATAR,
  CLASS_ELEMENT_FORM_ADD_CARD,
  CLASS_ELEMENT_FORM_EDIT_AVATAR,
  ID_ELEMENT_CARD_TEMPLATE
} from "../scripts/utils/constants";
import {api} from "../scripts/components/Api";

const formEditAvatar = document.querySelector(`.${CLASS_ELEMENT_FORM_EDIT_AVATAR}`);
const avatarOpenPopupButtonEdit = document.querySelector(`.${CLASS_ELEMENT_BUTTON_OPEN_POPUP_EDIT_AVATAR}`);
const formAddCard = document.querySelector(`.${CLASS_ELEMENT_FORM_ADD_CARD}`);

const formAddCardValidator = new FormValidator(config, formAddCard);

const formEditProfileValidator = new FormValidator(
  config,
  constants.formEditProfile
);

const formEditAvatarValidator = new FormValidator(
  config,
  formEditAvatar
);

const section = new Section(addCard, ".elements__cards");

const popupWithImage = new PopupWithImage(".popup_type_image-zoom");

const popupAddImage = new PopupWithForm(
  ".popup_type_card-add",
  submitAddCardForm,
  "Добавляем карточку..."
);
const popupEditProfile = new PopupWithForm(
  ".popup_type_profile-edit",
  submitEditProfileForm,
  "Сохраняем..."
);
const popupEditAvatar = new PopupWithForm(
  ".popup_type_avatar-edit",
  submitEditAvatarForm,
  "Меняем аватар..."
);

const popupDeleteCard = new PopupWithConfirm(
  ".popup_type_delete-confirm",
  "Удаляем карточку..."
);

const userInfo = new UserInfo({
  profileNameSelector: ".profile__name",
  profileJobSelector: ".profile__subtitle",
  avatarSelector: ".plofile__avatar",
});

const autoDate = () => {
  document.querySelector(
    ".footer__copyright"
  ).textContent = `© ${new Date().getFullYear()}. Батурин Сергей`;
};

let userId;

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

function submitEditAvatarForm({avatarUrl}) {
  return api.editAvatar(avatarUrl).then((res) => {
    userInfo.setUserInfo(res.name, res.about, res.avatar);
  });
}

function submitAddCardForm(data) {
  const createdSubmit = true;
  return api.addCard(data.cardTitle, data.cardLink).then((res) => {
    addCard(res, createdSubmit);
    deleteLastCard();
  });
}

function submitEditProfileForm({name, job}) {
  return api.editUserInfo(name, job).then((res) => {
    userInfo.setUserInfo(res.name, res.about, res.avatar);
  });
}

function deleteLastCard() {
  document.querySelector(".elements__cards").lastElementChild.remove();
}

function addCard(cardInfo, createdSubmit) {
  section.setItem(createCard(cardInfo), createdSubmit);
}

function createCard(cardInfo) {
  const card = new Card(
    cardInfo,
    ID_ELEMENT_CARD_TEMPLATE,
    () => {
      popupWithImage.open(cardInfo.name, cardInfo.link);
    },
    (id) => {
      popupDeleteCard.open();
      popupDeleteCard.changeSubmitHandler(() => {
        api
          .deleteCard(id)
          .then(() => {
            card.deleteCard();
            popupDeleteCard.close();
            api
              .getCards()
              .then((cardList) => {
                addCard(cardList[cardList.length - 1], false);
              })
              .catch((err) => {
                err.then((res) => {
                  alert(res.message);
                });
              });
          })
          .catch((err) => {
            err.then((res) => {
              alert(res.message);
            });
          })
          .finally(() => {
            popupDeleteCard.renderLoading(false);
          });
      });
    },
    userId,
    (id) => {
      if (card.isLiked()) {
        api
          .deleteLike(id)
          .then((res) => {
            card.setLikes(res.likes);
          })
          .catch((err) => {
            err.then((res) => {
              alert(res.message);
            });
          });
      } else {
        api
          .addLike(id)
          .then((res) => {
            card.setLikes(res.likes);
          })
          .catch((err) => {
            err.then((res) => {
              alert(res.message);
            });
          });
      }
    }
  );
  const cardElement = card.generateCard();
  return cardElement;
}

Promise.all([api.getUserInfo(), api.getCards()])
  .then(([userData, cards]) => {
    userInfo.setUserInfo(userData.name, userData.about, userData.avatar);
    userId = userData._id;
    section.rendererItems(cards);
  })
  .catch((err) => {
    err.then((res) => {
      alert(res.message);
    });
  });

constants.profileOpenPopupButtonEdit.addEventListener(
  "click",
  openEditProfilePopup
);
constants.profileOpenPopupButtonAdd.addEventListener(
  "click",
  openAddImagePopup
);
avatarOpenPopupButtonEdit.addEventListener(
  "click",
  openEditAvatarPopup
);

formAddCardValidator.enableValidation();
formEditProfileValidator.enableValidation();
formEditAvatarValidator.enableValidation();

popupWithImage.setEventListeners();
popupAddImage.setEventListeners();
popupEditProfile.setEventListeners();
popupDeleteCard.setEventListeners();
popupEditAvatar.setEventListeners();

autoDate();
