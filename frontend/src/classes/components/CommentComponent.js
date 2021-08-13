import EditableComponent from './EditableComponent.js'
import CommentTextAreaComponent from './field-components/CommentTextAreaComponent.js';
import TextButtonComponent from './TextButtonComponent.js';
import FormController from '../FormController.js';
import Comment from '../data-sources/Comment.js';
import ClickableTextComponent from './ClickableTextComponent.js';
import { Status, Message } from '../../utilities/enums.js';
import { DateTime } from 'luxon';
import { asyncConfirm } from '../../utilities/asyncConfirm.js';
import User from '../data-sources/User.js';

export default class CommentComponent extends EditableComponent {

  constructor(parent, commentOrMilestone) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, commentOrMilestone);
    this.name = "comment-component";

    if (this.src instanceof Comment){
      this.ctrl = new EditCommentController(this);
    }else{
      this.ctrl = new AddCommentController(this);
    }

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.commentWrapper = this.wrapper;
    dom.commentWrapper.addClass('comment-wrapper');
    if (!(this.src instanceof Comment)) {
      dom.commentWrapper.css("order", 1);
    }
    this.editableComponents.textarea = new CommentTextAreaComponent(this, 'comment', undefined, 'Add a comment...', true);

    this.components.editText = new ClickableTextComponent(this, "Edit");
    this.components.cancelBtn = new TextButtonComponent(this, "Cancel");
    this.components.deleteBtn = new TextButtonComponent(this, "Delete");
    this.components.submitBtn = new TextButtonComponent(this, "Add Comment");

    dom.content = $('<div class="comment-content"></div>');
    dom.rightBox = $('<div class="comment-right-box"></div>');
    dom.commentBox = this.editableComponents.textarea.getWrapper();
    dom.dateAdded = $('<span class="comment-date"></span>');

    dom.underBox = $('<div class="comment-underbox"></div>');

    dom.buttonBox = $('<div class="comment-button-holder"></div>')
    dom.cancelBtn = this.components.cancelBtn.getWrapper();
    dom.deleteBtn = this.components.deleteBtn.getWrapper();
    dom.submitBtn = this.components.submitBtn.getWrapper();

    dom.commentWrapper.append(dom.content)
                      .append(dom.buttonBox);
    dom.buttonBox.append(dom.submitBtn);
    dom.rightBox.append(dom.commentBox);

    if (this.src instanceof Comment) {
      dom.userNameSpan = $('<span class="comment-user-name"></span>');
      dom.userPicture = $('<div class="comment-picture"><img src="' + this.src.image + '"/></div>');
      dom.commentWrapper.prepend(dom.userNameSpan);
      dom.content.append(dom.userPicture);
      dom.buttonBox.append(dom.deleteBtn);
      dom.rightBox.append(dom.underBox);
      dom.underBox.append(dom.dateAdded);
      if (this.src.user_id == User.currentUserId){
        // Only show the edit btn for the current user's comments
        dom.underBox.append(this.components.editText.getWrapper());
      }
    }

    dom.content.append(dom.rightBox);
    dom.buttonBox.append(dom.cancelBtn);

    if (!(this.src instanceof Comment)) {
      const comp = this;
      dom.commentBox.on('click tap', () => {
        if (!comp.editing){
          comp.startEditing();
        }
      });
    }
  }

  updateDOM(){
    super.updateDOM();
    const dom = this.dom;

    if (this.src instanceof Comment) {
      // src is a comment, so we are editing
      dom.cancelBtn.html("Cancel");
      dom.submitBtn.html("Save");
      dom.userNameSpan.html(this.src.user.name + " said...");
      this.editableComponents.textarea.value = this.src.comment_text;
      dom.dateAdded.html(this.src.created_at.toLocaleString(DateTime.DATETIME_FULL));
    }else{
      // src is milestone, so we are creating
      dom.cancelBtn.html("Cancel");
      dom.submitBtn.html("Add Comment");
    }
  }

  enable() {
    this.components.cancelBtn.enable();
    this.components.submitBtn.enable();
    this.components.deleteBtn.enable();
  }

  disable(){
    this.components.cancelBtn.disable();
    this.components.submitBtn.disable();
    this.components.deleteBtn.disable();
  }

  clear(){
    this.editableComponents.textarea.value = "";
  }

  getFormData(){
    return { comment_text: this.editableComponents.textarea.value };
  }

  showFeedback(data){
    this.editableComponents.textarea.showErrorMessage(data.comment_text);
  }

  startEditing(recurseDown = true, recurseUp = false) {
    super.startEditing(recurseDown, recurseUp);
    this.editableComponents.textarea.focus();
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
  }

  handleMessage(id, msg) {
    if (this.hasPopulated) {
      switch (id) {
        case this.components.cancelBtn.id:
          if (msg == Message.CLICK) {
            this.stopEditing();
          }
          break;
        case this.components.deleteBtn.id:
          if (msg == Message.CLICK) {
            const comp = this;
            asyncConfirm("Are you sure you want to delete this comment?", () => {
              comp.disable();
              comp.ctrl.delete().then(() => { comp.enable(); comp.stopEditing(); });
            });
          }
          break;
        case this.components.submitBtn.id:
          if (msg == Message.CLICK) {
            const comp = this;
            comp.disable();
            if (this.src instanceof Comment) {
              this.ctrl.submit().then(() => { comp.enable(); comp.stopEditing(); });
            }else{
              this.ctrl.submit().then(() => { comp.enable(); comp.clear() });
            }
          }
          break;
        case this.components.editText.id:
          if (msg == Message.CLICK) {
            this.startEditing();
          }
          break;
      }
    }
    super.handleMessage(id, msg);
  }
}

class EditCommentController extends FormController {
  async doSubmission() {
    const data = this.comp.getFormData();
    const resp = await this.src.update(data);
    switch (resp.status) {
      case Status.SUCCESS:
        this.src.comment_text = data.comment_text;
        this.comp.messageParent(Message.EDIT_COMMENT);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }

  async doDeletion(){
    const resp = await this.src.delete();
    switch (resp.status) {
      case Status.SUCCESS:
        this.comp.messageParent(Message.DELETE_COMMENT);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }  }
}

class AddCommentController extends FormController {
  async doSubmission() {
    const data = this.comp.getFormData();
    const comment = new Comment(data, this.src);
    const resp = await comment.create();
    switch (resp.status) {
      case Status.SUCCESS:
        this.src.addComment(comment);
        this.comp.messageParent(Message.ADD_COMMENT, comment);
        this.comp.stopEditing();
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }
}