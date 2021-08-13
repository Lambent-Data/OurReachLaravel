import EditableComponent from './EditableComponent.js'
import MilestoneComponent from './MilestoneComponent.js'
import MilestoneAddForm from './MilestoneAddForm.js'
import Accordion from './Accordion.js'
import IconButton from './IconButton.js'
import User from '../data-sources/User.js'
import { redirect } from '../../utilities/request.js'
import { Message, Pages } from '../../utilities/enums.js'

export default class MilestoneSection extends EditableComponent {

  constructor(parent, user, title="Milestones", showButtons = true, placeholder="No milestones to display"){
    const wrapper = $('<div></div>');
    super(wrapper, parent, user);
    this.name = "milestone-section"

    this.title = title;
    this.showButtons = this.src.id == User.currentUserId ? showButtons : false;
    this.placeholder = placeholder;
    this.wrapper.addClass("empty");

    this.numberMilestones = 0;

    this.populate();
    this.updateDOM();
  }

  addMilestoneComponent(milestone) {
    this.wrapper.removeClass("empty");
    const comp = new MilestoneComponent(this, milestone);
    const wrapper = comp.getWrapper();
    this.components[comp.id] = comp;
    this.dom.milestoneBox.append(wrapper);
    this.numberMilestones += 1;
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.addClass("milestone-section");

    this.editableComponents.addMilestoneForm = new MilestoneAddForm(this, this.src);
    this.editableComponents.addBtn = new IconButton(this, 'add-button');
    this.components.accordionComponent = new Accordion(this, true, 1200, 1200);

    dom.sectionWrapper = this.wrapper;
    dom.titleDiv = $('<div class="ms-section-title"></div>');
    dom.title = $('<h4></h4>').html(this.title);
    dom.accordion = this.components.accordionComponent.getWrapper();
    dom.accordionContent = this.components.accordionComponent.getContentDiv();
    dom.openAccordionButton = $('<div class="accordionOpenArrow"><div></div></div>');

    dom.milestoneBox = $('<div class="milestone-box"></div>');
    dom.addButton = this.editableComponents.addBtn.getWrapper();

    dom.titleDiv.append(dom.title);
    if (this.showButtons){
      dom.sectionWrapper.append(dom.addButton);
    }
    dom.sectionWrapper.append(dom.titleDiv)
                      .append(dom.openAccordionButton)
                      .append(dom.accordion);
    dom.accordionContent.append(dom.milestoneBox);

    dom.placeholder = $('<div class="milestone-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', () => comp.handleMessage("placeholder", Message.CLICK));
    dom.milestoneBox.append(dom.placeholder);

    dom.titleDiv.on("click", () => {
      if (comp.numberMilestones >= 2) {
        comp.toggleAccordion();
      }
    });
    dom.openAccordionButton.on("click", () => {
      if (comp.numberMilestones >= 2) {
        comp.toggleAccordion();
      }
    });
  }

  updateDOM(){
    super.updateDOM();
    const dom = this.dom;
  }

  open() {
    this.components.goalForm.show();
    this.components.goalForm.startEditing();
  }

  close() {
    this.components.goalForm.stopEditing();
    this.components.goalForm.hide();
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
    if (this.numberMilestones >= 2) {
      this.components.accordionComponent.close();
    }
  }

  snapOpenAccordion() {
    this.components.accordionComponent.snapOpen();
  }

  snapClosedAccordion() {
    this.stopEditing();
    if (this.numberMilestones >= 2) {
      this.components.accordionComponent.snapClosed();
    }
  }

  handleMessage(id, msg, data) {
    if (this.hasPopulated) {
      switch (id) {
        case this.editableComponents.addBtn.id:
        case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
          if (msg == Message.CLICK) {
            this.editableComponents.addMilestoneForm.show();
          }
          return;
        case this.editableComponents.addMilestoneForm.id:
          if (msg == Message.CREATED_MILESTONE) {
            this.addMilestoneComponent(data);
            redirect({page: Pages.VIEW_MILESTONE, ruko_id: data.ruko_id});
          }
          return;
      }
    }
  }
}