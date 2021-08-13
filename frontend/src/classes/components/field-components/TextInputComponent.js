import FieldComponent from './FieldComponent.js'

export default class TextInputComponent extends FieldComponent {

  constructor(parent, fieldName, label, value="", placeholder, allowFeedback=true, maxLength, pattern) {
    const wrapper = $('<div class="text-input-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "text-input-" + fieldName;

    this.maxLength = maxLength;
    this.pattern = pattern;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.display = $('<span class="text-input-display"></span>');
    dom.input = $('<input type="text"/>');
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.input).append(dom.display);
    if(this.allowFeedback){
      dom.content.append(dom.feedback);
    }

    if(this.maxLength){
      dom.input.prop('maxlength', this.maxLength);
      dom.input.prop('size', this.maxLength);
    }
    if (this.pattern){
      dom.input.prop('pattern', this.pattern);
    }

    const comp = this;
    dom.input.on('focus', () => comp.onFocus());
    dom.input.on('blur', () => comp.onBlur());
    dom.input.on('change input', () => comp.onChange());
  }

  updateDOM() {
    const dom = this.dom;
    dom.input.prop('placeholder', this.placeholder);
    dom.input.val(this.value);

    if (this.value) {
      this.dom.display.removeClass("no-value").html(this.value);
    } else {
      this.dom.display.addClass("no-value").html(this.placeholder);
    }

    super.updateDOM();
  }

  onChange() {
    this.value = this.dom.input.val();
    super.onChange();
  }
}