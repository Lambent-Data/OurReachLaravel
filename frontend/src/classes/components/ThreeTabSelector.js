import { constructTabButton } from '../../utilities/milestone-elements.js'
import { isMobile, onMobileView, onDesktopView } from '../../utilities/detectMobileDesktop.js'
import Component from './Component.js'

export default class ThreeTabSelector extends Component {

  constructor(tabs, startingTabName) {
    const wrapper = $('<div></div>');
    super(wrapper);
    this.name = "tab-selector";

    this.tabs = tabs;
    if (tabs.length !== 3) {
      throw "Tab selector not given exactly 3 tabs";
    }
    this.startingTabName = startingTabName;
    this.currentTab = this.getTabByName(startingTabName);
  
    this.tabContents = {};
    for (const tab of this.tabs){
      this.tabContents[tab.name] = [];
    }

    this.populate();
    this.updateDOM();
  }

  populate() {
    super.populate();

    this.wrapper.addClass("tab-selector mobile-only");
    for (const tab of this.tabs) {
      const tabDiv = constructTabButton(tab);
      tab.div = tabDiv;
      this.wrapper.append(tabDiv);
      tabDiv.on('click', () => this.goToTab(tab.name));
    }

    /* Add handlers for switching between desktop/mobile views */
    onMobileView(() => {
      this.goToTab(this.startingTabName);
    });

    onDesktopView(() => {
      for (const tab of this.tabs) {
        this.tabContents[tab.name].forEach(element => $(element).fadeIn());
      }
    });
  }

  getTabByName(tabName) {
    const matchingTabs = this.tabs.filter((tab) => tab.name == tabName);
    if (matchingTabs.length > 0) {
      return matchingTabs[0];
    } else {
      //Default to second tab, if name not found
      return this.tabs[1];
    }
  }

  addToTab(elem, tabName) {
    if (tabName in this.tabContents) {
      this.tabContents[tabName].push(elem);
      if (isMobile() && this.currentTab.name !== tabName){
        $(elem).hide();
      }else{
        $(elem).show();
      }
    }
  }

  goToTab(tabName) {
    for (const tab of this.tabs){
      if (tab.name == tabName){
        this.tabContents[tab.name].forEach(element => $(element).fadeIn());
        tab.div.addClass('selected');
        this.currentTab == tab;
      }else{
        this.tabContents[tab.name].forEach(element => $(element).hide());
        tab.div.removeClass('selected');
      }
    }
  }
}
