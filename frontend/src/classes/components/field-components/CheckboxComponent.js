import FieldComponent from './FieldComponent.js'

export default class CheckboxComponent extends FieldComponent {

  constructor(parent, fieldName, label, value=false) {
    const wrapper = $('<div class="checkbox-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, undefined, false);
    this.name = "checkbox-" + fieldName;
    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.input = $('<input type="checkbox" disabled="true"/>');

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.input);

    const comp = this;
    dom.input.on('focus', () => comp.onFocus());
    dom.input.on('blur', () => comp.onBlur());
    dom.input.on('change', () => comp.onChange());
  }

  updateDOM() {
    const dom = this.dom;
    dom.input.prop('checked', Boolean(this.value));

    super.updateDOM();
  }

  onChange() {
    this.value = this.dom.input.is(":checked");
    super.onChange();
  }

  startEditing(recurseDown = true, recurseUp = true) {
    this.dom.input.attr("disabled", false);
    super.startEditing(recurseDown, recurseUp);
  }

  stopEditing(recurseDown = true, recurseUp = true) {
    super.stopEditing(recurseDown, recurseUp);
    this.dom.input.attr("disabled", true);
  }
}