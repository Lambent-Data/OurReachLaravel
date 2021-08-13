import Component from "./Component"

export default class Slider extends Component {
  constructor(parent, numSlides = 2, startingSlide = 0, duration = 500){
    const wrapper = $('<div class="slider-wrapper"></div>');
    super(wrapper, parent);

    this.duration = duration;
    this.numSlides = numSlides;
    this.currentSlide = startingSlide;

    this.populate();
    this.updateDOM();
  }

  populate(){
    super.populate();
    const dom = this.dom;

    dom.wrapper = this.wrapper;
    dom.slider = $('<div class="slider" style="width: ' + 100*this.numSlides + '%"></div>');
    dom.slides = [];
    for (let i = 0; i < this.numSlides; i++){
      const slide = $('<div class="slide" style="width: '+ 100/this.numSlides +'%"></div>');
      dom.slides.push(slide);
      dom.slider.append(slide);
    }
    dom.wrapper.append(dom.slider);
  }

  updateDOM(){
    super.updateDOM();
    this.snapToSlide(this.currentSlide);
  }

  snapToSlide(n, callback){
    this.dom.slider.css({"transition-duration": 0 + "ms", "left": "-" + (100*n) + "%"});
    if (callback !== undefined){
      callback();
    }
    this.currentSlide = n;
  }

  goToSlide(n, callback){
    if (this.dom.slider.hasClass('sliding')) return;
    const diff = Math.abs(this.currentSlide - n);
    if (diff != 0){
      const transitionDuration = this.duration * diff;
      const slider = this.dom.slider;
      slider.css({"transition-duration": transitionDuration + "ms", "left": "-" + (100*n) + "%"});
      slider.addClass('sliding');
      setTimeout(() => {
        slider.removeClass('sliding');
        if (callback !== undefined){
          callback();
        }
      }, transitionDuration);
      this.currentSlide = n;
    }
  }

  getSlideDiv(n){
    return this.dom.slides[n];
  }
}