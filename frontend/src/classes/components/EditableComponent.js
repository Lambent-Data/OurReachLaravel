import Component from './Component.js'
import IconButton from './IconButton.js';

export default class EditableComponent extends Component {
  constructor(wrapper, parent = undefined, src = undefined) {
    super(wrapper, parent, src);
    this.name = "editable-component";

    /* editableComponents holds any EditableComponent objects subordinate to this */
    this.editableComponents = {};

    this.editing = false;
    
  }

  populate(){
    super.populate();
    
    this.editableComponents.editButton = new IconButton(this, 'edit-button');
    this.dom.editButton = this.editableComponents.editButton.getWrapper();
    
    this.dom.editButton.on("click", () => {
      if (this.editing) {
        this.stopEditing();
      } else {
        this.startEditing();
      }
    });
  }
  
  updateDOM(){
    super.updateDOM();
  }

  startEditing(recurseDown = true, recurseUp = false) {
    this.editing = true;
    this.wrapper.addClass("editing");
    this.dom.editButton.addClass("editing");

    if(recurseDown){
      Object.values(this.editableComponents).forEach(comp => comp.startEditing(true, false));
    }
    if (recurseUp && this.parent && typeof this.parent['startEditing'] == "function") {
      this.parent.startEditing(false, true);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    this.editing = false;    
    this.wrapper.removeClass("editing");
    this.dom.editButton.removeClass("editing");

    if (recurseDown) {
      Object.values(this.editableComponents).forEach(comp => comp.stopEditing(true, false));
    }
    if (recurseUp && this.parent && typeof this.parent['stopEditing'] == "function") {
      this.parent.stopEditing(false, true);
    }
  }
}