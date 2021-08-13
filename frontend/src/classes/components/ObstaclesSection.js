import JournalSection from './JournalSection.js'

export default class ObstaclesSection extends JournalSection {

  constructor(parent, milestone) {
    super(parent, milestone);
    this.name = "obstacles-section"

    this.populate();
    this.updateDOM();
  }

  populate() {
    this.wrapper.addClass('obstacles-section');
    super.populate();
  }

  updateDOM(){
    if(!this.src) return;

    const dom = this.dom;
    const src = this.src;

    dom.titleSpan.html("Obstacles");
    dom.promptText.html("What is stopping you from reaching this milestone?");
    
    if (this.src && this.src.obstacles) {
      dom.journalTextarea.html(this.src.obstacles);
    }
  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);
    const text = this.dom.journalTextarea.html();
    this.src.update({ obstacles: text });
  }
}