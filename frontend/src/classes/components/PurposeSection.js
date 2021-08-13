import JournalSection from './JournalSection.js'

export default class PurposeSection extends JournalSection {

  constructor(parent, milestone) {
    super(parent, milestone);
    this.name = "purpose-section"

    this.populate();
    this.updateDOM();
  }

  populate() {
    this.wrapper.addClass('purpose-section');
    super.populate();
  }

  updateDOM(){
    if(!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.titleSpan.html("Purpose");
    dom.promptText.html("Why do you want to achieve this milestone?");
    
    if (this.src && this.src.purpose) {
      dom.journalTextarea.html(this.src.purpose);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    const text = this.dom.journalTextarea.html();
    this.src.update({ purpose: text });
  }
}