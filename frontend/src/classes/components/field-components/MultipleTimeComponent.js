import FieldComponent from './FieldComponent.js'
import DateInputComponent from './DateInputComponent.js'
import TimeInputComponent from './TimeInputComponent.js'
import { Message } from '../../../utilities/enums.js'

export default class MultipleTimeComponent extends FieldComponent {
  /* value should be a an array of times-of days, represented as a number in seconds since midnight */
  constructor(parent, fieldName, label, value = [], placeholder, allowFeedback=true) {
    const wrapper = $('<div class="multi-time-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "multi-time-" + fieldName;

    this.populate();
    this.value = value;
    this.updateDOM();
  }

  set value(times) {
    if (this.hasPopulated){

    }
  }

  get value() {
    const out = [];
    for (timeInput of this.editableComponents.timeInputs){
      out.push_back(timeInput.value);
    }
    return out;
  }

  addTimeInput(val){
    const num = this.editableComponents.timeInputs.length;
    this.editableComponents.timeInputs.push_back(new TimeInputComponent(this, 'time-input-' + num, undefined, val, this.placeholder, false));
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.datebytime = $('<div class="date-time-content"></div>');
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    this.editableComponents.date = new DateInputComponent(this, "date", undefined, undefined, this.placeholder.date, false);
    dom.date = this.editableComponents.date.getWrapper();
    dom.datebytime.append(dom.date);

    dom.datebytime.append('<span>&nbsp;' + this.connectorText + '&nbsp;</span>');

    this.editableComponents.time = new TimeInputComponent(this, "time", undefined, undefined, this.placeholder.time, false);
    dom.time = this.editableComponents.time.getWrapper();
    dom.datebytime.append(dom.time);

    dom.wrapper.append(dom.content);
    dom.content.append(dom.datebytime);
    if (this.allowFeedback) {
      dom.content.append(dom.feedback);
    }
  }

  updateDOM(){
    super.updateDOM();
    this.editableComponents.date.updateDOM();
    this.editableComponents.time.updateDOM();
  }


  handleMessage(id, msg, data) {
    switch (id) {
      case this.editableComponents.date.id:
      case this.editableComponents.time.id:
        if (msg == Message.CHANGE) {
          this.onChange();
        }
    }
  }
}