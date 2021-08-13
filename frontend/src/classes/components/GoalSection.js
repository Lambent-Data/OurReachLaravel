import EditableComponent from './EditableComponent.js'
import GoalComponent from './GoalComponent.js'
import IconButton from './IconButton.js'
import GoalForm from './GoalForm.js'
import Accordion from './Accordion.js'

import { Message } from '../../utilities/enums.js';
import User from '../data-sources/User.js'

export default class GoalSection extends EditableComponent {

  constructor(parent, milestoneOrUser, showButtons = true, placeholder="Add your first goal", title="Goals"){
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestoneOrUser);
    this.name = "goal-section";

    if (this.src instanceof User){
      this.section_user_id = this.src.id;
    }else{
      this.section_user_id = this.src.user_id;
    }

    this.showButtons = this.section_user_id == User.currentUserId ? showButtons : false;
    this.placeholder = placeholder;
    this.title = title;
    this.wrapper.addClass("empty");

    this.numberGoals = 0;

    this.populate();
    this.updateDOM();
  }

  addGoalComponent(goal) {
    this.wrapper.removeClass("empty");
    const comp = new GoalComponent(this, goal);
    const wrapper = comp.getWrapper();
    this.components[comp.id] = comp;
    this.dom.goalBox.append(wrapper);
    this.numberGoals += 1;
  }

  deleteGoalComponent(id) {
    if (id in this.components){
      this.components[id].getWrapper().remove();
      delete this.components[id];

      this.numberGoals - 1;

      // Figure out if the section is empty
      if (this.numberGoals == 0){
        this.wrapper.addClass("empty");
      }
    }
  }

  deleteGoalComponent(id) {
    if (id in this.components){
      this.components[id].getWrapper().remove();
      delete this.components[id];

      // Figure out if the section is empty
      for (const comp of Object.values(this.components)){
        if (comp instanceof GoalComponent){
          return;
        }
        this.wrapper.addClass("empty");
      }
    }
  }

  closeAllAccordions(){
    for (const comp of Object.values(this.editableComponents)){
      comp.closeAccordion();
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.addClass("goals-section");

    this.editableComponents.addBtn = new IconButton(this, 'add-button');
    this.components.accordionComponent = new Accordion(this, true, 1200, 1200);
    dom.accordion = this.components.accordionComponent.getWrapper();
    dom.accordionContent = this.components.accordionComponent.getContentDiv();
    dom.openAccordionButton = $('<div class="accordionOpenArrow"><div></div></div>');

    dom.sectionWrapper = this.wrapper;
    dom.titleDiv = $('<div class="ms-section-title"></div>');
    dom.titleText = $('<h4></h4>').html(this.title);
    dom.titleDiv.append(dom.titleText);
    dom.goalBox = $('<div class="goal-box"></div>');
    dom.addButton = this.editableComponents.addBtn.getWrapper();

    if (this.showButtons){
      this.components.goalForm = new GoalForm(this, this.src);
      dom.sectionWrapper.append(dom.addButton);
    }
    if (this.title){
      dom.sectionWrapper.append(dom.titleDiv)
    }
    dom.sectionWrapper.append(dom.openAccordionButton)
                      .append(dom.accordion);
    dom.accordionContent.append(dom.goalBox);

    dom.placeholder = $('<div class="goal-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', () => comp.handleMessage("placeholder", Message.CLICK));
    dom.goalBox.append(dom.placeholder);

    dom.titleDiv.on("click", () => {
      if (comp.numberGoals >= 4){
        comp.toggleAccordion();
      }
    });
    dom.openAccordionButton.on("click", () => {
      if (comp.numberGoals >= 4) {
        comp.toggleAccordion();
      }
    });
  }

  updateDOM(){
    super.updateDOM();
    if(!this.src) return;
    const dom = this.dom;    
  }

  startEditing(recurseDown = false, recurseUp = false) {
    super.startEditing(recurseDown, recurseUp);
    this.messageParent(Message.START_EDITING);
  }

  stopEditing(recurseDown = false, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    this.messageParent(Message.STOP_EDITING);
  }

  openForm() {
    this.components.goalForm.show();
    this.components.goalForm.startEditing();
  }

  closeForm() {
    this.components.goalForm.stopEditing();
    this.components.goalForm.hide();
  }

  toggleAccordion() {
    if (this.components.accordionComponent.isOpen) {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
  }

  openAccordion() {
    this.components.accordionComponent.open();
  }

  closeAccordion() {
    this.stopEditing();
    this.components.accordionComponent.close();
  }

  snapOpenAccordion() {
    this.components.accordionComponent.snapOpen();
  }

  snapClosedAccordion() {
    this.stopEditing();
    this.components.accordionComponent.snapClosed();
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case this.editableComponents.addBtn.id:
      case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
        if (msg == Message.CLICK) {
          if (this.editing){
            this.openForm();
          }
        }
        return;
    }

    if (this.components.goalForm && id == this.components.goalForm.id){
      if (msg == Message.ADD_GOAL) {
        this.addGoalComponent(data);
        this.closeForm();
      } else if (msg == Message.CLOSE_MODAL) {
        this.closeForm();
      }
      return;
    }
    

    if (id in this.components) {
      if (msg == Message.DELETE_GOAL) {
        this.deleteGoalComponent(id);
      }
    }
    super.handleMessage(id, msg, data);
  }
}