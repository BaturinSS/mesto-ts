import { IConfigCardTemplate } from "../configs/configCardTemplate";
import { TInterceptionError } from "../utils/utils";

class CardTemplate {
  protected readonly _interceptionError!: TInterceptionError;
  private readonly _elementCardTemplate: HTMLTemplateElement | null = null;
  private readonly _elementCardElement: HTMLLIElement | null = null;

  constructor(configCardTemplate: IConfigCardTemplate) {
    const { ID_SECTION_CARD_TEMPLATE, CLASS_ELEMENT_CARD_TEMPLATE } =
      configCardTemplate;

    this._elementCardTemplate = document.querySelector(
      `#${ID_SECTION_CARD_TEMPLATE}`
    );

    if (this._elementCardTemplate) {
      const elementCardTemplateContent = this._elementCardTemplate.content;

      if (elementCardTemplateContent) {
        this._elementCardElement = elementCardTemplateContent.querySelector(
          `.${CLASS_ELEMENT_CARD_TEMPLATE}`
        );
      }
    }
  }

  _getTemplate = (): HTMLTemplateElement | never => {
    if (this._elementCardElement) {
      return this._elementCardElement.cloneNode(true) as HTMLTemplateElement;
    } else {
      this._interceptionError(31, "_getTemplate", "CardTemplate.ts");
    }
  };
}

export default CardTemplate;
