import FieldComponent from './FieldComponent.js'
import Datepicker from 'vanillajs-datepicker/Datepicker';
import { DateTime } from 'luxon'

// Api: https://mymth.github.io/vanillajs-datepicker/

export default class DateInputComponent extends FieldComponent {

  constructor(parent, fieldName, label, value, placeholder = "MM-DD-YYYY", allowFeedback = true, luxonFormat = "DD, MM d, yyyy") {
    const wrapper = $('<div class="date-input-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, placeholder, allowFeedback);
    this.name = "date-input-" + fieldName;

    this.datepicker = undefined;
    this.dateValue = value;
    this.dateFormat = luxonFormat;

    this.populate();
    this.updateDOM();
  }

  get value(){
    return this.dateValue;
  }
  set value(x){
    // x is Luxon DateTime, or undefined
    this.dateValue = x;
    if (this.hasPopulated){
      this.updateDOM();
    }
  }
  
  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.display = $('<span class="date-input-display"></span>');
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
    if (this.allowFeedback){
      dom.content.append(dom.feedback);
    }

    dom.input.prop('placeholder', this.placeholder);


    this.datepicker = new Datepicker(dom.input[0], {
      // ...options
      autohide: true,
      /*orientation: 'bottom',*/
      dateDelimiter: '|',
      format: 'DD, MM d, yyyy',
    });

    const comp = this;
    dom.input.on("changeDate", () => comp.onChange());
  }

  updateDOM() {
    const dom = this.dom;
    if (this.dateValue) {
      this.datepicker.setDate(this.dateValue.toJSDate());
      const dateString = Datepicker.formatDate(this.dateValue.toJSDate(), this.dateFormat);
      dom.input.val(dateString);
      dom.display.removeClass("no-value");
      dom.display.html(dateString);
    } else {
      dom.input.val("");
      dom.display.addClass("no-value");
      dom.display.html(this.placeholder);
    }
    super.updateDOM();
  }

  onChange() {
    this.dateValue = DateTime.fromJSDate(this.datepicker.getDate());
  }
}