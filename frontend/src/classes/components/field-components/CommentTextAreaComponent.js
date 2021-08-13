import FieldComponent from './FieldComponent.js'

export default class CommentTextAreaComponent extends FieldComponent {

  constructor(parent, fieldName, value, placeholder, allowFeedback=true) {
    const wrapper = $('<div class="comment-text-area-wrapper"></div>');
    super(wrapper, parent, fieldName, undefined, undefined, placeholder, allowFeedback);
    this.name = "comment-area-" + fieldName;
    this.populate();
    this.value = value;
    this.updateDOM();
    this.onBlur();
  }

  get value() {
    if (this.hasPopulated) {
      if (this.dom.input.hasClass('no-value')){
        return "";
      }
      return this.dom.input.html();
    }
    return "";
  }

  set value(x){
    if (this.hasPopulated){
      if (x || this.focused){
        this.dom.input.removeClass("no-value");
        this.dom.input.html(x);
      }else{
        this.dom.input.addClass("no-value");
        this.dom.input.html(this.placeholder);
      }
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.input = $('<div class="comment-text-area"/>');
    dom.feedback = this.userMessage.getWrapper();

    dom.wrapper.append(dom.content);
    dom.content.append(dom.input)

    if (this.allowFeedback) {
      dom.content.append(dom.feedback);
    }

    const comp = this;
    dom.input.on('focus', () => comp.onFocus());
    dom.input.on('blur', () => comp.onBlur());
    dom.input.on('input', () => comp.onChange());
  }

  updateDOM() {
    super.updateDOM();
  }

  onFocus(){
    super.onFocus();
    const dom = this.dom;
    if (dom.input.hasClass("no-value")){
      dom.input.removeClass("no-value");
      dom.input.html("");
    }
    this.updateDOM();
  }

  onBlur() {
    super.onBlur();
    const dom = this.dom;
    if (!this.value) {
      dom.input.addClass("no-value");
      dom.input.html(this.placeholder);
    }
    this.updateDOM();
  }

  onChange() {
    super.onChange();
    this.updateDOM();
  }

  focus(){
    const div = this.dom.input.get(0);
    setTimeout(() => div.focus(), 0);
  }

  startEditing(recurseDown = true, recurseUp = true) {
    super.startEditing(recurseDown, recurseUp);
    this.dom.input.attr("contenteditable", true);
  }

  stopEditing(recurseDown = true, recurseUp = true) {
    super.stopEditing(recurseDown, recurseUp);
    this.dom.input.attr("contenteditable", false);
  }
}