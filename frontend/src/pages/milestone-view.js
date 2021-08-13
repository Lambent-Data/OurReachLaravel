/*** Import standard utilities ***/
import '../js-styles.js'
import Milestone from '../classes/data-sources/Milestone.js'
import User from '../classes/data-sources/User.js'
import MilestoneViewPage from '../classes/components/page-components/MilestoneViewPage.js'

let milestoneId = $('#ms-page-body').attr('data-id');
let masterMilestone;

/************ Initialize Data Sources ************/
(async  () => {
  await User.preloadCurrentUser();
  masterMilestone = await Milestone.fromId(milestoneId);
  
  const pageComponent = new MilestoneViewPage($('body'), masterMilestone);
})();