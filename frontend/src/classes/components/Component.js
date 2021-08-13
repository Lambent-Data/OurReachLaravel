export default class Component {
  static latest_id = 1000;
  static dir = {};

  static getFreshId(){
    Component.latest_id += 1;
    return Component.latest_id;
  }

  static register(comp){
    const id = Component.getFreshId();
    comp.id = id;
    Component.dir[id] = comp;
  }


  constructor(wrapper, parent = undefined, src = undefined){
    if (wrapper){
      this.wrapper = wrapper;
    }else{
      this.wrapper = $('<div></div>');
    }

    Component.register(this);

    this.name = "component-name";

    this.parent = parent;

    this.components = {};

    /* dom is an object listing the descendants in the DOM that the manager will manage. */
    this.dom = {};

    /* src is a DataSource containing the fields that show up in the component */
    this.src = src;

    /* There may also be state variables, separate from the source data, that capture
    *  the state of the component.
    */

    this.hasPopulated = false;
  }

  getWrapper() {
    return this.wrapper;
  }

  populate() {
    this.wrapper.empty();
  }

  /* updateDOM()
   * Update the changeable parts of the DOM components using current data from the src,
   * and the current state.
   */
  updateDOM(){
    this.hasPopulated = true;
  }

  /* handleMessage()
   *
   */
  handleMessage(id, msg, data){
    console.log(this.name + " received \"" + msg + "\" from " + Component.dir[id].name + " " + id);
  }

  messageParent(msg, data) {
    if (this.parent) {
      this.parent.handleMessage(this.id, msg, data);
    }
  }
}
