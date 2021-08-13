import FieldComponent from './FieldComponent.js'

const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

export default class MonthSelectorComponent extends FieldComponent {

  constructor(parent, fieldName, label, value, allowFeedback=true){

    const offValue = {};
    DAYS.forEach((d)=> offValue[d] = false);

    const wrapper = $('<div class="month-selector-wrapper"></div>');
    super(wrapper, parent, fieldName, label, offValue, undefined, allowFeedback);
    this.name = "month-selector-" + fieldName;

    this.populate();
    if (value){
      for (const day of Object.keys(value)){
        if (day in DAYS && value[day]){
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
    dom.selector = $('<div class="month-selector"></div>');
    
    const comp = this;
    dom.dayDivs = {};
    for (const day of DAYS){
      dom.dayDivs[day] = $('<div class="day-of-the-month no-select js-hoverable">' + day + '</div>');
      dom.dayDivs[day].on('click', () => {
        comp.toggleDay(day);
      });
      dom.selector.append(dom.dayDivs[day]);
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

  clearDays(){
    for (const day of DAYS){
      this.removeDay(day);
    }
  }

  valueAsList() {
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