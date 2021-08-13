import { Message } from '../../../utilities/enums.js';
import EditableComponent from '../EditableComponent.js'
import FeedbackComponent from '../FeedbackComponent.js'

export default class FieldComponent extends EditableComponent {

  constructor(wrapper, parent, fieldName, label, value, placeholder, allowFeedback=true) {
    super(wrapper, parent);
    this.name = "field-component"

    this.label = label;

    this.protected_value = value;

    this.fieldName = fieldName;

    this.placeholder = placeholder;

    this.focused = false;

    this.disabled = false;

    this.allowFeedback = allowFeedback;
    this.userMessage = new FeedbackComponent();
  }

  get value(){
    return this.protected_value;
  }
  set value(x){
    this.protected_value = x;
  }

  onFocus(){
    this.focused = true;
    this.clearMessage();
    if (this.parent) {
      this.messageParent(Message.FOCUS);
    }
  }

  onBlur() {
    this.focused = false;
    this.clearMessage();
    if (this.parent) {
      this.messageParent(Message.BLUR);
    }
  }
  
  onChange(){
    this.clearMessage();
    if (this.parent){
      this.messageParent(Message.CHANGE);
    }
  }

  showMessage(msg) {
    this.userMessage.showMessage(msg);
  }

  showSuccessMessage(msg){
    this.userMessage.showSuccessMessage(msg);
  }

  showErrorMessage(msg) {
    this.userMessage.showErrorMessage(msg);
  }

  clearMessage(){
    this.userMessage.clearMessage();
  }

  populate() {
    super.populate();
  }

  updateDOM() {
    super.updateDOM();
    if (this.dom.label) {
      this.dom.label.html(this.label);
    }
  }

  startEditing(recurseDown = true, recurseUp = true) {
    super.startEditing(recurseDown, recurseUp);
  }

  stopEditing(recurseDown = true, recurseUp = true) {
    super.stopEditing(recurseDown, recurseUp);
  }

  greyOut() {
    if (!this.disabled){
      this.wrapper.addClass('greyed-out');
    }
  }

  ungreyOut() {
    this.wrapper.removeClass('greyed-out');
  }
}
