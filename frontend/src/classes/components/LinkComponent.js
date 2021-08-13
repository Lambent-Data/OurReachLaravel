import Link from '../data-sources/Link.js'
import EditableComponent from './EditableComponent.js'
import LinkForm from './LinkForm.js';
import { Message } from '../../utilities/enums.js';
import { redirect } from '../../utilities/request.js';

export default class LinkComponent extends EditableComponent {

  constructor(parent, link){
    const wrapper = $('<div></div>');
    super(wrapper, parent, link);
    this.name = "link-component";

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.removeClass().addClass('link-wrapper');

    dom.wrapperDiv = this.wrapper;
    dom.linkDiv = $('<div class="link js-hoverable"></div>');
    dom.contentDiv = $('<div class="link-content"></div>');
    dom.nameSpan = $('<span class="no-select link-name"></span>');
    dom.linkIcon = $('<i class="fa fa-external-link-alt fa-lg link-icon"></i>');
    dom.editIcon = $('<i class="fa fa-edit fa-lg edit-icon"></i>');
    
    dom.wrapperDiv.append(dom.linkDiv);
    dom.linkDiv.append(dom.contentDiv);
    dom.contentDiv.append(dom.infoDiv);
    dom.contentDiv.append(dom.nameSpan)
                  .append(dom.linkIcon)
                  .append(dom.editIcon);
    
    const comp = this;
    dom.linkDiv.on("mouseup", (e) => {
      if (e.which !== 1){
        // Only look for left mouse clicks!
        return false;
      }
      if (!comp.editing){
        comp.goToLink();
      }else{
        comp.openForm();
      }
    });

    /* Create editing form */
    this.components.linkForm = new LinkForm(this, this.src);

  }

  updateDOM(){
    if(!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.nameSpan.html(src.description);
    
    this.wrapper.removeClass(["user-link", "staff-link", "template-link"]);
    switch (src.origin){
      case Link.Types.user:
        this.wrapper.addClass("user-link");
        break;
      case Link.Types.staff:
        this.wrapper.addClass("staff-link");
        break;
      case Link.Types.template:
        this.wrapper.addClass("template-link");
        break;
    }
  }

  goToLink() {
    redirect(this.src.url);
  }

  openForm(){
    this.components.linkForm.startEditing();
    this.components.linkForm.show();
  }

  closeForm() {
    this.components.linkForm.stopEditing();
    this.components.linkForm.hide();
  }

  startEditing(recurseDown = true, recurseUp = false) {
    if (this.src.origin != Link.Types.template){
      super.startEditing(recurseDown, recurseUp);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case this.components.linkForm.id:
        if (msg == Message.EDIT_LINK) {
          this.updateDOM();
          this.closeForm();
        } else if (msg == Message.DELETE_LINK) {
          this.messageParent(Message.DELETE_LINK);
          this.closeForm();
        } else if (msg == Message.CLOSE_MODAL) {
          this.closeForm();
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}
