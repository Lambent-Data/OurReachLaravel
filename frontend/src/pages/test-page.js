/*** Import standard utilities ***/
import '../js-styles.js'

import TestPage from '../classes/components/page-components/TestPage.js';
import Milestone from '../classes/data-sources/Milestone.js';

/*** Import testing modules ***/
import { DummyData } from '../dummy-data.js'

/************ Globals ************/
let masterMilestone;
let milestoneId = 1;

/************ Initialize Data Sources ************/
masterMilestone = Milestone.make(DummyData.milestones[milestoneId], undefined);

console.log(masterMilestone);

/************ Initialize Data Sources ************/
const pageComponent = new TestPage($('body'), masterMilestone);