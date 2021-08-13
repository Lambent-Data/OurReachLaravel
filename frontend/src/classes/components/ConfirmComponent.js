import Component from './Component.js'

export default class ConfirmComponent extends Component {

  constructor(message, callback) {
    super();
    this.name = "confirm";

    this.message = message;
    this.callback = callback;
 
    this.populate();
    this.updateDOM();
    $('body').append(this.wrapper);
    this.show();
  }

  populate() {
    this.wrapper.empty();
    this.wrapper.removeClass().addClass('modal fade modal-overflow ld-modal');
    this.wrapper.attr({'data-backdrop': 'static', 'data-keyboard': 'false', 'tabindex': '-1', 'role': 'dialog'});

    const dom = this.dom;

    dom.modal = this.wrapper;
    dom.dialog = $('<div class="modal-dialog" role="document" style="max-width:300px; top:30vh; left:calc(50vw - 150px); position: fixed !important;"></div>');
    dom.content = $('<div class="modal-content"></div>');
   
    dom.body = $('<div class="modal-body"></div>');

    dom.messageSpan = $('<span style="margin:auto;"></span>');
    dom.messageSpan.html(this.message);

    dom.footer = $('<div class="modal-footer"></div>');
    
    dom.cancelBtn = $('<button type="button" class="btn btn-secondary">Cancel</button>');
    dom.okayBtn = $('<button type="button" class="btn btn-primary">Okay</button>');

    dom.modal.append(dom.dialog);
    dom.dialog.append(dom.content);
    dom.content.append(dom.body)
               .append(dom.footer);

    dom.body.append(dom.messageSpan);
    dom.footer.append(dom.cancelBtn);
    dom.footer.append(dom.okayBtn);

    const comp = this;
    dom.okayBtn.on('click', ()=>{
      comp.callback();
      comp.close();
    });
    dom.cancelBtn.on('click', () => {
      comp.close();
    });
  }

  show(){
    this.dom.modal.modal('show');
  }

  close(){
    this.dom.modal.modal('hide');
    const w = this.wrapper;
    setTimeout(()=> w.remove(), 1000);
  }

}