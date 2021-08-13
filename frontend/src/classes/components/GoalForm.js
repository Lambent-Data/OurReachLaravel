import EditableComponent from './EditableComponent.js'
import ModalComponent from './ModalComponent.js'
import GoalComponent from './GoalComponent.js'
import TextInputComponent from './field-components/TextInputComponent.js'
import Goal from '../data-sources/Goal.js'
import FormController from '../FormController.js'
import DropdownComponent from './field-components/DropdownComponent.js'
import DateInputComponent from './field-components/DateInputComponent.js'
import LabelledFieldWrapper from './field-components/LabelledFieldWrapper.js'
import WeekSelectorComponent from './field-components/WeekSelectorComponent.js'
import MonthSelectorComponent from './field-components/MonthSelectorComponent.js'
import TimeInputComponent from './field-components/TimeInputComponent.js'
import TextAreaComponent from './field-components/TextAreaComponent.js'
import CheckboxComponent from './field-components/CheckboxComponent.js'
import { asyncConfirm } from '../../utilities/asyncConfirm.js'
import { RepeatRule } from '../../utilities/object-fields';
import { Message, RepeatType, Status } from '../../utilities/enums.js'
import TemplateGoalSection from './TemplateGoalSection.js'

export default class GoalForm extends EditableComponent {
  constructor(parent, src) {
    const wrapper = $('<div></div>');
    super(wrapper, parent, src);
    this.name = "goal-form";

    if (this.parent instanceof GoalComponent){
      this.title = "Edit Goal";
      this.saveText = "Save";
      this.closeText = "Close";
      this.ctrl = new EditGoalController(this);
    }else{
      this.title = "Add Goal";
      this.saveText = "Save";
      this.closeText = "Close";
      this.ctrl = new AddGoalController(this);
    }

    // Gatekeeper to prevent multiple submission
    // Form becomes active on show, inactive on hide
    // Can't submit unless active
    this.active = false;
    
    this.templateGoal = undefined;

    // Only populate on show()
  }

  populate() {
    super.populate();
    const dom = this.dom;

    /* Non-editable components */
    this.components.modal = new ModalComponent(this.wrapper, this, this.title, this.saveText, this.closeText, "Delete", this.parent instanceof GoalComponent);
    this.components.frequencyWrapper = new LabelledFieldWrapper(this, 'every-x-days', "Frequency: ", true);
    this.components.templateSection = new TemplateGoalSection(this, this.src instanceof Goal ? this.src.parent : this.src);
  
    /*  Editable components */
    this.editableComponents.name = new TextInputComponent(this, 'name', undefined, undefined, "What is your goal?", true);
    this.editableComponents.repeatType = new DropdownComponent(this, 'type', "How often do you want to complete this goal? ", RepeatType.WEEKLY,
                                                          ["One time", "Daily", "Weekly", "Monthly", "Yearly"],
                                                          [RepeatType.ONE_TIME, RepeatType.DAILY, RepeatType.WEEKLY, RepeatType.MONTHLY, RepeatType.YEARLY],
                                                          undefined, true);
    this.editableComponents.description = new TextAreaComponent(this, 'description', 'Details', '', "", false);
    this.editableComponents.frequency = new TextInputComponent(this, 'frequency', undefined, "1", '-', false, 3, "\d*");
    this.editableComponents.starting = new DateInputComponent(this, "starting date", "Starting on: ", undefined, undefined, false);
    this.editableComponents.weekSelector = new WeekSelectorComponent(this, "days of week", "On days: ", {
                                                                      SUN: false,
                                                                      MON: false,
                                                                      TUE: true,
                                                                      WED: false,
                                                                      THU: true,
                                                                      FRI: false,
                                                                      SAT: false
                                                                    }, true);
    this.editableComponents.monthSelector = new MonthSelectorComponent(this, "days of month", "On days: ", undefined, true);
    this.editableComponents.atTime = new TimeInputComponent(this, "at time", "Before: ", 17*60*60, undefined, true);
    this.editableComponents.private = new CheckboxComponent(this, "private", "Private: ", false);
    

    this.wrapper.addClass('goal-form');
    dom.modal = this.wrapper;
    dom.formBody = this.components.modal.getBodyDiv();
    dom.name = this.editableComponents.name.getWrapper();
    dom.templateSection = this.components.templateSection.getWrapper();
    dom.description = this.editableComponents.description.getWrapper();
    dom.repeatType = this.editableComponents.repeatType.getWrapper();
    dom.repeatType.css({"flex-direction": "column"});
    dom.frequencyWrapper = this.components.frequencyWrapper.getWrapper();
    dom.frequency = this.editableComponents.frequency.getWrapper();
    dom.frequencyUnit = $('<span></span>');
    dom.starting = this.editableComponents.starting.getWrapper();
    dom.weekSelector = this.editableComponents.weekSelector.getWrapper();
    dom.monthSelector = this.editableComponents.monthSelector.getWrapper();
    dom.atTime = this.editableComponents.atTime.getWrapper();
    dom.private = this.editableComponents.private.getWrapper();

    /* Sprucing up the name */
    this.editableComponents.name.dom.input.css({"padding": "8px"});

    /* Set show options for different repeat types */
    dom.frequencyWrapper.addClass('daily weekly monthly yearly');
    this.components.frequencyWrapper.getMainDiv().append('<span>Every </span>')
                                     .append(dom.frequency)
                                     .append(dom.frequencyUnit);
    dom.frequency.css({'width': 'auto', 'margin': '0 4px 0 4px'});

    dom.weekSelector.addClass('weekly');

    dom.monthSelector.addClass('monthly');

    dom.atTime.addClass('one-time daily weekly monthly yearly');

    dom.timingOptions = $('<div class="timing-options"></div>');


    dom.timingOptions.append(dom.frequencyWrapper)
                     .append('<br class="one-time daily weekly monthly yearly"/>')
                     .append(dom.weekSelector)
                     .append(dom.monthSelector)
                     .append('<br class="one-time daily weekly monthly yearly"/>')
                     .append(dom.atTime);

    dom.formBody.append(dom.name)
                .append('<br/>')
                .append(dom.description)
                .append('<br/>')
                .append(dom.templateSection)
                .append('<br/>')
                .append(dom.repeatType)
                .append('<br/>')
                .append(dom.timingOptions)
                .append('<br/>')
                .append(dom.starting)
                .append('<br/>')
                .append(dom.private);
  }

  updateDOM() {
    if (this.src instanceof Goal) {
      const repeatRule = this.src.repeat;
      this.editableComponents.name.value = this.src.name;
      this.editableComponents.description.value = this.src.description;
      this.editableComponents.repeatType.value = repeatRule.type;
      this.editableComponents.frequency.value = repeatRule.frequency;
      this.editableComponents.starting.value = repeatRule.startingOn;
      this.editableComponents.atTime.value = repeatRule.times[0];
      this.editableComponents.weekSelector.valueFromList(repeatRule.daysOfWeek);
      this.editableComponents.monthSelector.valueFromList(repeatRule.daysOfMonth);
      this.editableComponents.private.value = this.src.private;
    }
    for (const comp of Object.values(this.components)){
      comp.updateDOM();
    }
    for (const comp of Object.values(this.editableComponents)) {
      comp.updateDOM();
    }
    this.onChangeRepeatType();
  }

  show(){
    this.populate();
    this.updateDOM();
    this.active = true;
    this.components.modal.show();
  }

  hide() {
    this.active = false;
    this.components.modal.hide();
    this.updateDOM();
  }

  disableSubmit() {
    this.components.modal.disableSubmitButton();
    this.components.modal.disableDeleteButton();
  }

  enableSubmit() {
    this.components.modal.enableSubmitButton();
    this.components.modal.enableDeleteButton();
  }

  getFormData(){
    const ecs = this.editableComponents;
    const rpt = new RepeatRule(ecs.repeatType.value, ecs.starting.value, ecs.frequency.value, [ecs.atTime.value], ecs.weekSelector.valueAsList(), ecs.monthSelector.valueAsList());
    const data = {
      name: ecs.name.value,
      repeat_rule: rpt.toJSON(),
      description: ecs.description.value,
      private: ecs.private.value ? 1 : 0,
    }
    console.log(this.components.templateSection.selectedTemplate);
    if (this.components.templateSection.selectedTemplate){
      data.template_id = this.components.templateSection.selectedTemplate.name;
    }
    return data;
  }

  showFeedback(messages){
    /* TODO */
    if (messages.url){
      this.editableComponents.url.showErrorMessage(messages.url);
    }
    if (messages.name) {
      this.editableComponents.name.showErrorMessage(messages.name);
    }
  }

  setTemplate(tempGoal){
    this.editableComponents.name.value = tempGoal.name;
    this.editableComponents.description.value = tempGoal.description;
    this.editableComponents.name.updateDOM();
    this.editableComponents.description.updateDOM();

    if (tempGoal.frequency){
      this.editableComponents.frequency.value = tempGoal.frequency;
    }

    if (tempGoal.times && tempGoal.times.length > 0) {
      this.editableComponents.atTime.setTimeInSeconds(tempGoal.times[0]);
    }

    if (tempGoal.type){
      if (this.editableComponents.repeatType.value !== tempGoal.type){
        this.editableComponents.repeatType.value = tempGoal.type;
        this.onChangeRepeatType();
      }
      switch(tempGoal.type){
        case RepeatType.ONE_TIME:
          break;
        case RepeatType.DAILY:
          break;
        case RepeatType.WEEKLY:
          if (tempGoal.days){
            this.editableComponents.weekSelector.clearDays();
            for (const day in tempGoal.days){
              this.editableComponents.weekSelector.addDay(day.toUpperCase());
              this.editableComponents.atTime.setTimeInSeconds(tempGoal.days[day][0]);
            }
          }
          break;
        case RepeatType.MONTHLY:
          if (tempGoal.days) {
            this.editableComponents.monthSelector.clearDays();
            for (const day of tempGoal.days) {
              this.editableComponents.monthSelector.addDay(day);
            }
          }
          break;
        case RepeatType.YEARLY:

          break;
      }
    }
  }

  unsetTemplate(){
    // do nothing
  }

  onChangeRepeatType(){
    const recurrenceType = this.editableComponents.repeatType.value;
    this.dom.timingOptions.removeClass('one-time daily weekly monthly yearly');
    switch (recurrenceType) {
      case RepeatType.ONE_TIME:
        this.dom.timingOptions.addClass('one-time');
        this.editableComponents.starting.label = "Due date: ";
        this.editableComponents.starting.updateDOM();
        break;
      case RepeatType.DAILY:
        this.dom.timingOptions.addClass('daily');
        this.dom.frequencyUnit.html(' day(s).');
        this.editableComponents.starting.label = "Starting on: ";
        this.editableComponents.starting.updateDOM();
        break;
      case RepeatType.WEEKLY:
        this.dom.timingOptions.addClass('weekly');
        this.dom.frequencyUnit.html(' week(s).');
        this.editableComponents.starting.label = "Starting on: ";
        this.editableComponents.starting.updateDOM();
        break;
      case RepeatType.MONTHLY:
        this.dom.timingOptions.addClass('monthly');
        this.dom.frequencyUnit.html(' month(s).');
        this.editableComponents.starting.label = "Starting on: ";
        this.editableComponents.starting.updateDOM();
        break;
      case RepeatType.YEARLY:
        this.dom.timingOptions.addClass('yearly');
        this.dom.frequencyUnit.html(' year(s).');
        this.editableComponents.starting.label = "Starting on: ";
        this.editableComponents.starting.updateDOM();
        break;
    }
  }

  handleMessage(id, msg, data){
    switch(id){
      case this.components.modal.id:
        if (msg === Message.CLOSE_MODAL){
          this.messageParent(Message.CLOSE_MODAL);
        }else if (msg === Message.SUBMIT){
          // This could be to a goal controller (for updating) or a milestone controller (for creating)
          if (this.active){
            this.disableSubmit();
            const comp = this;
            this.ctrl.submit().then(() => comp.enableSubmit());
          }
        } else if (msg === Message.DELETE) {
          if (this.active) {
            const comp = this;
            asyncConfirm("Are you sure you want to delete this goal?", () => {
              comp.disableSubmit();
              comp.ctrl.delete().then(() => comp.enableSubmit());
            });
          }
        }
        return;
      case this.editableComponents.repeatType.id:
        if (msg === Message.CHANGE) {
          this.onChangeRepeatType();
        }
        return;
      case this.components.templateSection.id:
        if (msg === Message.SET_TEMPLATE){
          this.setTemplate(data);
        }
        if (msg === Message.UNSET_TEMPLATE) {
          this.unsetTemplate();
        }
        return;
    }
    super.handleMessage(id, msg, data);
  }
}


// Controllers for the goal form.
class EditGoalController extends FormController{
  async doSubmission(){
    const data = this.comp.getFormData();
    const resp = await this.src.update(data);
    switch (resp.status) {
      case Status.SUCCESS:
        // update goal src
        this.comp.messageParent(Message.EDIT_GOAL);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }

  async doDeletion() {
    const resp = await this.src.delete();
    switch (resp.status) {
      case Status.SUCCESS:
        // update goal src
        this.comp.messageParent(Message.DELETE_GOAL);
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }
}

class AddGoalController extends FormController {
  async doSubmission(){
    const data = this.comp.getFormData();
    const goal = Goal.make(data, this.src);
    const resp = await goal.create();
    /* resp is an object with properties:
     *   status: Status
     *   data: {
     *     (goal record data, if success)
     *   }
     */
    switch (resp.status) {
      case Status.SUCCESS:
        this.src.addGoal(goal);
        this.comp.messageParent(Message.ADD_GOAL, goal)
        break;
      case Status.FAILURE:
      case Status.EXCEPTION:
        this.comp.showFeedback(resp.data);
        break;
    }
  }
}