import Component from './Component.js';
import { describeDatetimeRelative, describeDatetimeAbsolute } from '../../utilities/time.js'
import { RepeatType } from '../../utilities/enums.js';

export default class GoalBasisDisplay extends Component {

  constructor(parent, goal, relativeTime=false) {
    const wrapper = $('<div class="goal-basis"></div>');
    super(wrapper, parent, goal);
    this.name = "goal-basis-display";

    this.relativeTime = relativeTime;
    this.connectorText ="Due "

    this.populate();
    this.updateDOM();
  }

  populate() {
    const dom = this.dom;

    dom.basisDiv = this.wrapper;
    dom.basisIcon = $('<i class="far fa-calendar-check fa-lg" style="margin-right:10px;"></i>');
    dom.frequencySpan = $('<span></span>')
    dom.dotSpan = $('<span style = "margin: 0 10px;" class="goal-data" >&bull;</span >');
    dom.completeSpan = $('<span class="goal-data"></span>');
    dom.deadlineSpan = $('<span class="goal-data"></span>');

    dom.basisDiv.append(dom.basisIcon)
      .append(dom.frequencySpan)
      .append(dom.dotSpan)
      .append(dom.completeSpan)
      .append(dom.deadlineSpan);
  }

  updateDOM() {
    const dom = this.dom;
    const rpt = this.src.repeat;
    let deadlineText;

    dom.completeSpan.html(this.connectorText);

    if (this.relativeTime) {
      deadlineText = describeDatetimeRelative(this.src.nextDeadline);
    } else {
      deadlineText = describeDatetimeAbsolute(this.src.nextDeadline);
    }
    
    if (rpt.type !== RepeatType.ONE_TIME) {
      // For recurring goals
      dom.basisIcon.removeClass("fa-calendar-check").addClass("fa-clock");
      // Should be expanded to all possible frequency options
      switch (rpt.type){
        case RepeatType.DAILY:
          dom.frequencySpan.html('Daily');
          break;
        case RepeatType.WEEKLY:
          dom.frequencySpan.html('Weekly');
          break;
        case RepeatType.MONTHLY:
          dom.frequencySpan.html('Monthly');
          break;
        case RepeatType.YEARLY:
          dom.frequencySpan.html('Yearly');
          break;
      }
    } else {
      // For non-recurring goals
      if (this.src.completed) {
        deadlineText = "Complete";
        dom.completeSpan.html("");
      }
      dom.basisIcon.removeClass("fa-clock").addClass("fa-calendar-check");
      dom.frequencySpan.html('One time');
    }
    dom.deadlineSpan.html(deadlineText);
  }
}