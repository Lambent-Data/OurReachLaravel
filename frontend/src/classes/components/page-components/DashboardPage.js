import Component from '../Component.js'
import MilestoneSection from '../MilestoneSection.js'
import GoalSection from '../GoalSection.js'
import { RepeatType } from '../../../utilities/enums.js'
import User from '../../data-sources/User.js'
import { DateTime } from 'luxon'
import { DateTimeFromDatabaseFormat } from '../../../utilities/time.js'

export default class DashboardPage extends Component {

  constructor(wrapper, user, milestones, title="Dashboard"){
    super(wrapper, undefined);
    this.name = "dashboard-page";

    this.title = title;
    this.user = user;
    this.milestones = milestones;

    const goalList = [];
    for (const milestone of this.milestones){
      goalList.push(milestone.goals);
    }
    this.goals = [].concat(...goalList);    

    this.populate();
    this.updateDOM();
  }

  populate() {
    const dom = this.dom;

    dom.bodyDiv = this.wrapper.css({"display": "flex", "flex-direction": "column", "justify-content": "center", "max-width": "700px", "width": "100%", "margin": "auto"});

    this.components.goalSection = new GoalSection(this, this.user, false, "No goals to display", "Goals for Next 7 Days");
    for (const goal of this.goals) {
      /* Include goal only if:
       *   - The goal is incomplete and the deadline is within the next week OR
       *   - The goal is complete, but the deadline (for a one-time goal) passed less than 3 hours ago AND the goal was completed less than 3 hours ago
       *     (if that last_completed info has been saved)
       */
      if (!goal.completed && goal.nextDeadline < DateTime.local().plus({ days: 7 }) ||
         (goal.completed && goal.nextDeadline > DateTime.local().minus({ hours: 3 }) &&
         (!('last_completed' in goal.history) || DateTimeFromDatabaseFormat(goal.history['last_completed']) > DateTime.local().minus({ hours: 3 })
         ))){
        this.components.goalSection.addGoalComponent(goal);
      }
    }

    this.components.milestoneSection = new MilestoneSection(this, this.user, "Milestones In Progress");
    for (const milestone of this.milestones){
      if (!milestone.completed){
        this.components.milestoneSection.addMilestoneComponent(milestone);
      }
    }

    this.components.completedMilestoneSection = new MilestoneSection(this, this.user, "Completed Milestones", false);
    for (const milestone of this.milestones) {
      if (milestone.completed) {
        this.components.completedMilestoneSection.addMilestoneComponent(milestone);
      }
    }
    this.components.completedMilestoneSection.snapClosedAccordion(); // start with completed section closed

    if(this.title){
      dom.title = $('<h2 style="margin:auto"></h2>').html(this.title);
      dom.bodyDiv.append(dom.title);
    }

    dom.bodyDiv.append(this.components.goalSection.getWrapper())
               .append(this.components.milestoneSection.getWrapper())
               .append(this.components.completedMilestoneSection.getWrapper());
  }
}