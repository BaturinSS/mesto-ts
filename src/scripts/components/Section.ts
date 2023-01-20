import {ICardInfo} from "./Card";
import {IAddCard} from '../../pages/index';

interface IConstructorsSection {
  funcRenderer: (data: IAddCard) => void
  containerClass: string
}

export interface ISetItemArgs {
  element: HTMLTemplateElement,
  isCreatedSubmit: boolean
}

class Section {
  private readonly _renderer: (data: IAddCard) => void;
  private readonly _containerOrNull: HTMLUListElement | null;
  private readonly _container!: HTMLUListElement;

  constructor({funcRenderer, containerClass}: IConstructorsSection) {
    this._renderer = funcRenderer;

    this._containerOrNull = document.querySelector(`.${containerClass}`);
    if (this._containerOrNull) {
      this._container = this._containerOrNull;
    } else throw new Error('No container element')
  };

  rendererItems(initialArray: ICardInfo[]): void {
    initialArray.forEach((cardInfo) => {
      this._renderer({
        cardInfo: cardInfo,
        isCreatedSubmit: false
      });
    });
  };

  setItem({element, isCreatedSubmit}: ISetItemArgs): void {
    isCreatedSubmit
      ? this._container.prepend(element)
      : this._container.append(element)
  };
}

export default Section;