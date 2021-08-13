import EditableComponent from './EditableComponent.js'
import CommentComponent from './CommentComponent.js'
import { Message } from '../../utilities/enums.js'

export default class CommentSection extends EditableComponent {

  constructor(parent, milestone, placeholder="No comments yet"){
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "comment-section";

    this.wrapper.addClass("empty");

    this.populate();
    this.updateDOM();
  }

  addCommentComponent(comment) {
    this.wrapper.removeClass("empty");
    const comp = new CommentComponent(this, comment);
    const wrapper = comp.getWrapper();
    this.components[comp.id] = comp;
    this.dom.commentBox.append(wrapper);
  }

  deleteCommentComponent(compId) {
    this.components[compId].getWrapper().remove();
    this.components[compId] = undefined;
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.components.createComment = new CommentComponent(this, this.src);
    //this.components.createComment.startEditing();

    this.wrapper.addClass("comments-section");
    dom.sectionWrapper = this.wrapper;
    dom.commentBox = $('<div class="comment-box"></div>');
    dom.createComment = this.components.createComment.getWrapper();

    dom.sectionWrapper.append(dom.commentBox);
    dom.commentBox.append(dom.createComment);

    dom.placeholder = $('<div class="comment-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', () => comp.handleMessage("placeholder", Message.CLICK));
    dom.commentBox.append(dom.placeholder);
  }

  startEditing(recurseDown = true, recurseUp = false) {
    super.startEditing(recurseDown, recurseUp);
    this.messageParent(Message.START_EDITING);
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    this.messageParent(Message.STOP_EDITING);
  }

  handleMessage(id, msg, data) {
    switch (id) {
      case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
        if (msg == Message.CLICK){
          this.components.createComment.startEditing();
        }
        return;
      case this.components.createComment.id:
        if (msg == Message.ADD_COMMENT) {
          this.addCommentComponent(data);
        }
        return;
      default:
        if (msg == Message.DELETE_COMMENT) {
          this.deleteCommentComponent(id);
        }
    }
    super.handleMessage(id, msg, data);
  }
}