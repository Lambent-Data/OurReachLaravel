import Component from './Component.js'

export default class FeedbackComponent extends Component {

  constructor(parent) {
    const wrapper = $('<span class="feedback"></span>');
    super(wrapper, parent);
    this.name = "feedback-component";

    this.populate();
    this.updateDOM();
    this.clearMessage();
  }

  populate() {
    super.populate();
  }

  showSuccessMessage(msg) {
    this.wrapper.removeClass('hidden');
    this.wrapper.removeClass('error').addClass('success');
    this.wrapper.html(msg);
    this.hidden = false;
  }

  showErrorMessage(msg) {
    this.wrapper.removeClass('hidden');
    this.wrapper.removeClass('success').addClass('error');
    this.wrapper.html(msg);
  }

  showMessage(msg) {
    this.wrapper.removeClass('hidden');
    this.wrapper.removeClass(['error', 'success']);
    this.wrapper.html(msg);
  }

  clearMessage() {
    this.wrapper.addClass('hidden');
    this.wrapper.removeClass(['error', 'success']);
    this.wrapper.html("");
  }
}