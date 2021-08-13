import Component from './Component.js'
import { Message } from '../../utilities/enums.js'

export default class ClickableTextComponent extends Component {

  constructor(parent, text) {
    const wrapper = $('<span class="clickable-text js-hoverable"></span>');
    super(wrapper, parent);
    this.name = "clickable-text";

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
}