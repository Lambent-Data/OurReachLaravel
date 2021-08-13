import Component from './Component.js'
import { Message } from '../../utilities/enums.js';

export default class ModalComponent extends Component {

  constructor(wrapper, parent, title, saveText = "Save", closeText = "Close", deleteText="Delete", includeDelete=false) {
    super(wrapper, parent);
    this.name = "modal";
    this.title = title;
    this.closeText = closeText;
    this.deleteText = deleteText;
    this.saveText = saveText;
    this.includeDelete = includeDelete;
 
    this.populate();
    this.updateDOM();
    $('body').append(wrapper);
  }

  populate() {
    this.wrapper.empty();
    this.wrapper.removeClass().addClass('modal fade modal-overflow ld-modal');
    this.wrapper.attr({'data-backdrop': 'static', 'data-keyboard': 'false', 'tabindex': '-1', 'role': 'dialog'});

    const dom = this.dom;

    dom.modal = this.wrapper;
    dom.dialog = $('<div class="modal-dialog" role="document" style="margin-bottom: 40px"></div>');
    dom.content = $('<div class="modal-content"></div>');
    dom.header = $('<div class="modal-header"></div>');
    dom.title = $('<h5 class="modal-title"></h5>');
    
    dom.body = $('<div class="modal-body"></div>');

    dom.footer = $('<div class="modal-footer"></div>');
    
    const comp = this;
    dom.closeBtn = $('<button type="button" class="btn btn-secondary"></button>').html(this.closeText);
    dom.closeBtn.on('click', () => comp.messageParent(Message.CLOSE_MODAL));
    dom.submitBtn = $('<button type="button" class="btn btn-primary"></button>').html(this.saveText);
    dom.submitBtn.on('click', () => comp.messageParent(Message.SUBMIT));
    if (this.includeDelete) {
      dom.deleteBtn = $('<button type="button" class="btn btn-warning"></button>').html(this.deleteText);
      dom.deleteBtn.on('click', () => comp.messageParent(Message.DELETE));
    }

    dom.modal.append(dom.dialog);
    dom.dialog.append(dom.content);
    dom.content.append(dom.header)
               .append(dom.body)
               .append(dom.footer);

    dom.header.append(dom.title);
    dom.footer.append(dom.closeBtn);
    if (this.includeDelete){
      dom.footer.append(dom.deleteBtn);
    }
    dom.footer.append(dom.submitBtn);

  }

  updateDOM(){
    super.updateDOM();
    const dom = this.dom;

    dom.title.html(this.title);
    dom.closeBtn.html(this.closeText);
    dom.submitBtn.html(this.saveText);
  }

  hideSubmitButton(){
    this.dom.submitBtn.hide();
  }

  showSubmitButton() {
    this.dom.submitBtn.show();
  }

  disableSubmitButton() {
    this.dom.submitBtn.prop('disabled', true);
  }

  enableSubmitButton() {
    this.dom.submitBtn.prop('disabled', false);
  }

  disableDeleteButton() {
    if (this.includeDelete) {
      this.dom.deleteBtn.prop('disabled', true);
    }
  }

  enableDeleteButton() {
    if (this.includeDelete){
      this.dom.deleteBtn.prop('disabled', false);
    }
  }

  getBodyDiv(){
    return this.dom.body;
  }

  show(){
    this.dom.modal.modal('show');
  }

  hide(){
    this.dom.modal.modal('hide');
  }

}