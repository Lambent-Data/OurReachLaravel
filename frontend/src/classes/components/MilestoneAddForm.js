import EditableComponent from './EditableComponent.js'
import ModalComponent from './ModalComponent.js'
import FormController from '../FormController.js'
import CategorySelectComponent from './field-components/CategorySelectComponent.js'
import TextInputComponent from './field-components/TextInputComponent.js'
import MeasureComponent from './field-components/MeasureComponent.js'
import DateInputComponent from './field-components/DateInputComponent.js'
import LabelledFieldWrapper from './field-components/LabelledFieldWrapper.js'
import DropdownComponent from './field-components/DropdownComponent.js'
import Slider from './Slider.js'
import IconButton from './IconButton.js'
import Milestone from '../data-sources/Milestone.js'

import { MeasureMetadata } from '../../utilities/object-fields.js'
import { MeasureType, Message, Status } from '../../utilities/enums.js'
import { Subcategory, TemplateMilestone } from '../../utilities/templateDataLists.js'

export default class MilestoneAddForm extends EditableComponent {
  constructor(parent, src) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, src);
    this.name = "milestone-form";

    this.title = "Add Milestone";
    this.saveText = "Save";
    this.closeText = "Close";
    this.ctrl = new AddMilestoneController(this, this.src);

    // Gatekeeper to prevent multiple submission
    // Form becomes active on show, inactive on hide
    // Can't submit unless active
    this.active = false;
    
    this.usingTemplate = undefined;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.editableComponents.categorySelect = new CategorySelectComponent(this, 'category', undefined, undefined, true);
    this.editableComponents.subcategory = new DropdownComponent(this, 'subcategory', "Subcategory: ", undefined, [], [], "Choose a subcategory", true);
    this.editableComponents.milestoneName = new LabelledFieldWrapper(this, "milestone-name", "Milestone: ", true);
    this.editableComponents.template = new DropdownComponent(this, 'template', undefined, undefined, [], [], "Choose a template", false);
    this.editableComponents.customMilestone = new TextInputComponent(this, 'custom-milestone', undefined, undefined, "Write your own", false);
    this.editableComponents.endDate = new DateInputComponent(this, 'end-date', "End Date", undefined, undefined, true);
    this.editableComponents.measures = new MeasureComponent(this, 'measures', new MeasureMetadata('{ "type": "freeform" }'), undefined, undefined, true);


    this.components.modal = new ModalComponent(this.wrapper, this, this.title, this.saveText, this.closeText);
    this.components.slider = new Slider(this, 3);
    this.components.next0 = new IconButton(this, 'next-button');
    this.components.next1 = new IconButton(this, 'next-button');
    this.components.prev1 = new IconButton(this, 'prev-button');
    this.components.prev2 = new IconButton(this, 'prev-button');
  
    this.wrapper.addClass('milestone-add-form');
    dom.modal = this.wrapper;
    dom.formBody = this.components.modal.getBodyDiv();

    dom.slider = this.components.slider.getWrapper();

    // Forward/back buttons
    dom.next0 = this.components.next0.getWrapper();
    dom.next1 = this.components.next1.getWrapper();
    dom.next0.css("float", "right");
    dom.next1.css("float", "right");
    dom.prev1 = this.components.prev1.getWrapper();
    dom.prev2 = this.components.prev2.getWrapper();
    dom.prev1.css("float", "left");
    dom.prev2.css("float", "left");

    dom.navHolder0 = $('<div style="width: 100%;"></div>');
    dom.navHolder1 = $('<div style="width: 100%"></div>');
    dom.navHolder2 = $('<div style="width: 100%"></div>');

    dom.formBody.append(dom.slider);

    // first slide: Choose a category
    const slide0 = this.components.slider.getSlideDiv(0);
    slide0.css({ 'display': 'flex', 'flex-direction': 'column' });
    dom.slide0Content = $('<div></div>').css({ "display": "flex", "justify-content": "space-around", "flex-direction": "column", "flex-grow": "1" });
    
    dom.categorySelect = this.editableComponents.categorySelect.getWrapper();
    dom.slide0Content.append(dom.categorySelect);
    
    slide0.append(dom.slide0Content);
    slide0.append(dom.navHolder0);
    dom.navHolder0.append(dom.next0);

    // second slide: Choose subcategory and milestone name
    const slide1 = this.components.slider.getSlideDiv(1);
    slide1.css({'display': 'flex', 'flex-direction': 'column'});
    dom.slide1Content = $('<div></div>').css({ "display": "flex", "justify-content": "space-around", "flex-direction": "column", "flex-grow": "1" });
    
    dom.subcategory = this.editableComponents.subcategory.getWrapper();
    dom.milestoneName = this.editableComponents.milestoneName.getWrapper();
    dom.milestoneNameBody = this.editableComponents.milestoneName.getMainDiv();
    dom.milestoneNameBody.css({"flex-direction": "column", "max-width": "100%"});
    dom.template = this.editableComponents.template.getWrapper();
    dom.orSpan = $('<span>&bull; or &bull;</span>');
    dom.customMilestone = this.editableComponents.customMilestone.getWrapper();

    dom.milestoneNameBody.append(dom.template).append(dom.orSpan).append(dom.customMilestone);
    dom.slide1Content.append(dom.subcategory)
                     .append(dom.milestoneName);
    
    slide1.append(dom.slide1Content);
    slide1.append(dom.navHolder1);
    dom.navHolder1.append(dom.prev1).append(dom.next1);

    // third slide: Choose measures and end date
    const slide2 = this.components.slider.getSlideDiv(2);
    slide2.css({ 'display': 'flex', 'flex-direction': 'column' });
    dom.slide2Content = $('<div></div>').css({ "display": "flex", "justify-content": "space-around", "flex-direction": "column", "flex-grow": "1" });

    dom.measures = this.editableComponents.measures.getWrapper();
    dom.endDate = this.editableComponents.endDate.getWrapper();
    dom.slide2Content.append(dom.measures)
                     .append(dom.endDate);

    slide2.append(dom.slide2Content);
    slide2.append(dom.navHolder2);
    dom.navHolder2.append(dom.prev2);

    //const slider = this.components.slider;
    //setInterval(() => slider.goToSlide((slider.currentSlide + 1) % 3), 2000);
  }

  validateForm(){
    return this.validateCategory() && this.validateSubcategory() && this.validateMilestoneName();
  }
  
  validateCategory(){
    if (this.editableComponents.categorySelect.value){
      return true;
    }else{
      this.editableComponents.categorySelect.showErrorMessage("Please choose a category.");
      return false;
    }
  }

  validateSubcategory() {
    if (this.editableComponents.subcategory.value !== undefined) {
      return true;
    } else {
      this.editableComponents.subcategory.showErrorMessage("Please choose a subcategory.");
      return false;
    }
  }

  validateMilestoneName(){
    if (this.usingTemplate && this.editableComponents.template.value !== undefined){
      return true;
    }else if (!this.usingTemplate && this.editableComponents.customMilestone.value !== ""){
      return true;
    }else{
      this.editableComponents.milestoneName.showErrorMessage("Choose a name for your milestone.");
      return false;
    }
  }

  show(){
    this.active = true;
    this.enableSubmit();
    this.startEditing();
    this.editableComponents.categorySelect.value = undefined;
    this.components.modal.show();
    this.components.slider.snapToSlide(0);
    this.components.modal.hideSubmitButton();
    this.updateDOM();
  }

  hide() {
    this.active = false;
    this.components.modal.hide();
  }

  disableSubmit(){
    this.components.modal.disableSubmitButton();
  }

  enableSubmit() {
    this.components.modal.enableSubmitButton();
  }

  updateMeasuresField(){
    if (this.usingTemplate) {
      const cat = this.editableComponents.categorySelect.value;
      const subcat = this.editableComponents.subcategory.value;
      const templateId = this.editableComponents.template.value;
      if (cat && subcat && templateId){
        let chosenTemplate;
        chosenTemplate = TemplateMilestone[cat][subcat][templateId];
        if (chosenTemplate.measures) {
          const m = chosenTemplate.measures;
          this.editableComponents.measures.metadata = new MeasureMetadata(m.type, m.startLabel, m.endLabel, m.startOptions, m.endOptions,
            m.defaultStart, m.defaultEnd, m.placeholderStartValue, m.placeholderEndValue, m.unit);
        } else {
          this.editableComponents.measures.metadata = new MeasureMetadata(MeasureType.NONE);
        }
      } else {
        this.editableComponents.measures.metadata = new MeasureMetadata(MeasureType.NONE);
      }
    } else {
      this.editableComponents.measures.metadata = new MeasureMetadata(MeasureType.FREEFORM);
    }
    this.editableComponents.measures.populate();
    this.editableComponents.measures.value = { start_measure: "NULL", end_measure: "NULL" };
    this.editableComponents.measures.updateDOM();
    this.editableComponents.measures.startEditing();
  }

  getFormDataAsMilestone(){
    const ecs = this.editableComponents;
    const raw_data = {
      category: ecs.categorySelect.value,
      subcategory: ecs.subcategory.text,
      name: this.usingTemplate ? ecs.template.text : ecs.customMilestone.value,
    }
    if (this.usingTemplate){
      raw_data.template_id = ecs.template.value;
    }
    const milestone = Milestone.make(raw_data);
    milestone.measure_data = ecs.measures.metadata;
    milestone.start_measure = ecs.measures.value.start_measure;
    milestone.end_measure = ecs.measures.value.end_measure;
    milestone.deadline = ecs.endDate.value;
    return milestone;
  }

  getFormData(){
    const ecs = this.editableComponents;
    return {
      category: ecs.categorySelect.value,
      subcategory: ecs.subcategory.text,
      name: this.usingTemplate ? ecs.template.text : ecs.customMilestone.value,
      measure_data: ecs.measures.metadata.toJSON(),
      start_measure: ecs.measures.value.start_measure,
      end_measure: ecs.measures.value.end_measure,
      deadline: ecs.endDate.value
    }
  }

  slideTo(slideNum){
    /*
     * Sends the slider to the right slide and updates the form accordingly.
     */
    const currentSlide = this.components.slider.currentSlide;
    if (slideNum == currentSlide) return;
    switch (slideNum){
      case 0:
        this.components.slider.goToSlide(0);
        this.components.modal.hideSubmitButton();
        return;
      case 1:
        if (currentSlide == 0) {
          if (this.validateCategory()) {
            this.editableComponents.subcategory.clearMessage();
            this.editableComponents.milestoneName.clearMessage();
            this.editableComponents.template.ungreyOut();
            this.editableComponents.customMilestone.ungreyOut();
          }else{
            break;
          }
        }
        this.components.slider.goToSlide(1);
        this.components.modal.hideSubmitButton();
        break;
      case 2:
        if (this.validateSubcategory() && this.validateMilestoneName()) {
          const modal = this.components.modal;
          this.components.slider.goToSlide(2, () => {
            modal.showSubmitButton();
          });
        }
        break; 
      }
  }

  showFeedback(messages){
    console.log(messages);
  }

  handleMessage(id, msg, data){
    switch(id){
      case this.components.modal.id:
        if (msg === Message.CLOSE_MODAL){
          this.hide();
        }else if (msg === Message.SUBMIT){
          if (this.active){
            this.disableSubmit();
            const comp = this;
            this.ctrl.submit().then(() => comp.enableSubmit());
          }
        }
        return;
      case this.editableComponents.categorySelect.id:
        if (msg === Message.CHANGE) {
          // Category has been rechosen/unchosen
          const cat = this.editableComponents.categorySelect.value;
          let options, optionValues;
          if (cat){
            options = Object.values(Subcategory[cat]).map(x => x.name);
            optionValues = Object.values(Subcategory[cat]).map(x => x.id);
          } else {
            options = [];
            optionValues = [];
          }
          this.editableComponents.subcategory.setOptions(options, optionValues);
          this.editableComponents.subcategory.value = undefined;

          this.editableComponents.template.setOptions([], []);
          this.editableComponents.template.value = undefined;

          // Automatically advance to the next slide, after a delay
          setTimeout(() => this.slideTo(1), 500);
        }
        return;
      case this.editableComponents.subcategory.id:
        if (msg === Message.CHANGE) {
          // Subcategory has been rechosen/unchosen
          const cat = this.editableComponents.categorySelect.value;
          const subcat = this.editableComponents.subcategory.value;
          let options, optionValues;
          if (cat && subcat) {
            options = Object.values(TemplateMilestone[cat][subcat]).map(x => x.name);
            optionValues = Object.values(TemplateMilestone[cat][subcat]).map(x => x.id);
          }else{
            options = [];
            optionValues = [];
          }
          this.editableComponents.template.setOptions(options, optionValues);
          this.editableComponents.template.value = undefined;
          this.editableComponents.template.populate();
          this.editableComponents.template.updateDOM();

          this.usingTemplate = undefined;
          // rerender the measure data field
          this.updateMeasuresField();
        }
        return;
      case this.editableComponents.template.id:
        if (msg === Message.FOCUS) {
          // template has been touched
          this.usingTemplate = true;
          this.editableComponents.template.ungreyOut();
          this.editableComponents.customMilestone.greyOut();
          this.editableComponents.milestoneName.clearMessage();
        }else if (msg === Message.CHANGE){
          this.updateMeasuresField();
        }
        return;
      case this.editableComponents.customMilestone.id:
        if (msg === Message.FOCUS) {
          // custom milestone name has been touched
          this.usingTemplate = false;
          this.editableComponents.template.greyOut();
          this.editableComponents.customMilestone.ungreyOut();
          this.editableComponents.milestoneName.clearMessage();
        }
        return;
      case this.components.next0.id:
        if (msg === Message.CLICK) {
          // Trying to go from category selection (slide 0) to next slide (slide 1)
          this.slideTo(1);
        }
        return;
      case this.components.next1.id:
        if (msg === Message.CLICK) {
          // Trying to go from milestone name/subcat slide (slide 1) to final slide (slide 2)
          this.slideTo(2);
        }
        return;
      case this.components.prev1.id:
        if (msg === Message.CLICK) {
          this.slideTo(0);
        }
        return;
      case this.components.prev2.id:
        if (msg === Message.CLICK) {
          this.slideTo(1);
        }
        return;
    }

    super.handleMessage(id, msg, data);
  }
}

class AddMilestoneController extends FormController {
  async doSubmission(){
    if (!this.comp.validateForm()){
      return;
    }
    const milestone = this.comp.getFormDataAsMilestone();
    const resp = await milestone.create();
    /* resp is an object with properties:
    *   status: Status
    *   data: {
    *     ...
    *   }
    */
    switch (resp.status) {
      case Status.SUCCESS:
        this.comp.messageParent(Message.CREATED_MILESTONE, milestone);
        this.comp.hide();
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }
}
