import FieldComponent from './FieldComponent.js'
import { timeOfDayFromSeconds, timeOfDayToSeconds } from '../../../utilities/time.js'

export default class TimeInputComponent extends FieldComponent {

  constructor(parent, fieldName, label, value, placeholder, allowFeedback=true) {
    /* value is a time of day, represented by the number of seconds since midnight */
    const wrapper = $('<div class="time-input-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "time-input-" + fieldName;

    this.populate();
    this.updateDOM();
  }

  setTimeInSeconds(secondsSinceMidnight){
    this.value = secondsSinceMidnight;
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.input = $('<input type="time" readonly="true"/>');
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.input)
    if (this.allowFeedback) {
      dom.content.append(dom.feedback);
    }

    const comp = this;
    dom.input.on('focus', () => comp.onFocus());
    dom.input.on('blur', () => comp.onBlur());
    dom.input.on('change input', () => comp.onChange());
  }

  updateDOM() {
    super.updateDOM();
    const dom = this.dom;
    if (this.value !== undefined){
      dom.input.val(timeOfDayFromSeconds(this.value));
    }else{
      dom.input.val("");
    }
  }

  onChange(){
    try {
      this.value = timeOfDayToSeconds(this.dom.input.val());
    } catch (e) {
      console.log(e);
      this.value = undefined;
    }
    super.onChange();
  }

  startEditing(recurseDown = true, recurseUp = true) {
    super.startEditing(recurseDown, recurseUp);
    this.dom.input.prop('readonly', '');
  }

  stopEditing(recurseDown = true, recurseUp = true) {
    super.stopEditing(recurseDown, recurseUp);
    this.dom.input.prop('readonly', 'true');
  }
}