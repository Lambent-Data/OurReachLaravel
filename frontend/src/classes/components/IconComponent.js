import { Message, CategoryEnum } from "../../utilities/enums";
import EditableComponent from "./EditableComponent"

export default class IconComponent extends EditableComponent {
  constructor(parent, category, includeLabel = true) {
    const wrapper = $('<div class="category-icon-container"></div>');
    super(wrapper, parent);
    this.name = "milestone-image-component";
    this.category = category;
    this.includeLabel = includeLabel;
    this.selected = false;
    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom; 
    dom.outerDiv = this.wrapper;
    dom.backCircle = $('<i class="fa fa-circle fa-stack-2x"></i>');
    switch (this.category) {
      case CategoryEnum.HOUSING:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-housing"></span>');
        dom.icon = $('<i class="fa fa-home fa-stack-1x inverse"></i>');
        dom.label = $("<span>Housing</span>");
        break;
      case CategoryEnum.HEALTH:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-health"></span>');
        dom.icon = $('<i class="fa fa-heart fa-stack-1x inverse"></i>');
        dom.label = $("<span>Health</span>");
        break;
      case CategoryEnum.EDUCATION:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-education"></span>');
        dom.icon = $(
          '<i class="fa fa-graduation-cap fa-stack-1x inverse"></i>'
        );
        dom.label = $("<span>Education</span>");
        break;
      case CategoryEnum.MONEY:
      case "Money Management":
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-money"></span>');
        dom.icon = $(
          '<i class="fa fa-money-bill-wave fa-stack-1x inverse"></i>'
        );
        dom.label = $("<span>Money</span>");
        break;
      case CategoryEnum.JOBS:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-jobs"></span>');
        dom.icon = $('<i class="fa fa-chart-line fa-stack-1x inverse"></i>');
        dom.label = $("<span>Jobs</span>");
        break;
      case CategoryEnum.CHILDREN:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-children"></span>');
        dom.icon = $('<i class="fa fa-child fa-stack-1x inverse"></i>');
        dom.label = $("<span>Children</span>");
        break;
      case CategoryEnum.OTHER:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-other"></span>');
        dom.icon = $('<i class="fa fa-star fa-stack-1x inverse"></i>');
        dom.label = $("<span>Other</span>");
        break;
      default:
        dom.outerSpan = $('<span class="fa-stack fa-2x ld-other"></span>');
        dom.icon = $('<i class="fa fa-star fa-stack-1x inverse"></i>');
        dom.label = $("<span>" + this.category + "</span>");
        break;
    }

   //  dom.label.css({color: 'red'});
   //  dom.label.addClass('red-text')

    dom.outerSpan.append(dom.backCircle).append(dom.icon);
    dom.outerDiv.append(dom.outerSpan);
    if (this.includeLabel) dom.outerDiv.append(dom.label);


    const comp = this;
    dom.outerDiv.on('click', () => {
      if (comp.editing){ 
        comp.toggleSelect();
      }
    });
  }

  select(){
    if (!this.selected) {
      this.selected = true;
      this.wrapper.addClass('selected')
      this.ungreyOut();
      // Notify parent that the "selected" value has changed
      this.messageParent(Message.CHANGE);
    }
  }

  unselect() {
    if (this.selected) {
      this.selected = false;
      this.wrapper.removeClass('selected')
      // Notify parent that the "selected" value has changed
      this.messageParent(Message.CHANGE);
    }
  }

  toggleSelect(){
    if (this.selected){
      this.unselect();
    }else{
      this.select();
    }
  }


  greyOut() {
    if (!this.selected){
      this.wrapper.addClass('greyed-out');
    }
  }

  ungreyOut() {
    this.wrapper.removeClass('greyed-out');
  }

  startEditing(recurseDown = true, recurseUp = false) {
    super.startEditing(recurseDown, recurseUp);

  }

  stopEditing(recurseDown = true, recurseUp = false) {
    super.stopEditing(recurseDown, recurseUp);

  }
}
