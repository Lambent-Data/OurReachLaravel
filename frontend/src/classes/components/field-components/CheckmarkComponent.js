import FieldComponent from './FieldComponent.js';
import { Message } from '../../../utilities/enums.js';
import '../../../animations/sprites';

export default class CheckmarkComponent extends FieldComponent {
  static spritesheetColumns = 5;
  static spritesheetRows = 13;
  static openFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  static closeFrames = [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64];
  static spriteData = {
                        width: 160,
                        height: 160,
                        numFrames: 65,
                        fps: 24,
                      }

  constructor(parent, fieldName='checkmark', checked = false, size = 40){
    const wrapper = $('<div></div>');
    super(wrapper, parent, fieldName, undefined, checked, undefined, false)
    this.name = "checkmark-component";
    this.size = size;
    this.useOpenFrames = !checked;
    this.animating = false;

    this.messageTimeout = undefined;

    this.populate();
    this.updateDOM();
  }

  get checked(){
    return this.value;
  }
  set checked(isChecked){
    this.value = isChecked;
    if (this.messageTimeout){
      clearTimeout(this.messageTimeout);
    }
    const comp = this;
    this.messageTimeout = setTimeout(() => comp.messageParent(Message.CHANGE), 500);
  }

  populate() {
    super.populate();
    const dom = this.dom;
    const sizepx = this.size + "px";

    dom.checkDiv = this.wrapper;
    dom.checkDiv.addClass('ld-animated-check');
    dom.checkDiv.css('width: ' + sizepx + '; height: ' + sizepx);
    dom.backgroundCircle = $('<div class="check-background" style="width: ' + sizepx + '; height: ' + sizepx + '; background-size: ' + sizepx + ' ' + sizepx + ';"></div>');
    dom.sprite = $('<div class="checkmark-sheet"></div>');

    // Basic css to prepare for animation
    dom.sprite.css({
      "width": sizepx,
      "height": sizepx,
      "position": "relative",
      "background-repeat": "no-repeat",
      "background-size": "calc(" + CheckmarkComponent.spritesheetColumns + " * " + sizepx + ") calc(" + CheckmarkComponent.spritesheetRows + " * " + sizepx + ")",
      "pointer-events": "none", // This keeps the animation from preventing mouse events on elements behind the animation
    });

    dom.checkDiv.append(dom.backgroundCircle);
    dom.checkDiv.append(dom.sprite);


    if (this.checked) {
      dom.checkDiv.addClass("is-checked");
      dom.sprite.animateSprite({
        columns: CheckmarkComponent.spritesheetColumns,
        rows: CheckmarkComponent.spritesheetRows,
        animations: { frames: [42] }
      });
    }

    const comp = this;
    dom.checkDiv.off("click").on("click", (event) => {
      comp.handleClick();
      event.stopPropagation();
    });
  }

  handleClick(){
    if (!this.editing){
      return;
    }

    const dom = this.dom;
    const sprite = dom.sprite;
    const openFrames = CheckmarkComponent.openFrames;
    const closeFrames = CheckmarkComponent.closeFrames;
    const spriteData = CheckmarkComponent.spriteData;
    const spritesheetColumns = CheckmarkComponent.spritesheetColumns;
    const spritesheetRows = CheckmarkComponent.spritesheetRows;
    const comp = this;

    const currentFrame = sprite.animateSprite("frame");
    sprite.animateSprite("stop");
    if (this.animating) {
      let frames;
      //Reverse animation if it is currently animating
      if (this.useOpenFrames) {
        //If using openFrames...
        if (this.checked) {
          frames = openFrames.slice(0, currentFrame + 1).reverse(); //currently opening, must close
          this.checked = false;
        } else {
          frames = openFrames.slice(currentFrame, openFrames.length); //closing, must open
          this.checked = true;
        }
        sprite.animateSprite({
          fps: spriteData.fps,
          columns: spritesheetColumns,
          rows: spritesheetRows,
          animations: { frames: frames },
          loop: false,
          complete: () => {comp.animating = false}
        });
      } else {
        //If using closeFrames...
        if (this.checked) {
          frames = closeFrames.slice(currentFrame, closeFrames.length); //opening, must close
          this.checked = false;
        } else {
          frames = closeFrames.slice(0, currentFrame + 1).reverse() //currently closing, must open
          this.checked = true;
        }
        sprite.animateSprite({
          fps: spriteData.fps,
          columns: spritesheetColumns,
          rows: spritesheetRows,
          animations: { frames: frames },
          loop: false,
          complete: () => {comp.animating = false}
        });
      }
    } else {
      if (this.checked) {
        this.checked = false;
        this.useOpenFrames = false;
        this.animating = true;
        sprite.animateSprite({
          fps: spriteData.fps,
          columns: spritesheetColumns,
          rows: spritesheetRows,
          animations: { frames: closeFrames },
          loop: false,
          complete: () => {comp.animating = false}
        });
      } else {
        this.checked = true;
        this.useOpenFrames = true;
        this.animating = true;
        sprite.animateSprite({
          fps: spriteData.fps,
          columns: spritesheetColumns,
          rows: spritesheetRows,
          animations: { frames: openFrames },
          loop: false,
          complete: () => {comp.animating = false}
        });
      }
    }

    if (this.checked){
      dom.checkDiv.addClass('is-checked');
    }else{
      dom.checkDiv.removeClass('is-checked');
    }
  }

  updateDOM(){
    return;
  }
}