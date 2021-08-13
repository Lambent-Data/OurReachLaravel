/*** Import standard utilities ***/
import '../js-styles.js'

/*** Import entity classes ***/
import Milestone from '../classes/data-sources/Milestone.js'
import User from '../classes/data-sources/User.js';

/*** Import component managers ***/
import DashboardPage from '../classes/components/page-components/DashboardPage.js'

(async () => {
  await User.preloadCurrentUser();

  let t = Date.now();
  const milestones = [];
  try {
    const resp = await Milestone.retrieveAll();
    for (const rec of Object.values(resp.data)) {
      milestones.push(Milestone.make(rec));
    }
  } catch (e) {
    console.error(e);
    return;
  }
  console.log("Milestones data gathered in " + (Date.now() - t) / 1000 + " seconds");

  const pageComponent = new DashboardPage($('#dashboard-body'), User.currentUser, milestones);
})();