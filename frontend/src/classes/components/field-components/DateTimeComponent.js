import FieldComponent from './FieldComponent.js'
import DateInputComponent from './DateInputComponent.js'
import TimeInputComponent from './TimeInputComponent.js'
import { DateTime } from 'luxon'
import { Message } from '../../../utilities/enums.js'

export default class DateTimeComponent extends FieldComponent {
  /* value should be a js Date object */
  constructor(parent, fieldName, label, value, placeholder = {date: "MM-DD-YYYY", time:"00:00"}, connectorText = "at", allowFeedback=true) {
    const wrapper = $('<div class="date-time-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "date-time-" + fieldName;
    this.connectorText = connectorText;

    this.populate();
    this.value = value;
    this.updateDOM();
  }

  set value(dt) {
    if (dt && this.hasPopulated){
      this.editableComponents.time.value = dt.hour * 3600 + dt.minute * 60 + dt.second;
      this.editableComponents.date.value = dt.startOf('day');
    }
  }

  get value() {
    const dt = this.editableComponents.date.value.startOf('day');
    return dt.plus({ seconds: this.editableComponents.time.value });
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
      dom.label = $('<span class="field-label"></span>');
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    this.editableComponents.date = new DateInputComponent(this, "date", undefined, undefined, this.placeholder.date, false);
    dom.date = this.editableComponents.date.getWrapper();
    dom.datebytime.append(dom.date);

    dom.datebytime.append('<span>&nbsp;' + this.connectorText + '</span>');

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