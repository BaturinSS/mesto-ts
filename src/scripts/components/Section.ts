interface IConstructorsSection {
  funcRenderer: () => void
  containerClass: string
}

class Section {
  constructor({funcRenderer, containerClass}) {
    this._renderer = funcRenderer;
    this._container = document.querySelector(`.${containerClass}`);
  };

  rendererItems(initialArray) {
    initialArray.forEach((item) => {
      this._renderer(item);
    });
  };

  setItem(element, createdSubmit) {
    createdSubmit
      ? this._container.prepend(element)
      : this._container.append(element)
  };
}

export default Section;