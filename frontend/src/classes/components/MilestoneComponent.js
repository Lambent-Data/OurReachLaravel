import EditableComponent from './EditableComponent.js'
import Accordion from './Accordion.js'
import IconComponent from './IconComponent.js'
import IconButton from './IconButton.js'
import LinkSectionForGoal from './LinkSectionForGoal.js'
import TextAreaComponent from './field-components/TextAreaComponent.js'
import StaticTextField from './StaticTextField.js'
import { describeDatetimeAbsolute } from '../../utilities/time.js'
import { redirect } from '../../utilities/request.js'
import { Pages, Message } from '../../utilities/enums.js'

export default class MilestoneComponent extends EditableComponent {

  constructor(parent, milestone) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "milestone-component";

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;
    const src = this.src;

    /* Editable Components */
    this.editableComponents.links = new LinkSectionForGoal(this, this.src);
    this.editableComponents.description = new TextAreaComponent(this, 'description', 'Description','',"",false);

    /* Non-editable components */
    this.components.icon = new IconComponent(this, this.src.category, true);
    this.components.accordionComponent = new Accordion(this);
    this.components.viewButton = new IconButton(this, 'next-button');
    this.components.status = new StaticTextField(this, "Status: ", this.src.completed ? "Complete" : "In Progress");
    this.components.dueDate = new StaticTextField(this, "Due Date: ", describeDatetimeAbsolute(this.src.deadline));

    dom.description = this.editableComponents.description.getWrapper();
    dom.links = this.editableComponents.links.getWrapper();

    dom.categoryIcon = this.components.icon.getWrapper();
    dom.viewButton = this.components.viewButton.getWrapper();
    dom.accordion = this.components.accordionComponent.getWrapper();
    dom.status = this.components.status.getWrapper();
    dom.dueDate = this.components.dueDate.getWrapper();
    dom.accordionContent = this.components.accordionComponent.getContentDiv();

    this.wrapper.addClass('milestone-wrapper js-hoverable');
    dom.milestoneDiv = this.wrapper;   
    dom.headerDiv = $('<div class="milestone-header"></div>');
    dom.contentDiv = $('<div class="milestone-content"></div>');
    dom.infoDiv = $('<div class="milestone-info"></div>');
    dom.nameDiv = $('<div class="milestone-name js-fit-text"></div>');
    dom.nameSpan = $('<span maxfontsize="24" minfontsize="16"></span>');
    dom.accordionMain = $('<div class="accordion-main"></div>');
    dom.accordionForm = $('<div class ="milestone-details"></div>');
    //dom.accordionBar = $()
    

    dom.milestoneDiv.append(dom.headerDiv);
    dom.headerDiv.append(dom.contentDiv);
    dom.contentDiv.append(dom.infoDiv);
    dom.infoDiv.append(dom.categoryIcon)
               .append(dom.nameDiv);
    dom.nameDiv.append(dom.nameSpan);
    dom.contentDiv.append(dom.viewButton);
    dom.milestoneDiv.append(dom.accordion);
    dom.accordionContent.append(dom.accordionMain);
    dom.accordionMain.append(dom.status)
                     .append(dom.dueDate)
                     .append(dom.accordionForm); 
    //dom.accordionForm.append(dom.description)
    dom.accordionForm.append(dom.links);

    

    const comp = this;
    this.dom.infoDiv.on("click", () => comp.toggleAccordion());
  }

  updateDOM(){
    super.updateDOM();
    const src = this.src;

    this.components.status.value = src.completed ? "Complete" : "In Progress";
    this.components.status.updateDOM();

    if (this.src.deadline.invalid){
      this.components.dueDate.getWrapper().hide();
    }else{
      this.components.dueDate.getWrapper().show();
      this.components.dueDate.value = describeDatetimeAbsolute(this.src.deadline);
    }
    this.components.dueDate.updateDOM();

    this.dom.nameSpan.html(src.name);
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

  handleMessage(id, msg){
    if (id == this.components.viewButton.id && msg == Message.CLICK){
      redirect({page: Pages.VIEW_MILESTONE, ruko_id: this.src.ruko_id});
    }
  }
}