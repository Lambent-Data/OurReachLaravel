import FieldComponent from "./FieldComponent";

export default class LabelledFieldWrapper extends FieldComponent {

  constructor(parent, fieldName, label, allowFeedback=true) {
    const wrapper = $('<div class="labelled-field-wrapper"></div>');
    super(wrapper, parent, fieldName, label, undefined, undefined, allowFeedback);
    this.name = "field-wrapper-" + fieldName;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.main = $('<div style="display:flex; align-items:center;"></div>');
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.main);
    if(this.allowFeedback){
      dom.content.append(dom.feedback);
    }
  }
  
  getMainDiv(){
    return this.dom.main;
  }
}