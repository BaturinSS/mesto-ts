export interface IConfigTemplateCard {
  ID_SECTION_CARD_TEMPLATE: string,
  CLASS_ELEMENT_CARD_TEMPLATE: string,
  CLASS_TITLE_CARD_TEMPLATE: string,
  CLASS_BUTTON_DELETE_CARD_TEMPLATE: string,
  CLASS_IMAGE_CARD_TEMPLATE: string,
  CLASS_BUTTON_LIKE_CARD_TEMPLATE: string,
  CLASS_INFO_LIKE_CARD_TEMPLATE: string
}

const configTemplateCard: IConfigTemplateCard = {
  ID_SECTION_CARD_TEMPLATE: 'elements-template',
  CLASS_ELEMENT_CARD_TEMPLATE: 'elements__element',
  CLASS_TITLE_CARD_TEMPLATE: 'elements__title',
  CLASS_BUTTON_DELETE_CARD_TEMPLATE: 'elements__delete',
  CLASS_IMAGE_CARD_TEMPLATE: 'elements__mask-group',
  CLASS_BUTTON_LIKE_CARD_TEMPLATE: 'elements__group',
  CLASS_INFO_LIKE_CARD_TEMPLATE: 'elements__number-likes'
};

export default configTemplateCard;