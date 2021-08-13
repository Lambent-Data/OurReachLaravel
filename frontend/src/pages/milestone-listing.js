/*** Import standard utilities ***/
import '../js-styles.js'
import Milestone from '../classes/data-sources/Milestone.js'
import User from '../classes/data-sources/User.js'
import MilestoneListingPage from '../classes/components/page-components/MilestoneListingPage.js'
import MentorDashboard from '../classes/components/page-components/MentorDashboard'
import { UserRole } from '../utilities/enums.js';

(async  () => {
  await User.preloadCurrentUser();

  if (User.currentUser.role == UserRole.PARENT){
    const milestones = [];
    try {
      const resp = await Milestone.retrieveAll();
      for (const rec of Object.values(resp.data)){
        milestones.push(Milestone.make(rec));
      }
    } catch(e) {
      console.error(e);
      return;
    }

    const pageComponent = new MilestoneListingPage($('#ms-listing-body'), milestones);
  }else{
    const assignedUsers = [];
    try {
      const resp = await User.retrieveAllAssigned();
      for (const rec of Object.values(resp.data)) {
        assignedUsers.push(User.make(rec));
      }
    } catch(e) {
      console.error(e);
      return;
    }

    const pageComponent = new MentorDashboard($('#ms-listing-body'), assignedUsers);
  }
})();