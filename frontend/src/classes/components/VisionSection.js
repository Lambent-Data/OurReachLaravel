import JournalSection from './JournalSection.js'

export default class VisionSection extends JournalSection {

  constructor(parent, milestone) {
    super(parent, milestone);
    this.name = "vision-section"

    this.populate();
    this.updateDOM();
  }

  populate() {
    this.wrapper.addClass('vision-section');
    super.populate();
  }

  updateDOM(){
    if(!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.titleSpan.html("Vision");
    dom.promptText.html("What does it look like when you reach this milestone?");
    
    if(this.src && this.src.vision){
      dom.journalTextarea.html(this.src.vision);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    const text = this.dom.journalTextarea.html();
    this.src.update({vision: text});
  }
}