import EditableComponent from './EditableComponent.js'
import LinkComponent from './LinkComponent.js'
import LinkForm from './LinkForm.js';

import IconButton from './IconButton.js'
import { Message } from '../../utilities/enums.js'

export default class LinkSection extends EditableComponent {

  constructor(parent, milestone, placeholder ="Add resources to help with this milestone"){
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "link-section"

    this.wrapper.addClass("empty");
    this.placeholder = placeholder;
    this.populate();
    this.updateDOM();
  }

  addLinkComponent(link) {
    this.wrapper.removeClass("empty");
    const comp = new LinkComponent(this, link);
    const wrapper = comp.getWrapper();
    this.editableComponents[comp.id] = comp;
    if (this.editing){
      comp.startEditing();
    }
    this.dom.linkBox.append(wrapper);
  }

  deleteLinkComponent(id) {
    if (id in this.editableComponents) {
      this.editableComponents[id].getWrapper().remove();
      delete this.editableComponents[id];

      // Figure out if the section is empty
      for (const comp of Object.values(this.editableComponents)) {
        if (comp instanceof LinkComponent) {
          return;
        }
        this.wrapper.addClass("empty");
      }
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    /* Create form for adding new link */
    this.components.linkForm = new LinkForm(this, this.src);
    this.editableComponents.addBtn = new IconButton(this, 'add-button');

    this.wrapper.addClass('links-section');

    dom.sectionWrapper = this.wrapper;
    dom.titleDiv = $('<div class="ms-section-title"></div>');
    dom.linkBox = $('<div class="link-box"></div>');
    dom.addButton = this.editableComponents.addBtn.getWrapper();

    dom.sectionWrapper.append(dom.addButton);
    dom.sectionWrapper.append(dom.editButton);
    dom.sectionWrapper.append(dom.titleDiv);
    dom.sectionWrapper.append(dom.linkBox);
    //dom.linkBox.append(dom.addButton);
    dom.titleDiv.append('<h4>Helpful Links<h4>');

    dom.placeholder = $('<div class="link-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', () => comp.handleMessage("placeholder", Message.CLICK));
    dom.linkBox.append(dom.placeholder);
  }

  updateDOM(){
    super.updateDOM();
    const dom = this.dom;
  }

  startEditing(recurseDown = true, recurseUp = false) {
    super.startEditing(recurseDown, recurseUp);
    this.messageParent(Message.START_EDITING);
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    this.messageParent(Message.STOP_EDITING);
  }

  openForm() {
    this.components.linkForm.show();
    this.components.linkForm.startEditing();
  }

  closeForm() {
    this.components.linkForm.stopEditing();
    this.components.linkForm.hide();
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case this.editableComponents.addBtn.id:
      case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
        if (msg == Message.CLICK){
          this.openForm();
        }
        return;
      case this.components.linkForm.id:
        if (msg == Message.ADD_LINK){
          this.addLinkComponent(data);
          this.closeForm();
        } else if (msg == Message.CLOSE_MODAL) {
          this.closeForm();
        }
        return;
    }
    if (id in this.editableComponents){
      if (msg == Message.DELETE_LINK) {
        this.deleteLinkComponent(id);
      }
    }
    super.handleMessage(id, msg, data);
  }
}