import Component from "./Component";
import { Message } from "../../utilities/enums";

export default class TemplateGoalSection extends Component {

  constructor(parent, milestone){
    const wrapper = $('<div></div>');
    super(wrapper, parent, milestone);
    this.name = "template-goal-section";

    this.numberGoals = 0;
    this.buttons = [];
    this.selectedTemplate = undefined;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    const dom = this.dom;

    this.wrapper.addClass("template-goals-section");

    if (this.src && this.src.template && this.src.template.goals){
      for (const tempGoal of this.src.template.goals){
        const btn = new TemplateGoalButton(this, tempGoal);
        this.buttons.push(btn);
        this.wrapper.append(btn.getWrapper());
        this.numberGoals += 1;
      }
    }
    if (this.numberGoals == 0){
      this.wrapper.addClass("empty");
    }else{
      this.wrapper.removeClass("empty");
    }
  }

  handleMessage(id, msg, data){
    if (msg == Message.SET_TEMPLATE){
      for (const btn of this.buttons){
        if (btn.id !== id){
          btn.unselect();
        }
      }
      this.selectedTemplate = data;
      this.messageParent(msg, data);
      return;
    }
    if (msg == Message.UNSET_TEMPLATE) {
      this.selectedTemplate = undefined;
      this.messageParent(msg);
    }
  }
}

class TemplateGoalButton extends Component {
  constructor(parent, templateGoal) {
    const wrapper = $('<div class="template-goal"></div>');
    super(wrapper, parent);
    this.name = "template-goal-section";

    this.templateGoal = templateGoal;
    this.selected = false;

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();
    this.wrapper.html(this.templateGoal.name);
    const comp = this;
    this.wrapper.on('click', () => {
      comp.toggleSelect();
      if (comp.selected) {
        this.messageParent(Message.SET_TEMPLATE, comp.templateGoal);
      }else{
        this.messageParent(Message.UNSET_TEMPLATE);
      }
    });
  }

  toggleSelect(){
    if (this.selected){
      this.unselect();
    }else{
      this.select();
    }
  }

  select() {
    this.selected = true;
    this.wrapper.addClass('selected');
  }

  unselect(){
    this.selected = false;
    this.wrapper.removeClass('selected');
  }
}