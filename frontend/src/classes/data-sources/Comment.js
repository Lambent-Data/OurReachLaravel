import { Status } from "../../utilities/enums";
import { makeRequest } from "../../utilities/request"
import { DateTimeFromDatabaseFormat, DateTimeFromISO } from "../../utilities/time";
import User from "./User";

export default class Comment {
  static registry = {};

  static make(rawData, parent=null){
    if ('id' in rawData) {
      const id = parseInt(rawData['id']);
      if (!(id in Comment.registry)) {
        Comment.registry[id] = new Comment(rawData, parent);
      }
      return Comment.registry[id];
    }
    return new Comment(rawData, parent);
  }

  constructor(rawData, parent=null) {
    this.parent = parent;
    this.rawData = rawData;

    if (!('id' in rawData)) {
      // Not already in db. Created on this page, so user is current user
      this.user_id = User.currentUserId;
      this.user = User.currentUser;
      // Belongs to milestone of this page, passed in as parent
      this.milestone_id = this.parent.id;
    }else{
      this.user = User.make(this.rawData['user']);
    }
  }

  static async retrieveRecord(id) {
    const destination = "api/comment/retrieve/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "GET"
    });
    console.log(resp);
    return resp;
  }

  async retrieve(){
    return await Comment.retrieveRecord(this.id);
  }

  static async updateRecord(id, data) {
    console.log(data);
    const destination = "api/comment/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "PUT",
      data: data
    });
    console.log(resp);
    return resp;
  }

  async update(data){
    return await Comment.updateRecord(this.id, data);
  }

  static async createRecord(data) {
    const destination = "api/comment";
    let resp = await makeRequest({
      url: destination,
      type: "POST",
      data: data
    });
    console.log(resp);
    return resp;
  }
  async create(){
    const resp = await Comment.createRecord(this.rawData);
    if (resp.status == Status.SUCCESS) {
      this.rawData = resp.data;
    }
    return resp;
  }

  static async deleteRecord(id) {
    const destination = "api/comment/" + id;
    let resp = await makeRequest({
      url: destination,
      type: "DELETE",
    });
    console.log(resp);
    return resp;
  }
  async delete() {
    const resp = await Comment.deleteRecord(this.id);
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
    Comment.registry[this.rawData['id']] = this;
  }

  get user_id() {
    return this.rawData['user_id'];
  }
  set user_id(x){
    this.rawData['user_id'] = x;
  }

  get milestone_id() {
    return this.rawData['milestone_id'];
  }
  set milestone_id(x) {
    this.rawData['milestone_id'] = x;
  }

  get comment_text(){
    return this.rawData['comment_text'];
  }
  set comment_text(x){
    this.rawData['comment_text'] = x;
  }

  get image(){
    return this.user.image;   
  }

  get last_edited() {
    return DateTimeFromDatabaseFormat(this.rawData['last_edited']);
  }

  get created_at() {
    return DateTimeFromISO(this.rawData['created_at']);
  }
}