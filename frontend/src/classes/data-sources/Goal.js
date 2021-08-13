import Link from "./Link"
import Milestone from "./Milestone"
import User from "./User"
import { DateTimeFromDatabaseFormat, DateTimeFromISO } from "../../utilities/time"
import { makeRequest } from "../../utilities/request"
import { RepeatRule } from "../../utilities/object-fields"
import { Status } from "../../utilities/enums"
import { toBoolean } from "../../utilities/utils"

export default class Goal {
  static registry = {};

  static make(rawData, parent = null) {
    if ('id' in rawData) {
      const id = parseInt(rawData['id']);
      if (!(id in Goal.registry)) {
        Goal.registry[id] = new Goal(rawData, parent);
      }
      return Goal.registry[id];
    }
    return new Goal(rawData, parent);
  }

  constructor(rawData, parent = null) {
    this.parent = parent;
    this.rawData = rawData;

    if (!('id' in rawData)) {
      // Link not already in db. Created on this page, so user is current user
      this.user_id = User.currentUserId;
      this.user = User.currentUser;
    }

    this.links = [];
    if (rawData.links) {
      for (const link of rawData.links) {
        this.addLink(Link.make(link, this));
      }
    }
    // Add template links
    const template = this.template;
    if (template) {
      if (template.links){
        for (const link of template.links) {
          link.origin = Link.Types.template;
          this.addLink(Link.make(link, this));
        }
      }
    }

    if (this.parent) {
      // autofill all fields inherited from the parent (a milestone)
      this.milestone_id = this.parent.id;
      this.category = this.parent.category;
    }
  }

  addLink(linkObject) {
    linkObject.parent = this;
    this.links.push(linkObject);
  }

  static async retrieveRecord(id) {
    const destination = "api/goal/retrieve/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "GET"
    });
    console.log(resp);
    return resp;
  }
  async retrieve() {
    return await Goal.retrieveRecord(this.id);
  }

  static async updateRecord(id, data) {
    const destination = "api/goal/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "PUT",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async update(data) {
    const resp = await Goal.updateRecord(this.id, data);
    if (resp.status == Status.SUCCESS) {
      this.rawData = resp.data;
      console.log(resp.data);
    }
    return resp;
  }

  static async createRecord(data) {
    const destination = "api/goal";
    let resp = await makeRequest({
      url: destination,
      type: "POST",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async create() {
    const resp = await Goal.createRecord(this.rawData);
    if (resp.status == Status.SUCCESS) {
      this.rawData = resp.data;
    }
    return resp;
  }

  static async deleteRecord(id) {
    const destination = "api/goal/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "DELETE",
    });
    console.log(resp);
    return resp;
  }
  async delete() {
    const resp = await Goal.deleteRecord(this.id);
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
    Goal.registry[this.rawData['id']] = this;
  }

  get milestone_id() {
    return this.rawData['milestone_id'];
  }
  set milestone_id(x) {
    this.rawData['milestone_id'] = x;
  }

  get user_id() {
    return this.rawData['user_id'];
  }
  set user_id(x) {
    this.rawData['user_id'] = x;
  }

  get category() {
    return this.rawData['category'];
  }
  set category(x) {
    this.rawData['category'] = x;
  }

  get name() {
    return this.rawData['name'];
  }
  set name(x) {
    this.rawData['name'] = x;
  }

  get description() {
    return this.rawData['description'];
  }
  set description(x) {
    this.rawData['description'] = x;
  }

  get template_id() {
    return this.rawData['template_id'];
  }
  set template_id(x) {
    this.rawData['template_id'] = x;
  }

  get template() {
    if (this.template_id && this.parent instanceof Milestone && this.parent.template && this.parent.template.goals) {
      for (const g of this.parent.template.goals){
        if (g.name == this.template_id){
          return g;
        }
      }
    }
    return undefined;
  }

  get notes() {
    return this.rawData['notes'];
  }
  set notes(x) {
    this.rawData['notes'] = x;
  }

  get completed() {
    return toBoolean(this.rawData['completed']);
  }
  set completed(x) {
    this.rawData['completed'] = toBoolean(x);
  }

  get private() {
    return toBoolean(this.rawData['private']);
  }
  set private(x) {
    this.rawData['private'] = toBoolean(x);
  }

  get history(){
    return JSON.parse(this.rawData['history']);
  }

  get nextDeadline() {
    return DateTimeFromDatabaseFormat(this.rawData['next_deadline']);
  }

  get createdOn() {
    return DateTimeFromISO(this.rawData['created_at']);
  }

  get repeat() {
    return RepeatRule.fromJSON(this.rawData['repeat_rule']);
  }
  set repeat(x) {
    this.rawData['repeat_rule'] = x.toJSON();
  }

  get sortOrder(){
    const now = Date.now() / 1000; //Divide by 1000 to convert from ms to s
    const minutesDifference = Math.floor((this.nextDeadline.toSeconds() - now) / 60);
    return this.completed ? 52560000 + minutesDifference : minutesDifference;
  }
}

