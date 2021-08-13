import EditableComponent from './EditableComponent.js'
import { Message } from '../../utilities/enums.js';
import User from '../data-sources/User.js';

export default class JournalSectionManager extends EditableComponent {

  constructor(parent, milestone) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "journal-section"

    this.accordionOpen = false;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    dom.sectionWrapper = this.wrapper;
    dom.journalWrapper = $('<div class="ms-journal-wrapper"></div>');
    dom.journalContent = $('<div class="ms-journal-content"></div>');
    dom.journalHeader = $('<div class="ms-journal-header"></div>');
    dom.journalTitle = $('<div class="ms-journal-title"></div>');
    dom.titleSpan = $('<span class="no-select"></span>');
    dom.promptWrapper = $('<div class="ms-journal-prompt"></div>');
    dom.promptText = $('<div class="ms-journal-textarea no-select"></div>');
    dom.accordion = $('<div class="ms-journal-accordion open"></div>');
    dom.journalTextarea = $('<div class="ms-journal-textarea"></div>');
    dom.accordionButton = $('<div class="ms-journal-accordion-button js-hoverable"><div></div></div>');

    dom.sectionWrapper.append(dom.journalWrapper);
    dom.journalWrapper.append(dom.journalContent);
    dom.journalContent.append(dom.journalHeader);

    dom.journalHeader.append(dom.journalTitle);
    dom.journalTitle.append(dom.titleSpan);
    dom.journalHeader.append(dom.promptWrapper);
    dom.promptWrapper.append(dom.promptText);

    dom.journalContent.append(dom.accordion);
    dom.accordion.append(dom.journalTextarea);
    dom.accordion.append(dom.accordionButton);

    if (this.src.user_id == User.currentUserId) {
      dom.journalWrapper.append(dom.editButton);
    }

    const comp = this;
    $(window).resize(function () {
      comp.showOrHideAccordionButton();
    });
    /******* Add handlers *******/

    /* Show or hide accordion button, depending on whether there is
     * enough content in the textarea to expand the accordion.
     */
    dom.journalTextarea.on('input', ()=> this.onChange());


    dom.journalTextarea.on("focus", () => this.openAccordion());

    /* Toggle accordion open/closed using the button */
    dom.accordionButton.on("click", () => comp.toggleAccordion());

    dom.journalTextarea.on("dblclick", () => comp.startEditing());

    dom.sectionWrapper.on("blur", () => comp.stopEditing());

    this.closeAccordion();
  }

  updateDOM() {
    if (!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.titleSpan.html("Journal");
    dom.promptText.html("Write your thoughts here.");
    this.closeAccordion();
  }

  onChange(){
    this.showOrHideAccordionButton();
  }


  /* Show or hide the accordion button (to expand or minimize) associated with a journal textarea,
   * based on whether the height is larger than the minimum.
   */
  showOrHideAccordionButton() {
    const textarea = this.dom.journalTextarea;
    const accordionButton = this.dom.accordionButton;
    if (accordionButton.css('display') === 'none' && textarea.height() > parseInt(textarea.css('min-height'))) {
      accordionButton.css('display', 'block');
    } else {
      if (accordionButton.css('display') !== 'none' && textarea.height() <= parseInt(textarea.css('min-height'))) {
        accordionButton.css('display', 'none');
      }
    }
  }


  toggleAccordion() {
    if (this.accordionOpen) {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
  }


  openAccordion(){
    this.accordionOpen = true;
    this.dom.accordion.removeClass('closed');
    this.dom.accordion.addClass('open');
  }


  closeAccordion(){
    this.accordionOpen = false;
    this.dom.accordion.removeClass('open');
    this.dom.accordion.addClass('closed');
    this.showOrHideAccordionButton();
  }

  
  startEditing(recurseDown = true, recurseUp = false){
    if (this.src.user_id == User.currentUserId) {
      super.startEditing(recurseDown, recurseUp);
      this.openAccordion();
      this.dom.journalTextarea.attr("contenteditable", true);
      setTimeout(() => this.dom.journalTextarea.focus(), 0);
      this.messageParent(Message.START_EDITING);
    }
  }

  
  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    this.dom.journalTextarea.attr("contenteditable", false);
    this.messageParent(Message.STOP_EDITING);
  }
}