export class Section {
  constructor(renderer, containerSelector) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
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
};