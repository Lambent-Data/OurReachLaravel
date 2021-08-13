import Component from './Component.js'
import { Message } from '../../utilities/enums.js';
import { ParticleSystem } from '../../animations/confetti.js';

export default class ConfettiModal extends Component {

  constructor(wrapper, parent, htmlContent) {
    super(wrapper, parent);
    this.name = "confetti-modal";
    this.content = htmlContent;
 
    this.populate();
    this.updateDOM();
  }

  populate() {
    this.wrapper.empty();
    this.wrapper.removeClass().addClass('modal fade modal-overflow ld-modal');
    this.wrapper.attr({'data-backdrop': 'static', 'data-keyboard': 'false', 'tabindex': '-1', 'role': 'dialog'});  
    const dom = this.dom;

    dom.confetti = $('<canvas class="confetti"></canvas>');
    dom.confetti.attr("width", window.innerWidth);
    dom.confetti.attr("height", window.innerHeight);
    console.log(dom.confetti);
    const context = dom.confetti.get(0).getContext('2d');
    console.log(context);
    this.particles = new ParticleSystem(4.5, { x: window.innerWidth / 2, y: -20 }, context);
    const part = this.particles;
    $(window).on('resize', function () {
      if (part.particles) {
        part.position = { x: window.innerWidth / 2, y: -40 };
      }
      dom.confetti.attr("width", window.innerWidth);
      dom.confetti.attr("height", window.innerHeight);
    });

    dom.modal = this.wrapper;
    dom.dialog = $('<div class="modal-dialog" role="document"></div>');
    dom.content = $('<div class="modal-content"></div>');
    dom.footer = $('<div class="modal-footer"></div>');

    dom.body = $('<div class="modal-body"></div>');
    dom.closeBtn = $('<button type="button" class="btn btn-secondary">Close</button>');


    dom.modal.append(dom.confetti)
             .append(dom.dialog);
    dom.dialog.append(dom.content);
    dom.content.append(dom.body)
               .append(dom.footer);
    dom.footer.append(dom.closeBtn);

    const comp = this;
    dom.closeBtn.on('click', () => comp.hide());

    $('body').append(this.wrapper);
  }

  updateDOM(){
    super.updateDOM();
    const dom = this.dom;

    dom.body.html(this.content);
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

  getBodyDiv(){
    return this.dom.body;
  }

  show(){
    this.dom.modal.modal('show');
    this.particles.start();
  }

  hide(){
    this.dom.modal.modal('hide');
    this.particles.stop();
  }

}