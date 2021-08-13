import EditableComponent from './EditableComponent.js'

export default class ImageComponent extends EditableComponent {

  constructor(wrapper, inspiration) {
    super(wrapper, inspiration);
    this.name = "inspirational-image";

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;
    
    this.wrapper.removeClass();
    dom.wrapperDiv = this.wrapper;
    dom.imageDiv = $('<div class="square-image"></div>')

    dom.sectionWrapper.append(dom.titleDiv);
    dom.sectionWrapper.append(dom.goalBox);
  }

  updateDOM() {
    if (!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.imageDiv.css({'background-image': 'url("' + src.url + '")', 'background-position': src.xpos + 'px ' + src.ypos + 'px'});
  }
}