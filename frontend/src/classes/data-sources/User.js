import Milestone from "./Milestone";
import { noImagePath, userIconsPath } from "../../env"
import { makeRequest } from "../../utilities/request";
import { UserRole } from "../../utilities/enums";

export default class User {
  static registry = {};
  static currentUserId = parseInt($('body').attr('data-user'));
  static currentUser = "user not loaded";

  static async preloadCurrentUser(){
    let t = Date.now();
    User.currentUser = await User.fromId(User.currentUserId, undefined);
    console.log("User data gathered in " + (Date.now() - t)/1000 + " seconds");
  }

  static make(rawData, parent = null) {
    console.log(rawData);
    if ('id' in rawData) {
      const id = parseInt(rawData['id']);
      if (!(id in User.registry)) {
        User.registry[id] = new User(rawData, parent);
      }
      return User.registry[id];
    }
    return new User(rawData, parent);
  }
  
  constructor(rawData) {
    this.rawData = rawData;

    this.milestones = [];
    if ('milestones' in this.rawData){
      for (const msData of this.rawData.milestones){
        this.milestones.push(Milestone.make(msData, this));
      }
    }
  }
  
  static async fromId(id, parent) {
    const resp = await User.retrieveRecord(id);
    return User.make(resp.data, parent);
  }

  static async retrieveRecord(id) {
    const destination = "api/user/retrieve/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "GET",
      data: {}
    });
    console.log(resp);
    return resp;
  }
  async retrieve() {
    return await User.retrieveRecord(this.id);
  }

  static async retrieveAllAssigned(id) {
    const destination = "api/user/retrieveAllAssigned";
    let resp = await makeRequest({
      url: destination,
      type: "GET",
      data: {}
    });
    console.log(resp);
    return resp;
  }

  // ------------ GETTERS AND SETTERS ------------- //
  get id() {
    return this.rawData['id'];
  }
  set id(x) {
    if ('id' in this.rawData) {
      // Should not be setting id if already set
      throw "Id already set!" 
    }
    this.rawData['id'] = parseInt(x);
    User.registry[this.rawData['id']] = this;
  }

  get name() {
    return this.rawData['field_7'] + " " + this.rawData['field_8'];
  }

  get image(){
    if ('image' in this.rawData && this.rawData['field_10']) {
      return userIconsPath + this.rawData['image'];
    } else {
      return noImagePath;
    }
  }

  get role(){
    switch (parseInt(this.rawData['field_6'])){
      case 0:
        return UserRole.ADMIN;
      case 5:
        return UserRole.MENTOR;
      case 6:
        return UserRole.PARENT;
      case 15:
        return UserRole.COORDINATOR;
    }
    return "Unknown";
  }
}
