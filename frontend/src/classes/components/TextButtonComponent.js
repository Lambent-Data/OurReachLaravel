import Component from './Component.js'
import { Message } from '../../utilities/enums.js'

export default class TextButtonComponent extends Component {

  constructor(parent, text, btnClass="primary-contained") {
    const wrapper = $('<button class="' + btnClass + ' js-hoverable"></button>');
    super(wrapper, parent);
    this.name = "text-button";

    this.text = text;
    
    this.populate();
    this.updateDOM();
  }

  populate() {
    if (this.parent){
      const comp = this;
      this.wrapper.on("click", () => comp.messageParent(Message.CLICK));
    }
  }

  updateDOM() {
    this.wrapper.html(this.text);
  }

  enable(){
    this.wrapper.prop("disabled", false);
  }

  disable() {
    this.wrapper.prop("disabled", true);
  }

  setLabel(label){
    this.text = label;
    this.updateDOM();
  }
}