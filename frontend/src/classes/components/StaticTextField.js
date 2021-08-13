import Component from "./Component"

export default class StaticTextField extends Component {

  constructor(parent, label, value) {
    const wrapper = $('<div class="text-input-wrapper"></div>');
    super(wrapper, parent);
    this.name = "static-text";

    this.label = label;
    this.value = value;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.display = $('<span class="text-input-display"></span>');

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.display);
  }

  updateDOM() {
    super.updateDOM();
    this.dom.display.html(this.value);
  }
}