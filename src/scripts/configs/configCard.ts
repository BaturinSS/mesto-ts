export interface IConfigCard {
  CLASS_TITLE_CARD: string;
  CLASS_BUTTON_DELETE_CARD: string;
  CLASS_IMAGE_CARD: string;
  CLASS_BUTTON_LIKE_CARD: string;
  CLASS_INFO_LIKE_CARD: string;
}

const configCard: IConfigCard = {
  CLASS_TITLE_CARD: "elements__title",
  CLASS_BUTTON_DELETE_CARD: "elements__delete",
  CLASS_IMAGE_CARD: "elements__mask-group",
  CLASS_BUTTON_LIKE_CARD: "elements__group",
  CLASS_INFO_LIKE_CARD: "elements__number-likes",
};

export default configCard;
