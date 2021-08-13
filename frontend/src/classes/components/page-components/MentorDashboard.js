import Component from '../Component.js'
import DashboardPageComponent from './DashboardPage.js'
import { Message } from '../../../utilities/enums.js'
import DropdownComponent from '../field-components/DropdownComponent.js'

// TODO
export default class MentorDashboard extends Component {

  constructor(wrapper, assignedUsers) {
    super(wrapper);
    this.name = "mentor-dash-page";
    this.wrapper.addClass("empty");
    this.assignedUsers = assignedUsers;
    
    this.activeUserId = undefined;
    this.userIds = [];
    this.userNames = [];
    for (const usr of assignedUsers) {
      this.userIds.push(usr.id);
      this.userNames.push(usr.name);
    }
    this.tabs = {};

    this.populate();
    this.updateDOM();

    for (const usr of this.assignedUsers) {
      this.addDashboardTab(usr);
    }
    if (this.userIds.length > 0){
      this.components.userDropdown.value = this.userIds[0];
      this.selectUser(this.userIds[0]);
    }
  }

  populate() {
    const dom = this.dom;
    dom.bodyDiv = this.wrapper.css({ "display": "flex", "flex-direction": "column", "max-width": "1500px", "width": "100%", "position": "relative" });

    this.components.userDropdown = new DropdownComponent(this, 'parent', 'Parent: ', this.userIds.length > 0 ? this.userIds[0]: undefined,
                                                         this.userNames, this.userIds, undefined, false);
    this.components.userDropdown.startEditing();
    
    dom.userDropdown = this.components.userDropdown.getWrapper();
    dom.userDropdown.css({"width": "100%", "max-width": "300px"});
    dom.dashWrapper = $('<div style="width: 100%;"></div>');

    dom.userDropdown.addClass('hide-on-empty-ancestor');
    dom.dashWrapper.addClass('hide-on-empty-ancestor');

    dom.placeholder = $('<div class="listing-page-placeholder"><span>No parents are assigned to you</span></div>');

    dom.bodyDiv.append(dom.placeholder)
               .append(dom.userDropdown)
               .append(dom.dashWrapper);

  }

  addDashboardTab(usr) {
    this.wrapper.removeClass("empty");
    const comp = new DashboardPageComponent(undefined, usr, usr.milestones, usr.name);
    this.components[comp.id] = comp;
    this.tabs[usr.id] = comp;
    this.dom.dashWrapper.append(comp.getWrapper());
    comp.getWrapper().hide();
  }

  selectUser(id){
    if (id !== this.activeUserId && id in this.tabs){
      if (this.activeUserId in this.tabs){
        this.tabs[this.activeUserId].getWrapper().hide();
      }
      this.activeUserId = id;
      this.tabs[id].getWrapper().show();

    }
  }

  handleMessage(id, msg, data) {
    if (this.hasPopulated) {
      switch (id) {
        case this.components.userDropdown.id:
          if (msg == Message.CHANGE){
            console.log("CHANGE USER", this.components.userDropdown.value);
            this.selectUser(this.components.userDropdown.value);
          }
      }
    }
  }
}