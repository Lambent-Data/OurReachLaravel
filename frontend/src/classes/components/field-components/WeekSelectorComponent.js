import FieldComponent from './FieldComponent.js'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default class WeekSelectorComponent extends FieldComponent {

  constructor(parent, fieldName, label, value, allowFeedback=true){

    const offValue = {
      SUN: false,
      MON: false,
      TUE: false,
      WED: false,
      THU: false,
      FRI: false,
      SAT: false
    };

    const wrapper = $('<div class="week-selector-wrapper"></div>');
    super(wrapper, parent, fieldName, label, offValue, undefined, allowFeedback);
    this.name = "week-selector-" + fieldName;

    this.populate();
    if (value){
      for (const day of DAYS){
        if (day in value && value[day]){
          this.addDay(day);
        }
      }
    }
    this.updateDOM();
  }
  
  populate() {
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.selector = $('<div class="week-selector"></div>');
    dom.sundayDiv = $('<div class="day-of-the-week no-select js-hoverable">Sun</div>');
    dom.mondayDiv = $('<div class="day-of-the-week no-select js-hoverable">Mon</div>');
    dom.tuesdayDiv = $('<div class="day-of-the-week no-select js-hoverable">Tue</div>');
    dom.wednesdayDiv = $('<div class="day-of-the-week no-select js-hoverable">Wed</div>');
    dom.thursdayDiv = $('<div class="day-of-the-week no-select js-hoverable">Thu</div>');
    dom.fridayDiv = $('<div class="day-of-the-week no-select js-hoverable">Fri</div>');
    dom.saturdayDiv = $('<div class="day-of-the-week no-select js-hoverable">Sat</div>');
    dom.dayDivs = {
      SUN: dom.sundayDiv,
      MON: dom.mondayDiv,
      TUE: dom.tuesdayDiv,
      WED: dom.wednesdayDiv,
      THU: dom.thursdayDiv,
      FRI: dom.fridayDiv,
      SAT: dom.saturdayDiv
    };

    const comp = this;
    for (const [day, div] of Object.entries(dom.dayDivs)) {
      dom.selector.append(div);
      div.on('click', (e) => {
        comp.toggleDay(day);
      });
    }
   
   
    dom.feedback = this.userMessage.getWrapper();

    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.wrapper.append(dom.content);
    dom.content.append(dom.selector);
    if (this.allowFeedback){
      dom.content.append(dom.feedback);
    }
  }

  updateDOM() {
    const dom = this.dom;
    super.updateDOM();
  }

  toggleDay(day){
    this.value[day] = !this.value[day];
    if (this.value[day]){
      this.dom.dayDivs[day].addClass('selected');
    }else{
      this.dom.dayDivs[day].removeClass('selected');
    }
  }
  
  addDay(day) {
    this.value[day] = true;
    if (this.value[day]) {
      this.dom.dayDivs[day].addClass('selected');
    } else {
      this.dom.dayDivs[day].removeClass('selected');
    }
  }

  removeDay(day) {
    this.value[day] = false;
    if (this.value[day]) {
      this.dom.dayDivs[day].addClass('selected');
    } else {
      this.dom.dayDivs[day].removeClass('selected');
    }
  }

  clearDays() {
    for (const day of DAYS) {
      this.removeDay(day);
    }
  }

  valueAsList(){
    const list = [];
    for (const day of Object.keys(this.value)) {
      if (this.value[day]) {
        list.push(day);
      }
    }
    return list;
  }

  valueFromList(listOfDays) {
    this.clearDays();
    const list = [];
    for (const day of listOfDays) {
      this.addDay(day);
    }
  }
}