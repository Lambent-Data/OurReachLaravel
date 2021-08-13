import CommentComponent from '../CommentComponent.js';
import Component from '../Component.js'
import MilestoneComponent from '../MilestoneComponent.js'

export default class TestPage extends Component {

  constructor(wrapper, src){
    super(wrapper, undefined, src);
    this.name = "test-page";


    this.populate();
    this.updateDOM();
  }

  populate() {
    const dom = this.dom;
    const src = this.src;

    dom.bodyDiv = $('#dashboard-body');

    this.components.ms = new MilestoneComponent(this, this.src);

    this.components.comment = new CommentComponent(this);

    dom.bodyDiv.append(this.components.ms.getWrapper());
    dom.bodyDiv.append(this.components.comment.getWrapper());
  }

  updateDOM(){

  }
}