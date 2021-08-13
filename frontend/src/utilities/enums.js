const Message = {
  CLICK: "clicked",
  CHANGE: "value changed",
  FOCUS: "field focused",
  BLUR: "field blurred",
  START_EDITING: "started editing",
  STOP_EDITING: "stopped editing",
  SUBMIT: "submit form",
  DELETE: "delete",
  CLOSE_MODAL: "close modal",
  ADD_LINK: "add link component",
  ADD_GOAL: "add goal component",
  ADD_COMMENT: "add comment component",
  EDIT_MILESTONE: "edit milestone component",
  EDIT_LINK: "edit link component",
  EDIT_GOAL: "edit goal component",
  EDIT_COMMENT: "edit comment component",
  DELETE_LINK: "delete link component",
  DELETE_GOAL: "delete goal component",
  DELETE_COMMENT: "delete comment component",
  DELETE_MILESTONE: "delete milestone component",
  CREATED_MILESTONE: "created new milestone",
  SET_TEMPLATE: "setting goal template",
  UNSET_TEMPLATE: "unsetting goal template"
}

const Pages = {
  NOT_FOUND: 'not-found',
  DASHBOARD: 'dashboard',
  LISTING: 'listing',
  VIEW_MILESTONE: 'view_milestone'
}

const Outcome = {
  SUCCESS: "SUCCESS",
  BAD_VALUE: "BAD VALUE",
  EXCEPTION: "EXCEPTION",
  NOT_FOUND: "NOT FOUND",
  NO_PERMISSION: "NO_PERMISSION"
}

const Status = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  EXCEPTION: "EXCEPTION",
}


const EntityEnum = {
  MILESTONE: "App\\Models\\Milestone",
  GOAL: "App\\Models\\Goal",
  LINK: "App\\Models\\Link"
}

const CategoryEnum = {
  HEALTH: "Health",
  CHILDREN: "Children",
  EDUCATION: "Education",
  HOUSING: "Housing",
  JOBS: "Jobs",
  MONEY: "Money",
  OTHER: "Other"
}

const MeasureType = {
  DROPDOWN: "dropdown",
  FREEFORM: "freeform",
  NONE: "none"
}

const RepeatType = {
  ONE_TIME: "one-time",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
}

const Day = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday"
}

const UserRole = {
  ADMIN: "Admin",
  MENTOR: "Mentor",
  PARENT: "Parent",
  COORDINATOR: "Coordinator"
}

export { Pages, Message, Outcome, Status, EntityEnum, MeasureType, RepeatType, Day, CategoryEnum, UserRole }
