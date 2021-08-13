import Component from './Component.js'

export default class Accordion extends Component {
  expansionScale = 1;

  constructor(parent, startOpen=false, openingRate = 600, closingRate = 600, minHeight=0){
    const wrapper = $('<div></div>');
    super(wrapper, parent);
    this.name = "accordion";

    this.openingRate = openingRate; // in pixels per second
    this.closingRate = closingRate; // in pixels per second
    this.isOpen = false;

    this.minHeight = minHeight;
    this.maxHeight = minHeight;

    this.expansionTimeout = undefined;

    this.populate();
    this.updateDOM();
    if(startOpen){
      this.snapOpen();
    }
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.removeClass().addClass('accordion');
    dom.accordion = this.wrapper;
    dom.accordionContent = $('<div class="accordion-content"></div>');
    dom.accordion.append(dom.accordionContent);

    this.dom.accordion.css({
      "transition": '',
      "min-height": this.minHeight + "px",
      "max-height": this.maxHeight + "px"
    });
  }

  getContentDiv(){
    return this.dom.accordionContent;
  }

  toggle(){
    if (this.isOpen){
      this.close();
    }else{
      this.open();
    }
  }

  snapOpen() {
    if (this.isOpen) {
      return;
    }

    if (this.expansionTimeout) {
      clearTimeout(this.expansionTimeout);
    }

    this.isOpen = true;
    this.dom.accordion.addClass('open');
    this.dom.accordion.css({
      "transition": '',
      "max-height": ''
    });
  }

  snapClosed() {
    if (!this.isOpen) {
      return;
    }

    if (this.expansionTimeout) {
      clearTimeout(this.expansionTimeout);
    }

    this.isOpen = false;
    this.dom.accordion.removeClass('open');

    const currentHeight = this.dom.accordion.height();
    this.dom.accordion.css({
      "transition": '',
      "max-height": this.minHeight + "px",
    });
    this.maxHeight = this.minHeight;
  }

  open(){
    if (this.isOpen){
      return;
    }

    if (this.expansionTimeout) {
      clearTimeout(this.expansionTimeout);
    }

    this.isOpen = true;
    this.dom.accordion.addClass('open');

    this.expansionCheckIn();
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    if (this.expansionTimeout) {
      clearTimeout(this.expansionTimeout);
    }

    this.isOpen = false;
    this.dom.accordion.removeClass('open');

    const currentHeight = this.dom.accordion.height();
    this.dom.accordion.css({
      "transition": '',
      "max-height": currentHeight + "px"
    });
    this.maxHeight = currentHeight;

    this.expansionCheckIn();
  }

  expansionCheckIn() {
    /* Helper function for expanding with jQuery */
    this.expansionTimeout = undefined;

    const comp = this;
    function transitionToMaxHeight(maxHeight){
      let duration;
      if (maxHeight > comp.maxHeight){
        duration = (maxHeight - comp.maxHeight) / comp.openingRate; // in seconds
      }else{
        duration = (comp.maxHeight - maxHeight) / comp.closingRate; // in seconds
      }
      if (duration > 0.05){
        comp.dom.accordion.css({
          "transition": "max-height " + duration + "s linear",
          "max-height": maxHeight + "px"
        });
      }else{
        comp.dom.accordion.css({
          "transition": '',
          "max-height": maxHeight + "px"
        });
      }
      comp.maxHeight = maxHeight;

      return duration;
    }
    
    function setMaxHeight(maxHeight) {
      comp.dom.accordion.css({
        "transition": '',
        "max-height": maxHeight + "px"
      });
      comp.maxHeight = maxHeight;
    }

    const currentHeight = this.dom.accordion.height();

    let duration;

    if (this.isOpen && this.maxHeight != undefined){
      if (currentHeight < 0.9*this.maxHeight) {
        // We have expanded enough!
        this.maxHeight = undefined;
        this.dom.accordion.css({
          "transition": '',
          "max-height": ''
        });
        return;
      } else {
        duration = transitionToMaxHeight(currentHeight + this.openingRate);
      }
    }else{
      if (currentHeight <= 0){
        // Fully closed
        setMaxHeight(this.minHeight);
        return;
      }else{
        duration = transitionToMaxHeight(Math.max(0, currentHeight - this.closingRate));
      }
    }
    
    this.expansionTimeout = setTimeout(() => comp.expansionCheckIn(), 1000 * duration);
  }
}