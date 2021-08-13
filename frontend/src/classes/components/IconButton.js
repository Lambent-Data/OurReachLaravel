import Component from './Component.js'

export default class IconButton extends Component {

  constructor(parent, className) {
    const wrapper = $('<div class="action-icon js-hoverable js-activable"><div></div></div>');
    super(wrapper, parent);
    this.name = "icon-"+className;

    this.className = className;
    
    this.populate();
    this.updateDOM();
  }

  populate() {
    this.wrapper.addClass(this.className);
    if (this.parent){
      const comp = this;
      this.wrapper.on("click", () => comp.messageParent("clicked"));
    }
  }

  startEditing(){
    this.wrapper.addClass('editing');
  }

  stopEditing() {
    this.wrapper.removeClass('editing');
  }
}