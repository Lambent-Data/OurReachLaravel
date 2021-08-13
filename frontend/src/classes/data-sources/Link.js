import { Status, Message, EntityEnum } from "../../utilities/enums";
import { makeRequest } from "../../utilities/request"
import { DateTimeToDatabaseFormat, DateTimeFromDatabaseFormat } from "../../utilities/time";
import Goal from "./Goal";
import User from "./User";
import Milestone from "./Milestone";

export default class Link {
  static addLinkButton = undefined;
  static Types = {
    user: "user",
    staff: "staff",
    template: "template"
  }
  static registry = {};

  static make(rawData, parent = null) {
    if ('id' in rawData) {
      const id = parseInt(rawData['id']);
      if (!(id in Link.registry)) {
        Link.registry[id] = new Link(rawData, parent);
      }
      return Link.registry[id];
    }
    return new Link(rawData, parent);
  }

  constructor(rawData, parent = null) {
    this.parent = parent;
    this.rawData = rawData;

    if (!('id' in rawData)){
      // Link not already in db. Created on this page, so user is current user
      this.user_id = User.currentUserId;
      this.user = User.currentUser;
      
      // autofill all fields inherited from the parent (a milestone or goal)
      this.rawData.link_owner_id = this.parent.id;
      
      if (this.parent instanceof Milestone){
        this.rawData.link_owner_type = EntityEnum.MILESTONE;
      }else if (this.parent instanceof Goal){
        this.rawData.link_owner_type = EntityEnum.GOAL;
      }
    }
  }

  static async retrieveRecord(id) {
    const destination = "api/link/retrieve/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "GET"
    });
    console.log(resp);
    return resp;
  }

  async retrieve(){
    return await Link.retrieveRecord(this.id);
  }

  static async updateRecord(id, data) {
    console.log(data);
    const destination = "api/link/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "PUT",
      data: data
    });
    console.log(resp);
    return resp;
  }

  async update(data){
    return await Link.updateRecord(this.id, data);
  }

  static async createRecord(data) {
    console.log(data);
    const destination = "api/link";
    let resp = await makeRequest({
      url: destination,
      type: "POST",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async create(){
    const resp = await Link.createRecord(this.rawData);
    if (resp.status == Status.SUCCESS) {
      this.id = parseInt(resp.data.id);
    }
    return resp;
  }

  static async deleteRecord(id) {
    const destination = "api/link/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "DELETE",
    });
    console.log(resp);
    return resp;
  }
  async delete() {
    const resp = await Link.deleteRecord(this.id);
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
    Link.registry[this.rawData['id']] = this;
  }

  get user_id() {
    return this.rawData['user_id'];
  }
  set user_id(x){
    this.rawData['user_id'] = x;
  }

  get description(){
    return this.rawData.name;
  }
  set description(x){
    this.rawData.name = x;
  }

  get origin() {
    return this.rawData.origin;
  }

  get name() {
    return this.rawData.name;
  }
  set name(x) {
    this.rawData.name = x;
  }

  get url(){
    return this.rawData.url;
  }
  set url(x){
    this.rawData.url = x;
  }

  get createdOn() {
    return DateTimeFromDatabaseFormat(this.rawData['date_created']);
  }
  set createdOn(x) {
    this.rawData['date_created'] = DateTimeToDatabaseFormat(x);
  }
}