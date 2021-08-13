import Component from '../Component.js'

/*** Import section components ***/
import MilestoneTitleSection from '../MilestoneTitleSection.js'
import GoalSection from '../GoalSection.js'
import LinkSection from '../LinkSection.js'
import VisionSection from '../VisionSection.js'
import PurposeSection from '../PurposeSection.js'
import ObstaclesSection from '../ObstaclesSection.js'
import ThreeTabSelector from '../ThreeTabSelector.js'
import CommentSection from '../CommentSection.js'
import ConfettiModal from '../ConfettiModal.js'
import { Message } from '../../../utilities/enums.js'

export default class MilestoneViewPage extends Component {

  constructor(wrapper, milestone){
    super(wrapper, undefined, milestone);
    this.name = "milestone-view-page";

    this.tabs = [ { name: "Coaching", iconName: "fa-hands" },
                  { name: "Goals", iconName: "fa-mountain" },
                  { name: "Vision", iconName: "fa-book" } ];

    this.populate();
    this.updateDOM();
  }

  populate() {
    const dom = this.dom;
    dom.bodyDiv = $('#ms-page-body');

    this.components.tabSelector = new ThreeTabSelector(this.tabs, "Goals");
    this.components.title = new MilestoneTitleSection(this, this.src);
    this.components.goals = new GoalSection(this, this.src);
    this.components.goals.startEditing();
    this.components.links = new LinkSection(this, this.src);
    this.components.comments = new CommentSection(this, this.src);
    this.components.vision = new VisionSection(this, this.src);
    this.components.purpose = new PurposeSection(this, this.src);
    this.components.obstacles = new ObstaclesSection(this, this.src);

    dom.tabSelector = this.components.tabSelector.getWrapper();
    dom.title = this.components.title.getWrapper();
    dom.goals = this.components.goals.getWrapper();
    dom.links = this.components.links.getWrapper();
    dom.comments = this.components.comments.getWrapper();
    dom.vision = this.components.vision.getWrapper();
    dom.purpose = this.components.purpose.getWrapper();
    dom.obstacles = this.components.obstacles.getWrapper();

    dom.bodyDiv.append(dom.tabSelector)
               .append(dom.title)
               .append(dom.goals)
               .append(dom.links)
               .append(dom.vision)
               .append(dom.purpose)
               .append(dom.obstacles)
               .append(dom.comments);

    this.components.vision.closeAccordion();
    this.components.purpose.closeAccordion();
    this.components.obstacles.closeAccordion();
    
    const tabSelector = this.components.tabSelector;
    tabSelector.addToTab(this.components.goals.wrapper, "Goals");
    tabSelector.addToTab(this.components.links.wrapper, "Coaching");
    tabSelector.addToTab(this.components.comments.wrapper, "Coaching");
    tabSelector.addToTab(this.components.vision.wrapper, "Vision");
    tabSelector.addToTab(this.components.purpose.wrapper, "Vision");
    tabSelector.addToTab(this.components.obstacles.wrapper, "Vision");
  }

  updateDOM(){
    super.updateDOM();
    for (const goal of this.src.goals) {
      this.components.goals.addGoalComponent(goal);
    }
    for (const link of this.src.links) {
      this.components.links.addLinkComponent(link);
    }
    for (const comment of this.src.comments) {
      this.components.comments.addCommentComponent(comment);
    }
  }

  handleMessage(id, msg){
    if (this.hasPopulated){
      if (msg == Message.START_EDITING){
        const compList = Object.values(this.components);
        for (const comp of compList){
          if (comp.editing && id !== comp.id){
            comp.stopEditing(true, false);
          }
        }
        return;
      }
    }
  }
}