import FieldComponent from './FieldComponent.js'
import IconComponent from '../IconComponent.js'

import { Message, CategoryEnum } from '../../../utilities/enums.js'

export default class CategorySelectComponent extends FieldComponent {
  constructor(parent, fieldName, label, value, allowFeedback = true) {
    const wrapper = $('<div class="category-select-wrapper"></div>');
    super(wrapper, parent, fieldName, label, value, undefined, allowFeedback);
    this.name = "category-select";

    this.populate();

    this.value = value;
    this.updateDOM();
  }

  set value(cat) {
    if (this.hasPopulated){
      if (cat in CategoryEnum) {
        this.editableComponents[cat].select();
      }else{
        for (const cat in CategoryEnum) {
          this.editableComponents[cat].unselect();
        }
      }
    }
  }

  get value() {
    if (this.hasPopulated){
      for (const cat in CategoryEnum){
        if(this.editableComponents[cat].selected){
          return this.editableComponents[cat].category;
        }
      }
    }
    return undefined;
  }

  populate() {
    super.populate();
    const dom = this.dom;
    /*  Editable components */
    for (const cat in CategoryEnum) {
      this.editableComponents[cat] = new IconComponent(this, CategoryEnum[cat]);
    }

    dom.wrapper = this.wrapper;
    dom.content = $('<div class="field-content"></div>');
    dom.iconBox = $('<div class="icon-box"></div>');
    dom.feedback = this.userMessage.getWrapper();


    if (this.label) {
      dom.labelBox = $('<div class="field-label-box"></div>')
      dom.label = $('<span class="field-label"></span>').html(this.label);
      dom.labelBox.append(dom.label);
      dom.wrapper.append(dom.labelBox);
    }

    dom.content.append(dom.iconBox);
    dom.wrapper.append(dom.content);

    // Add all the category icons to the content div
    for (const cat in CategoryEnum) {
      const catIcon = this.editableComponents[cat];
      dom[cat] = catIcon.getWrapper();
      dom.iconBox.append(dom[cat]);
    }

    if (this.allowFeedback) {
      dom.content.append(dom.feedback);
    }
  }

  handleMessage(id, msg, data){
    for (const cat in CategoryEnum){
      const catIcon = this.editableComponents[cat];
      if (id == catIcon.id){
        if (msg == Message.CHANGE){
          if (catIcon.selected){
            for (const otherCat in CategoryEnum) {
              if (otherCat !== cat){
                this.editableComponents[otherCat].unselect();
                this.editableComponents[otherCat].greyOut();
              }
            }
          }else{
            if(this.value == undefined){
              for (const otherCat in CategoryEnum) {
                this.editableComponents[otherCat].ungreyOut();
              }
            }
          }
        }
        this.clearMessage();
        this.messageParent(Message.CHANGE);
        return;
      }
    }
    super.handleMessage(id, msg, data);
  }
}