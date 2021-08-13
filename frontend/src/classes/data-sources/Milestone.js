import User from './User.js';
import Goal from './Goal.js'
import Link from './Link.js'
import Comment from './Comment.js';
import { TemplateMilestoneById } from '../../utilities/templateDataLists.js'
import { makeRequest } from '../../utilities/request.js';
import { toBoolean } from '../../utilities/utils.js';
import { MeasureMetadata } from '../../utilities/object-fields.js';
import { DateTimeFromDatabaseFormat, DateTimeToDatabaseFormat } from '../../utilities/time.js';
import { Status } from "../../utilities/enums"

export default class Milestone {
  static registry = {};

  static make(rawData, parent = null) {
    if ('id' in rawData) {
      const id = parseInt(rawData['id']);
      if (!(id in Milestone.registry)) {
        Milestone.registry[id] = new Milestone(rawData, parent);
      }
      return Milestone.registry[id];
    }
    return new Milestone(rawData, parent);
  }

  constructor(rawData, parent) {
    this.parent = parent;
    this.rawData = rawData;

    if (!('id' in rawData)) {
      // Link not already in db. Created on this page, so user is current user
      this.user_id = User.currentUserId;
      this.user = User.currentUser;
    }

    this.goals = [];
    if (rawData.goals){
      for (const goal of rawData.goals) {
        this.addGoal(Goal.make(goal, this));
      }
    }

    this.links = [];
    if (rawData.links) {
      for (const link of rawData.links) {
        this.addLink(Link.make(link, this));
      }
    }
    // Add template links
    const template = this.template;
    if (template && template.links){
      for (const link of template.links) {
        link.origin = Link.Types.template;
        this.addLink(Link.make(link, this));
      }
    }

    this.comments = [];
    if (rawData.comments) {
      for (const comment of rawData.comments) {
        this.addComment(Comment.make(comment, this));
      }
    }

  }

  addLink(linkObject) {
    linkObject.parent = this;
    this.links.push(linkObject);
  }

  addGoal(goalObject) {
    goalObject.parent = this;
    this.goals.push(goalObject);
  }

  addComment(commentObject) {
    commentObject.parent = this;
    this.comments.push(commentObject);
  }

  static async fromId(id, parent) {
    const resp = await Milestone.retrieveRecord(id, true, true, true);
    return Milestone.make(resp.data, parent);
  }

  static async retrieveRecords(getMilestoneFields = true, getGoals = true, getLinks = true, getComments = true) {
    const destination = "api/milestone/retrieve";
    let resp = await makeRequest({
      url: destination,
      type: "GET",
      data: { milestone: Boolean(getMilestoneFields), goals: Boolean(getGoals), links: Boolean(getLinks), comments: Boolean(getComments) }
    });
    console.log(resp);
    return resp;
  }
  static async retrieveAll() {
    return await Milestone.retrieveRecords();
  }

  static async retrieveRecord(id, getMilestoneFields = true, getGoals = true, getLinks = true, getComments = true){
    const destination = "api/milestone/retrieve/" + id;
    let resp = await makeRequest({
        url: destination,
        type: "GET",
      data: { milestone: Boolean(getMilestoneFields), goals: Boolean(getGoals), links: Boolean(getLinks), comments: Boolean(getComments)}
      });
    console.log(resp);
    return resp;
  }
  async retrieve() {
    return await Milestone.retrieveRecord(this.id);
  }

    static async updateRecord(id, data) {
    const destination = "api/milestone/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "PUT",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async update(data) {
    return await Milestone.updateRecord(this.id, data);
  }

  static async createRecord(data) {
    console.log(data);
    const destination = "api/milestone";
    let resp = await makeRequest({
      url: destination,
      type: "POST",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async create() {
    const resp = await Milestone.createRecord(this.rawData);
    if (resp.status == Status.SUCCESS) {
      this.id = parseInt(resp.data['id']);
      this.ruko_id = parseInt(resp.data['ruko_id_external']);
    }
    return resp;
  }

  static async deleteRecord(id) {
    const destination = "api/milestone/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "DELETE",
    });
    console.log(resp);
    return resp;
  }
  async delete() {
    const resp = await Milestone.deleteRecord(this.id);
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
    Milestone.registry[this.rawData['id']] = this;
  }

  get user_id() {
    return this.rawData['user_id'];
  }
  set user_id(x) {
    this.rawData['user_id'] = x;
  }

  get ruko_id() {
    return this.rawData['ruko_id_external'];
  }
  set ruko_id(x) {
    this.rawData['ruko_id_external'] = x;
  }

  get measure_data(){
    return MeasureMetadata.fromJSON(this.rawData.measure_data);
  }
  set measure_data(x) {
    this.rawData.measure_data = x.toJSON();
  }
  
  get start_measure(){
    return this.rawData.start_measure;
  }
  set start_measure(x) {
    this.rawData.start_measure = x;
  }

  get end_measure() {
    return this.rawData.end_measure;
  }
  set end_measure(x) {
    this.rawData.end_measure = x;
  }

  get template_id() {
    return this.rawData['template_id'];
  }
  set template_id(x) {
    this.rawData['template_id'] = x;
  }
    
  get template(){
    if (this.template_id){
      return TemplateMilestoneById[this.template_id];
    }
  }

  get completed() {
    return toBoolean(this.rawData.completed);
  }
  set completed(x) {
    this.rawData.completed = toBoolean(x);
  }

  get name(){
    return this.rawData.name;
  }
  set name(x){
    this.rawData.name = x;
  }

  get category() {
    return this.rawData.category;
  }
  set category(x) {
    this.rawData.category = x;
  }
  
  get subcategory() {
    return this.rawData.subcategory;
  }
  set subcategory(x) {
    this.rawData.subcategory = x;
  }

  get deadline() {
    return DateTimeFromDatabaseFormat(this.rawData.deadline);
  }
  set deadline(x) {
    if (x){
      this.rawData.deadline = DateTimeToDatabaseFormat(x);
    }else{
      this.rawData.deadline = undefined;
    }
  }

  get createdOn() {
    return DateTimeFromDatabaseFormat(this.rawData['date_created']);
  }
  set createdOn(x) {
    this.rawData['date_created'] = DateTimeToDatabaseFormat(x);
  }

  get vision() {
    return this.rawData.vision;
  }
  set vision(x) {
    this.rawData.vision = x;
  }

  get purpose() {
    return this.rawData.purpose;
  }
  set purpose(x) {
    this.rawData.purpose = x;
  }

  get obstacles() {
    return this.rawData.obstacles;
  }
  set obstacles(x) {
    this.rawData.obstacles = x;
  }
}

