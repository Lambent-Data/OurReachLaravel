import EditableComponent from './EditableComponent.js'
import ModalComponent from './ModalComponent.js'
import LinkComponent from './LinkComponent.js'
import TextInputComponent from './field-components/TextInputComponent.js'
import Link from '../data-sources/Link.js'
import FormController from '../FormController.js'
import { asyncConfirm } from '../../utilities/asyncConfirm.js'

import { Message, Outcome, Status } from '../../utilities/enums.js'

export default class LinkForm extends EditableComponent {
  constructor(parent, src) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, src);
    this.name = "link-form";

    if (this.src instanceof Link){
      this.title = "Edit Link";
      this.saveText = "Save";
      this.closeText = "Close";
      this.ctrl = new EditLinkController(this);
    }else{
      this.title = "Add Link";
      this.saveText = "Save";
      this.closeText = "Close";
      this.ctrl = new AddLinkController(this);
    }

    // Gatekeeper to prevent multiple submission
    // Form becomes active on show, inactive on hide
    // Can't submit unless active
    this.active = false;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;
    /*  Editable components */
    this.editableComponents.desc = new TextInputComponent(this, 'description', 'Description', undefined, "What is this link for?");
    this.editableComponents.url = new TextInputComponent(this, 'url', 'URL', undefined, "www.example.com");

    this.components.modal = new ModalComponent(this.wrapper, this, this.title, this.saveText, this.closeText, "Delete", this.src instanceof Link);
    this.wrapper.addClass('link-form');
    dom.modal = this.wrapper;
    dom.formBody = this.components.modal.getBodyDiv();
    dom.desc = this.editableComponents.desc.getWrapper();
    dom.url = this.editableComponents.url.getWrapper();

    dom.formBody.append(dom.desc)
                .append('<br/>')
                .append(dom.url);
  }

  updateDOM() {
    super.updateDOM();

    if (this.src instanceof Link){
      this.editableComponents.desc.value = this.src.description;
      this.editableComponents.url.value = this.src.url;
    }
    this.editableComponents.desc.updateDOM();
    this.editableComponents.url.updateDOM();
  }

  show(){
    if (!this.hasPopulated) {
      this.populate();
      this.updateDOM();
    }
    
    this.active = true;
    this.components.modal.show();
    if (!(this.src instanceof Link)) {
      this.editableComponents.desc.value = "";
      this.editableComponents.url.value = "";
    }

    this.updateDOM();
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
    return {
      name: ecs.desc.value,
      url: ecs.url.value,
    }
  }

  showFeedback(messages){
    if (messages.url && messages.url[0] != Outcome.SUCCESS){
      this.editableComponents.url.showErrorMessage(messages.url[1]);
    }
    if (messages.name && messages.name[0] != Outcome.SUCCESS) {
      this.editableComponents.name.showErrorMessage(messages.name[1]);
    }
  }

  handleMessage(id, msg, data){
    switch(id){
      case this.components.modal.id:
        if (msg === Message.CLOSE_MODAL){
          this.messageParent(Message.CLOSE_MODAL);
        }else if (msg === Message.SUBMIT){
          // This could be to a link controller (for updating) or a milestone or goal controller (for creating)
          if (this.active){
            this.disableSubmit();
            const comp = this;
            this.ctrl.submit().then(() => comp.enableSubmit());
          }
        } else if (msg === Message.DELETE) {
          if (this.active) {
            const comp = this;
            asyncConfirm("Are you sure you want to delete this link?", () => {
              comp.disableSubmit();
              comp.ctrl.delete().then(() => comp.enableSubmit());
            });
          }
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}

class EditLinkController extends FormController{
  async doSubmission(){
    const data = this.comp.getFormData();
    const resp = await this.src.update(data);
    /* resp is an object with properties:
    *   status: Status
    *   data: {
    *     url: [outcome, value]
    *     name: [outcome, value]
    *   }
    */
    switch (resp.status) {
      case Status.SUCCESS:
        // update Link src
        this.src.name = data.name;
        this.src.url = data.url;
        this.comp.messageParent(Message.EDIT_LINK);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp(showFeedback(resp.data));
        break;
    }
  }

  async doDeletion() {
    const resp = await this.src.delete();
    switch (resp.status) {
      case Status.SUCCESS:
        // update Link src
        this.comp.messageParent(Message.DELETE_LINK);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp(showFeedback(resp.data));
        break;
    }
  }
}

class AddLinkController extends FormController {
  async doSubmission(){
    const data = this.comp.getFormData();
    const link = new Link(data, this.src);
    const resp = await link.create();
    /* resp is an object with properties:
     *   status: Status
     *   data: {
     *     url: [outcome, value]
     *     name: [outcome, value]
     *   }
     */
    switch (resp.status) {
      case Status.SUCCESS:
        this.src.addLink(link);
        this.comp.messageParent(Message.ADD_LINK, link)
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }
}
