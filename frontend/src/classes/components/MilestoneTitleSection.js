import IconComponent from './IconComponent.js'
import EditableComponent from './EditableComponent.js'
import MilestoneEditForm from './MilestoneEditForm.js';
import User from '../data-sources/User.js';
import { Pages, Message } from '../../utilities/enums.js';
import { redirect } from '../../utilities/request.js';

export default class MilestoneTitleSection extends EditableComponent {

  constructor(parent, milestone){
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "title-section"

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.addClass("title-section");

    this.components.editForm = new MilestoneEditForm(this, this.src);
    this.components.icon = new IconComponent(this, this.src.category, false);

    dom.sectionWrapper = this.wrapper;
    dom.headerDiv = $('<div class="header"></div>');
    dom.categoryIconWrapper = this.components.icon.getWrapper();
    dom.titleDiv = $('<div class="header-title"></div>');
    dom.milestoneNameText = $('<h4></h4>'); // Milestone Name
    dom.categorySpan = $('<span></span>'); // Category > Subcategory

    dom.sectionWrapper.append(dom.headerDiv);
    dom.headerDiv.append(dom.categoryIconWrapper)
                 .append(dom.titleDiv);
    if (this.src.user_id == User.currentUserId) {
      dom.headerDiv.append(dom.editButton);
    }
    dom.titleDiv.append(dom.milestoneNameText);
    dom.titleDiv.append(dom.categorySpan);
  }

  updateDOM(){
    super.updateDOM();
    if(!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.milestoneNameText.html(src.name);
    
    if(src.category){
      if(src.subcategory){
        dom.categorySpan.html(src.category + " > " + src.subcategory);
      }else{
        dom.categorySpan.html(src.category);
      }
    }
  }

  startEditing(recurseDown = true, recurseUp = false){
    super.startEditing(recurseDown, recurseUp);
    this.components.editForm.startEditing();
    this.components.editForm.show();
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    this.components.editForm.stopEditing();
    this.components.editForm.hide();
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case this.components.editForm.id:
        if (msg == Message.SUBMIT) {
        } else if (msg == Message.DELETE_MILESTONE) {
          this.messageParent(Message.DELETE_MILESTONE);
          redirect({ page: Pages.LISTING });
          this.stopEditing();
        } else if (msg == Message.EDIT_MILESTONE) {
          this.stopEditing();
        }else if (msg == Message.CLOSE_MODAL) {
          this.stopEditing(true, false);
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}