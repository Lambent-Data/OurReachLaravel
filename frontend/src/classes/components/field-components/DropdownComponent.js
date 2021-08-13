import FieldComponent from './FieldComponent.js'

export default class DropdownComponent extends FieldComponent {

  constructor(parent, fieldName, label, value, options,  optionValues, placeholder = "Select one", allowFeedback = true) {
    const wrapper = $('<div class="dropdown-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "dropdown-" + fieldName;

    this.setOptions(options, optionValues);
    this.selectedIndex = -1;

    this.populate();
    this.value = value;
    this.updateDOM();
  }

  get value() {
    if (this.hasPopulated){
      if (this.selectedIndex >= 0){
        return this.optionValues[this.selectedIndex];
      }
      return undefined;
    }
  }

  set value(x) {
    if (x != null && x != undefined && this.optionValues){
      this.selectedIndex = this.optionValues.indexOf(x.toString());
    }else{
      this.selectedIndex = -1;
    }
    this.updateDOM();
  }

  get text() {
    if (this.hasPopulated) {
      if (this.selectedIndex >= 0) {
        return this.options[this.selectedIndex];
      }
      return undefined;
    }
  }

  set text(text) {
    if (this.options) {
      console.log(text, this.options)
      this.selectedIndex = this.options.indexOf(text);
      this.updateDOM();
    }
  }

  setOptions(options, optionValues){
    options = options.map(x => x.toString());
    this.options = options;
    if (optionValues && optionValues.length == options.length) {
      this.optionValues = optionValues.map(x => x.toString());
    } else {
      this.optionValues = [...Array(options.length).keys()].map(x => x.toString());
    }
    if(this.options.length == 0){
      this.disabled = true;
    }else{
      this.disabled = false;
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.display = $('<span class="dropdown-display"></span>');
    dom.select = $('<select></select>');
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content)
    dom.content.append(dom.select).append(dom.display);
    if (this.allowFeedback) {
      dom.content.append(dom.feedback);
    }

    const comp = this;
    dom.select.on('focus', () => comp.onFocus());
    dom.select.on('blur', () => comp.onBlur());
    dom.select.on('change', () => comp.onChange());
  }

  onChange(){
    this.selectedIndex = this.optionValues.indexOf(this.dom.select.find(":selected").val());
    super.onChange();
  }

  updateDOM() {
    super.updateDOM();
    const dom = this.dom;

    if (this.value) {
      dom.display.removeClass("no-value");
      dom.display.html(this.text);
    } else {
      dom.display.addClass("no-value");
      dom.display.html(this.placeholder);
    }

    dom.select.empty();
    if (this.placeholder && !this.value) {
      const elem = $('<option value="NULL" selected="true" disabled="disabled"></option>');
      elem.html(this.placeholder);
      dom.select.append(elem);
    }
    for (let i = 0; i < this.options.length; i++) {
      const elem = $('<option value="' + this.optionValues[i] + '"></option>');
      elem.html(this.options[i]);
      dom.select.append(elem);
    }

    if (this.selectedIndex >= 0) {
      dom.select.val(this.optionValues[this.selectedIndex]);
    }

    this.dom.select.prop('disabled', this.disabled);
  }

  disable(){
    this.disabled = true;
    this.ungreyOut();
    if (this.hasPopulated){
      this.dom.select.prop('disabled', this.disabled);
    }
  }

  enable(){
    this.disabled = false;
    if (this.hasPopulated) {
      this.dom.select.prop('disabled', this.disabled);
    }
  }

  startEditing(recurseDown = true, recurseUp = true) {
    super.startEditing(recurseDown, recurseUp);
    this.updateDOM();
  }

  stopEditing(recurseDown = true, recurseUp = true) {
    super.stopEditing(recurseDown, recurseUp);
    this.updateDOM();
  }
}