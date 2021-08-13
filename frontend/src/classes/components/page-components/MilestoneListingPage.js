import Component from '../Component.js'
import MilestoneComponent from '../MilestoneComponent.js'
import IconButton from '../IconButton.js'
import MilestoneAddForm from '../MilestoneAddForm.js'
import TextButtonComponent from '../TextButtonComponent.js'
import { Pages, Message } from '../../../utilities/enums.js'
import { redirect } from '../../../utilities/request.js'

export default class MilestoneListingPage extends Component {

  constructor(wrapper, milestones, placeholder = "No milestones to display") {
    super(wrapper);
    this.name = "milestone-listing-page";

    this.placeholder = placeholder;
    this.wrapper.addClass("empty");

    this.milestones = milestones;

    this.populate();
    this.updateDOM();

    for (const ms of this.milestones) {
      this.addMilestoneComponent(ms);
    }
  }

  addMilestoneComponent(milestone) {
    this.wrapper.removeClass("empty");
    const comp = new MilestoneComponent(this, milestone);
    // comp.components.accordionComponent.snapOpen();
    const wrapper = comp.getWrapper();
    this.components[comp.id] = comp;
    this.dom.milestoneBox.prepend(wrapper);
  }

  populate() {
    const dom = this.dom;
    dom.bodyDiv = this.wrapper.css({"display": "flex", "flex-direction": "column", "max-width": "1500px", "width": "100%"});

    this.components.allBtn = new TextButtonComponent(this, "All Milestones", "btn-primary");
    this.components.inProgressBtn = new TextButtonComponent(this, "In Progress", "btn-warning");
    this.components.completeBtn = new TextButtonComponent(this, "Complete", "btn-success");
    const btnStyle = { "flex-grow": 1, "min-width": "140px", "max-width": "200px", "border-radius": "2px", "padding": "6px", "margin": "5px" };

    dom.buttonRow = $('<div style="display:flex; flex-wrap: wrap; margin:auto;"></div>');
    dom.allBtn = this.components.allBtn.getWrapper();
    dom.inProgressBtn = this.components.inProgressBtn.getWrapper();
    dom.completeBtn = this.components.completeBtn.getWrapper();
    dom.allBtn.css(btnStyle);
    dom.inProgressBtn.css(btnStyle);
    dom.completeBtn.css(btnStyle);

    dom.buttonRow.append(dom.allBtn)
      .append(dom.inProgressBtn)
      .append(dom.completeBtn);

    dom.boxWrapper = $('<div></div>').css({ "display": "flex", "justify-content": "center", "width": "100%" });
    dom.milestoneBox = $('<div class="milestone-listing-box"></div>');
    dom.boxWrapper.append(dom.milestoneBox);

    dom.placeholder = $('<div class="milestone-placeholder"></div>');
    dom.placeholder.html(this.placeholder);
    const comp = this;
    dom.placeholder.on('click', () => comp.handleMessage("placeholder", Message.CLICK));
    dom.milestoneBox.append(dom.placeholder);

    dom.title = $('<h2 style="margin:auto">Your Milestones</h2>');

    this.components.addMilestoneForm = new MilestoneAddForm(this, this.src);
    this.components.addBtn = new IconButton(this, 'add-button');
    dom.addMilestoneBtn = this.components.addBtn.getWrapper();
    dom.addMilestoneBtn.css({ "position": "absolute", "top": "5px", "right": "5px" });

    dom.bodyDiv.append(dom.addMilestoneBtn)
      .append(dom.title)
      .append(dom.buttonRow)
      .append(dom.boxWrapper);

  }

  filterMilestones(f){
    for (const comp of Object.values(this.components)){
      if (comp instanceof MilestoneComponent){
        if (f(comp.src)){
          comp.wrapper.show();
        }else{
          comp.wrapper.hide();
        }
      }
    }
  }

  handleMessage(id, msg, data) {
    if (this.hasPopulated) {
      switch (id) {
        case this.components.addBtn.id:
        case "placeholder": // This is a weird antipattern, should be changed later as we change the placeholder
          if (msg == Message.CLICK) {
            this.components.addMilestoneForm.show();
          }
          return;
        case this.components.addMilestoneForm.id:
          if (msg == Message.CREATED_MILESTONE) {
            this.milestones.push(data);
            this.addMilestoneComponent(data);
            redirect({page: Pages.VIEW_MILESTONE, ruko_id: data.ruko_id});
          }
          return;
        case this.components.allBtn.id:
          if (msg == Message.CLICK) {
            this.filterMilestones((ms) => true);
          }
          return;
        case this.components.inProgressBtn.id:
          if (msg == Message.CLICK) {
            this.filterMilestones((ms) => !ms.completed);
          }
          return;
        case this.components.completeBtn.id:
          if (msg == Message.CLICK) {
            this.filterMilestones((ms) => ms.completed);
          }
          return;        
      }
    }
  }
}