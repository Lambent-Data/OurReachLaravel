import FieldComponent from './FieldComponent.js'
import DropdownComponent from './DropdownComponent.js'
import TextInputComponent from './TextInputComponent.js'

import { MeasureType, Message } from '../../../utilities/enums.js';



export default class MeasureComponent extends FieldComponent {
  constructor(parent, fieldName, measureData, startMeasure, endMeasure, allowFeedback = true){
    const wrapper = $('<div class="measure-wrapper"></div>');
    super(wrapper, parent, fieldName, undefined, undefined, undefined, false);
    this.name = "measure-" + fieldName;
    
    this.metadata = measureData;
    this.allowFeedback = allowFeedback;

    this.populate();
    this.updateDOM();
    this.value = { start_measure: startMeasure, end_measure: endMeasure };
  }

  get value() {
    if (this.editableComponents.startInput && this.editableComponents.endInput) {
      return { start_measure: this.editableComponents.startInput.value, end_measure: this.editableComponents.endInput.value };
    }else{
      return {};
    }
  }

  set value(values) {
    if (values && this.hasPopulated) {
      if (values.start_measure && this.editableComponents.startInput) {
        this.editableComponents.startInput.value = values.start_measure;
      }
      if (values.end_measure && this.editableComponents.endInput) {
        this.editableComponents.endInput.value = values.end_measure;
      }
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    if (this.metadata.type == MeasureType.NONE) return;

    dom.wrapper = this.wrapper;
    dom.measures = $('<div class="measure-content"></div>');

    if (this.metadata.type == MeasureType.FREEFORM) {
      this.editableComponents.startInput = new TextInputComponent(this, "start measure freeform", this.metadata.startLabel,
                                                                  undefined, this.metadata.placeholderStartValue, this.allowFeedback);
      this.editableComponents.endInput = new TextInputComponent(this, "end measure freeform", this.metadata.endLabel,
                                                                undefined, this.metadata.placeholderEndValue, this.allowFeedback);
    } else if (this.metadata.type == MeasureType.DROPDOWN) {
      /*const startOptionValues = [];
      for (let i = 0; i < this.metadata.startOptions.length; i++){
        startOptionValues.push(i);
      }*/
      /*const endOptionValues = [];
      for (let i = 0; i < this.metadata.endOptions.length; i++) {
        endOptionValues.push(i);
      }*/
      console.log(this.metadata);

      this.editableComponents.startInput = new DropdownComponent(this, "start measure dropdown", this.metadata.startLabel, this.metadata.defaultStart,
        this.metadata.startOptions, this.metadata.startOptions, this.metadata.placeholderStartValue, this.allowFeedback);

      this.editableComponents.endInput = new DropdownComponent(this, "end measure dropdown", this.metadata.endLabel, this.metadata.defaultEnd,
        this.metadata.endOptions, this.metadata.endOptions, this.metadata.placeholderEndValue, this.allowFeedback);
    }

    dom.startInput = this.editableComponents.startInput.getWrapper();
    dom.endInput = this.editableComponents.endInput.getWrapper();

    dom.wrapper.append(dom.measures);
    dom.measures.append(dom.startInput)
                .append(dom.endInput);
  }

  updateDOM(){
    super.updateDOM();
    if (this.editableComponents.startInput)
      this.editableComponents.startInput.updateDOM();
    if (this.editableComponents.endInput)
      this.editableComponents.endInput.updateDOM();
  }


  showMessage(msg) {
    if (msg.start && this.editableComponents.startInput)
      this.editableComponents.startInput.showMessage(msg);
    if (msg.end && this.editableComponents.endInput)
      this.editableComponents.endInput.showMessage(msg);
  }

  showSuccessMessage(msg) {
    if (msg.start && this.editableComponents.startInput)
      this.editableComponents.startInput.showSuccessMessage(msg);
    if (msg.end && this.editableComponents.endInput)
      this.editableComponents.endInput.showSuccessMessage(msg);
  }

  showErrorMessage(msg) {
    if (msg.start && this.editableComponents.startInput)
      this.editableComponents.startInput.showErrorMessage(msg);
    if (msg.end && this.editableComponents.endInput)
      this.editableComponents.endInput.showErrorMessage(msg);
  }

  clearMessage() {
    if (this.editableComponents.startInput && this.editableComponents.endInput){
      this.editableComponents.startInput.clearMessage();
      this.editableComponents.endInput.clearMessage();
    }
  }

  handleMessage(id, msg, data){
    if (this.editableComponents.startInput && this.editableComponents.endInput){
      switch(id){
        case this.editableComponents.startInput.id:
        case this.editableComponents.endInput.id:
          if (msg == Message.CHANGE){
            this.onChange();
          }
      }
    }
  }
}