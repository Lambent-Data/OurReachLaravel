import EditableComponent from './EditableComponent.js'
import ModalComponent from './ModalComponent.js'
import MeasureComponent from './field-components/MeasureComponent.js'
import TextInputComponent from './field-components/TextInputComponent.js'
import DateInputComponent from './field-components/DateInputComponent.js'
import FormController from '../FormController.js'
import TextButtonComponent from './TextButtonComponent.js'
import ConfettiModal from './ConfettiModal.js'
import { asyncConfirm } from '../../utilities/asyncConfirm.js'
import { Status, Message, Outcome } from '../../utilities/enums.js'

export default class MilestoneEditForm extends EditableComponent {

  constructor(parent, src) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, src);
    this.name = "milestone-edit-form";

    this.title = "Edit milestone";
    this.saveText = "Save";
    this.closeText = "Close";

    this.ctrl = new MilestoneEditFormController(this);

    this.active = false;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;
    /*  Editable components */
    this.editableComponents.name = new TextInputComponent(this, 'milestone name', 'Milestone', this.src.name, 'Name your milestone');
    this.editableComponents.measures = new MeasureComponent(this, 'measures',this.src.measure_data, this.src.start_measure, this.src.end_measure);
    this.editableComponents.deadline = new DateInputComponent(this, 'milestone deadline', 'Complete by', this.src.deadline);

    this.components.confetti = new ConfettiModal(undefined, this, '<div style="width:100%; display:flex; flex-direction:column; align-items:center"><h5>Congratulations!</h5><span>Great work completing your milestone!</span></div>');

    this.components.modal = new ModalComponent(this.wrapper, this, this.title, this.saveText, this.closeText, "Delete", true);
    this.components.completeBtn = new TextButtonComponent(this, "Complete Milestone", 'btn-info');
    this.wrapper.addClass('milestone-edit-form');
    dom.modal = this.wrapper;
    dom.formBody = this.components.modal.getBodyDiv();
    dom.name = this.editableComponents.name.getWrapper();
    dom.measures = this.editableComponents.measures.getWrapper();
    dom.deadline = this.editableComponents.deadline.getWrapper();
    dom.completeBtn = this.components.completeBtn.getWrapper();  

    dom.formBody.append(dom.name)
                .append("<br/>")
                .append(dom.measures)
                .append("<br/>")
                .append(dom.deadline)
                .append("<br/>")
                .append(dom.completeBtn);
  }

  updateDOM() {
    super.updateDOM();
    for (const comp of Object.values(this.editableComponents)){
      comp.updateDOM();
    }

    this.components.completeBtn.setLabel(this.src.completed ? "Undo Complete" : "Complete Milestone");
  }

  show(){
    this.active = true;
    this.components.modal.show();
  }

  hide() {
    this.active = false;
    this.components.modal.hide();
  }

  disableSubmit() {
    this.components.modal.disableSubmitButton();
    this.components.modal.disableDeleteButton();
  }

  enableSubmit() {
    this.components.modal.enableSubmitButton();
    this.components.modal.enableDeleteButton();
  }

  getFormData(){
    const ecs = this.editableComponents;
    return {name: ecs.name.value, deadline: ecs.deadline.value, ...ecs.measures.value};
  }

  showFeedback(messages){
    if (messages.start_measure || messages.end_measure){
      this.editableComponents.measures.showErrorMessage({start: messages.start_measure, end: messages.end_measure});
    }
    if (messages.name){
      this.editableComponents.name.showErrorMessage(messages.name);
    }
    if (messages.deadline) {
      this.editableComponents.name.showErrorMessage(messages.deadline);
    }
  }

  handleMessage(id, msg, data){
    switch(id){
      case this.components.modal.id:
        if (msg === Message.CLOSE_MODAL){
          this.messageParent(Message.CLOSE_MODAL);
        }else if (msg === Message.SUBMIT){
          if (this.active) {
            this.disableSubmit();
            const comp = this;
            this.ctrl.submit().then(() => comp.enableSubmit());
          }
        } else if (msg === Message.DELETE) {
          const comp = this;
          if (this.active) {
            asyncConfirm("Are you sure you want to delete this milestone?", () => {
              comp.disableSubmit();
              comp.ctrl.delete().then(() => comp.enableSubmit());
            });
          }
        }
        return;
      case this.components.completeBtn.id:
        if (msg == Message.CLICK) {
          // Toggle milestone complete, with an alert
          const comp = this;
          if (this.src.completed){
            asyncConfirm("Mark this milestone as incomplete?", () => {
              comp.disableSubmit();
              comp.src.update({ completed: 0 }).then(
                () => {
                  comp.src.completed = false;
                  comp.enableSubmit();
                  comp.updateDOM();
                  comp.messageParent(Message.EDIT_MILESTONE);
                });
            });
          }else{
            asyncConfirm("Mark this milestone as complete?", () => {
              comp.disableSubmit();
              comp.src.update({ completed: 1 }).then(
                () => {
                  comp.src.completed = true;
                  comp.enableSubmit();
                  comp.updateDOM();
                  comp.messageParent(Message.EDIT_MILESTONE);
                  comp.components.confetti.show();
                });
            });
          }
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}

class MilestoneEditFormController extends FormController {
  async doSubmission(){
    const data = this.comp.getFormData();
    const resp = await this.src.update(data);
    /* resp is an object with properties:
    *   status: Status
    *   outcome: Outcome
    *   data: {
    *     name
    *     start_measure
    *     end_measure
    *     deadline
    *   }
    */
    switch (resp.outcome) {
      case Outcome.WRITTEN:
        // update Milestone src
        this.src.name = data.name;
        this.src.start_measure = data.start_measure;
        this.src.end_measure = data.end_measure;
        this.src.deadline = data.deadline;
        // redraw parent
        this.parent.updateDOM();
        this.parent.stopEditing();
        break;
      case Outcome.NOT_WRITTEN:
        this.comp.showFeedback(resp.data);
        break;
    }
  }

  async doDeletion() {
    const resp = await this.src.delete();
    switch (resp.status) {
      case Status.SUCCESS:
        this.comp.messageParent(Message.DELETE_MILESTONE);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp(showFeedback(resp.data));
        break;
    }
  }
}
