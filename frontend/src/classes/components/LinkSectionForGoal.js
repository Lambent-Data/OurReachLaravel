import EditableComponent from './EditableComponent.js'
import LinkComponent from './LinkComponent.js'
import IconButton from './IconButton.js'
import LinkForm from './LinkForm.js'
import { Message } from '../../utilities/enums.js'

export default class LinkSectionForGoal extends EditableComponent {

  constructor(parent, goal, placeholder="Add resources to help with this goal"){
    const wrapper = $('<div></div>');
    super(wrapper, parent, goal);
    this.name = "link-section-for-goal";

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
    if (this.editing) {
      comp.startEditing();
    }
    this.dom.linkBox.append(wrapper);
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.addClass('link-section-for-goal');

    this.components.linkForm = new LinkForm(this, this.src);
    this.editableComponents.addBtn = new IconButton(this, 'add-button');
   
    dom.sectionWrapper = this.wrapper;    
    dom.labelBox = $('<div class="field-label-box" style="padding-top:8px"></div>');
    dom.label = $('<span class="field-label">Links </span>');
    dom.labelBox.append(dom.label);
    dom.sectionWrapper.append(dom.labelBox);

    dom.addButton = this.editableComponents.addBtn.getWrapper();

    dom.linkBox = $('<div class="link-box"></div>');
    dom.sectionWrapper.append(dom.linkBox).append(dom.addButton);

    for (const link of this.src.links){
      this.addLinkComponent(link);
    }

    dom.placeholder = $('<div class="link-for-goal-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', ()=> comp.handleMessage("placeholder", Message.CLICK));
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
    this.components.linkForm.startEditing();
    this.components.linkForm.show();
  }

  closeForm() {
    this.components.linkForm.stopEditing();
    this.components.linkForm.hide();
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case this.editableComponents.addBtn.id:
      case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
        if (msg == Message.CLICK) {
          this.openForm();
        }
        return;
      case this.components.linkForm.id:
        if (msg == Message.ADD_LINK) {
          this.addLinkComponent(data);
          this.closeForm();
        } else if (msg == Message.CLOSE_MODAL) {
          this.closeForm();
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}