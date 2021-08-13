import EditableComponent from './EditableComponent.js'
import Accordion from './Accordion.js'
import GoalBasisDisplay from './GoalBasisDisplay.js'
import CheckmarkComponent from './field-components/CheckmarkComponent.js'
import TextInputComponent from './field-components/TextInputComponent.js'
import TextAreaComponent from './field-components/TextAreaComponent.js'
import DateInputComponent from './field-components/DateInputComponent.js'
import DateTimeComponent from './field-components/DateTimeComponent.js'
import LinkSectionForGoal from './LinkSectionForGoal.js'
import StaticTextField from './StaticTextField.js'
import IconButton from './IconButton.js'
import GoalForm from './GoalForm.js'
import FormController from '../FormController.js'
import User from '../data-sources/User.js'
import { describeDatetimeAbsolute } from '../../utilities/time.js'
import { Status, Message, RepeatType } from '../../utilities/enums.js'

export default class GoalComponent extends EditableComponent {

  constructor(parent, goal){
    const wrapper = $('<div></div>');
    super(wrapper, parent, goal);
    this.name = "goal-component";

    this.ctrl = new UpdateGoalController(this);

    this.populate();
    this.updateDOM();
    this.wrapper.css({ "order": this.src.sortOrder });
  }

  populate() {
    super.populate();
    const dom = this.dom;
    
    /*  Editable components */
    this.editableComponents.description = new TextAreaComponent(this, 'description', 'Details', '', "", false);
    this.editableComponents.links = new LinkSectionForGoal(this, this.src);
    this.editableComponents.notes = new TextAreaComponent(this, 'notes', 'Notes', '', "", false);
    this.editableComponents.showFormBtn = new IconButton(this, 'show-form-button');

    /* Non-editable components */
    this.components.checkmark = new CheckmarkComponent(this,'checkmark', this.src.completed);
    if (this.src.user_id == User.currentUserId) {
      // If this is the owner of the goal, let the checkmark be checkable
      this.components.checkmark.startEditing(true, false);
    }
    this.components.accordionComponent = new Accordion(this);
    this.components.basisDisplay = new GoalBasisDisplay(this, this.src, true);
    this.components.completeBy = new StaticTextField(this, "Complete by: ", "");
    this.components.repeatBasis = new TextInputComponent(this, "static repeat basis", "Frequency: ", "", "...", false);
    this.components.createdOn = new DateInputComponent(this, "created", "Created: ", this.src.createdOn, undefined, false);

    dom.description = this.editableComponents.description.getWrapper();
    dom.links = this.editableComponents.links.getWrapper();
    dom.notes = this.editableComponents.notes.getWrapper();

    dom.checkDiv = this.components.checkmark.getWrapper();
    dom.accordion = this.components.accordionComponent.getWrapper();
    dom.accordionContent = this.components.accordionComponent.getContentDiv();
    dom.showFormButton = this.editableComponents.showFormBtn.getWrapper();
    dom.basisDiv = this.components.basisDisplay.getWrapper();
    dom.completeBy = this.components.completeBy.getWrapper();
    dom.repeatDiv = this.components.repeatBasis.getWrapper();
    dom.createdOn = this.components.createdOn.getWrapper();

    this.wrapper.addClass('goal js-hoverable');

    dom.goalDiv = this.wrapper;
    dom.headerDiv = $('<div class="goal-header"></div>');
    dom.contentDiv = $('<div class="goal-content"></div>');
    dom.infoDiv = $('<div class="goal-info"></div>');
    dom.nameDiv = $('<div class="goal-name js-fit-text"></div>');
    dom.nameSpan = $('<span maxfontsize="24" minfontsize="16"></span>');
    dom.buttonBox = $('<div class="goal-button-box"></div>');
    dom.accordionMain = $('<div class="accordion-main"></div>');
    dom.accordionForm = $('<div class="goal-details"></div>');
    dom.accordionTopbar = $('<div class="accordion-topbar"></div>');
       
    dom.goalDiv.append(dom.headerDiv);
    dom.headerDiv.append(dom.contentDiv);
    dom.contentDiv.append(dom.infoDiv);
    dom.infoDiv.append(dom.nameDiv)
               .append(dom.basisDiv);
    dom.nameDiv.append(dom.nameSpan);
    dom.contentDiv.append(dom.buttonBox);
    dom.buttonBox.append(dom.checkDiv);
    dom.goalDiv.append(dom.accordion);
    dom.accordionMain.append(dom.accordionForm)
                     .append(dom.accordionTopbar);
    dom.accordionForm.append(dom.description)
                     .append(dom.completeBy)
                     .append(dom.repeatDiv)
                     .append(dom.createdOn)
                     .append(dom.links)
                     .append(dom.notes);
    if (this.src.user_id == User.currentUserId) {
      dom.accordionTopbar.append(dom.editButton)
                          .append(dom.showFormButton);
    }
    dom.accordionContent.append(dom.accordionMain);

    /* Create editing form */
    this.components.goalForm = new GoalForm(this, this.src);

    const comp = this;
    this.dom.headerDiv.on("click", () => comp.toggleAccordion());
  }

  updateDOM() {
    if (!this.src) return;

    const dom = this.dom;
    const src = this.src;

    if (src.category) {
      dom.goalDiv.addClass('ld-' + src.category.toLowerCase());
    }

    dom.nameSpan.html(src.name);
    dom.nameSpan.fitTextByWidth();

    this.components.basisDisplay.updateDOM();

    this.components.completeBy.value = describeDatetimeAbsolute(this.src.nextDeadline);
    this.components.completeBy.updateDOM();

    this.components.repeatBasis.value = this.src.repeat.toString();
    this.components.repeatBasis.updateDOM();

    this.components.createdOn.value = src.createdOn;
    this.components.createdOn.updateDOM();

    this.editableComponents.description.value = src.description;
    this.editableComponents.description.updateDOM();
    this.editableComponents.notes.value = src.notes;
    this.editableComponents.notes.updateDOM();
  }


  toggleAccordion(){
    if (this.components.accordionComponent.isOpen){
      this.closeAccordion();
    }else{
      this.openAccordion();
    }
  }

  startEditing(recurseDown = true, recurseUp = false) {
    if (this.src.user_id == User.currentUserId) {
      super.startEditing(recurseDown, recurseUp);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    this.ctrl.submit();
    super.stopEditing(recurseDown, recurseUp);
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
    this.components.accordionComponent.snapClose();
  }

  getEditableData(){
    // Return the contents of the components in the goal accordion that the user can edit
    const ecs = this.editableComponents;
    return {
      description: ecs.description.value ?? "",
      notes: ecs.notes.value ?? "",
    }
  }

  handleMessage(id, msg, data){
    switch(id){
      case this.editableComponents.showFormBtn.id:
        if (msg == Message.CLICK){
          this.openForm();
        }
        return;
      case this.components.goalForm.id:
        if (msg == Message.EDIT_GOAL) {
          this.updateDOM();
          this.closeForm();
        } else if (msg == Message.DELETE_GOAL) {
          this.messageParent(Message.DELETE_GOAL);
          this.closeForm();
        } else if (msg == Message.CLOSE_MODAL) {
          this.closeForm();
        }
        return;
      case this.components.checkmark.id:
        if (msg == Message.CHANGE){
          // Update the goal on the db with the checkmark state
          const comp = this;
          this.src.update({ completed: this.components.checkmark.checked ? 1 : 0 }).then(() => this.updateDOM());
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}

class UpdateGoalController extends FormController {
  async doSubmission() {
    const data = this.comp.getEditableData(); // notes and description
    const resp = await this.src.update(data);
    switch (resp.status) {
      case Status.SUCCESS:
        // update goal src
        this.src.description = data.description;
        this.src.notes = data.notes;
        this.comp.updateDOM();
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp(showFeedback(resp.data));
        break;
    }
  }
}