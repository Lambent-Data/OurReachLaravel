/****** Globals ******/
const onViewPage = true;

// Using js namespacing technique via variable LinkForm.
const MilestoneForm = {};
const GoalForm = {};
const LinkForm = {};

MilestoneForm.milestoneToEdit = null;
MilestoneForm.addModal = undefined;
MilestoneForm.editModal = undefined;

LinkForm.modalForm = undefined;
LinkForm.linkToUpdate = null; 

$(document).ready(function () {
  MilestoneForm.addModal = $('#ms-add-modal');
  MilestoneForm.editModal = $('#ms-edit-modal');

  LinkForm.modalForm = $('#link-edit-modal');

  GoalForm.modalForm = $('#goal-edit-modal');
  GoalForm.setup();
});


/********* Goal Form control *********/

GoalForm.setup = function() {
  const weeklyForm = $('#goal-weekly-form');

  //const timeInput = constructTimeInput();
  GoalForm.modalForm.find('.goal-time-wrapper').append(constructTimeInput());
  GoalForm.modalForm.find('.goal-week-wrapper').append(constructWeekSelector());

  GoalForm.modalForm.find('#goal-deadline').toArray().forEach(div => {
    // Initialize datepicker
    GoalForm.datepicker = new Datepicker(div, {
      // Options here. See https://www.cssscript.com/vanilla-date-range-picker/
      autohide: true, // Close datepicker once a date is chosen
    });
  });


  // Add handlers
  const goalFormSections = {
    "one-time" : $('#goal-one-time-form'),
    "daily" : $('#goal-daily-form'),
    "weekly" : $('#goal-weekly-form'),
    "monthly" : $('#goal-monthly-form'),
    "custom" : $('#goal-custom-form'),
  };
  Object.values(goalFormSections).forEach((sec)=>sec.hide());

  $('#goal-basis-input').on("change", () => {
    Object.values(goalFormSections).forEach((sec)=>sec.hide());
    const basis = $('#goal-basis-input').val();
    goalFormSections[basis].show();
    console.log(basis);
  });

  
}



GoalForm.handleResponses = function (resps) {
  function handleItem(resp) {
    if (resp.success == true) {
      if (resp.message) {
        //Usually no message given on success. If there is a message, log it
        console.log("Goal form submission successful.\nSource: " + resp.source + "\n" + resp.message);
      }

      //Success, add goal and close form.

      //console.log(resp);
      const data = resp.data;
      if(data && data.id){
        //Insertion succeeded
        if(masterMilestone){
          masterMilestone.fetchAndAddGoalById(data.id);
        }
      }
      GoalForm.modalForm.modal('hide');
      GoalForm.goalToUpdate.refreshData()
        .then(() => {
          GoalForm.goalToUpdate.updateViewComponent();
          GoalForm.goalToUpdate.addHandlersToViewComponent();
        });
      stopEditing();

      return true;
    }
    //Placeholder for proper validation steps addressing responses:
    console.log("Goal form invalid.\nSource: " + resp.source + "\n" + resp.message);
    return false;
  }

  if (Array.isArray(resps)) {
    resps.forEach(handleItem);
  } else {
    console.error("Non-array passed to GoalForm.handleResponses: " + resps);
  }
}


GoalForm.validateAndSubmit = async function() {
  console.log("Validating goal form...");

  const fieldErrors = [];
  if (!GoalForm.modalForm) {
    fieldErrors.push({ success: false, source: "form", message: "No form attached." });
  }

  //Do some validation...
  const formName = GoalForm.modalForm.find('#goal-name-input').val();
  if (!formName || formName.length == 0) {
    fieldErrors.push({ success: false, source: "goal-name-input", message: "Please enter a description for the goal." });
  }

  let successful;
  if (fieldErrors.length > 0) {
    GoalForm.handleResponses(fieldErrors);
  } else {
    GoalForm.handleResponses([await GoalForm.trySubmit()]);
  }
}

GoalForm.trySubmit = async function() {
  console.log("Validation successful. Attempting to submit goal form...");

  /*const deadlineString = GoalForm.datepicker.getDate('d,m,y');
  const dmy = deadlineString.split(',');
  const date = new Date(Date.UTC(y,m,d,'5','0','0'));
  */


  return [];
  const values = { milestone_id: masterMilestone.id };

  values.goal_name = GoalForm.modalForm.find('#goal-name-input').val();
  values.category = masterMilestone.category;
  switch(GoalForm.modalForm.find('#goal-basis-input').val()){
    case "one-time":
      values.repeat_basis = "one-time";
      //values.next_deadline = ;
      break;
    case "daily":
      values.repeat_basis = "daily";
      break;
    case "weekly":
      values.repeat_basis = "weekly";
      break;
    case "monthly":
      values.repeat_basis = "monthly";
      break;
    case "every-x-days":
      values.repeat_basis = "custom";
      break;
  }

  let params;
  if (!GoalForm.goalToUpdate) {
    //No goalToUpdate, must be a new goal. Try to insert.
  
    params = { action: "insert", entity: "Goal", values: JSON.stringify(values) };
  } else {
    //goalToUpdate is set, so assume it's in the database. Try to update.
    const goal = GoalForm.goalToUpdate;
    const updates = { name: formName, url: formUrl };
    params = { action: "update", entity: "Goal", id: goal.id, updates: JSON.stringify(updates) };

  }
  // Data looks okay. Send access request to server
  let response = await $.post("db/db_access.php", params);

  console.log(response);
  let json;
  try {
    json = JSON.parse(response);
  } catch (e) {
    return [{ success: false, source: "server", message: "Invalid JSON returned from server for goal submit." }];
  }
  if (json) {
    return json;
  }
  return [{ success: false, source: "server", message: "An unknown server error occurred." }];
}

GoalForm.clearForm = function(){
  GoalForm.modalForm.find('#goal-name-input').val("");
  GoalForm.modalForm.find('#goal-basis-input').val("daily").trigger("change");
  GoalForm.modalForm.find('.goal-div-wrapper > input').val("");
}

GoalForm.showForm = function() {
  console.log("Opened goal form");
  GoalForm.clearForm();

  if (!GoalForm.goalToUpdate) {
    // No goal specified to edit, so a new goal is being created.
    //Show suggested
    $('goal-suggested-group').show();
    //Set title
    GoalForm.modalForm.find('h5.modal-title').html("Add new goal");
    //Change submit button text
    GoalForm.modalForm.find('#goal-modal-submit').html("Submit");
  } else {
    $('goal-suggested-group').hide();

    //Set title
    GoalForm.modalForm.find('.modal-title').html("Edit Goal");

    GoalForm.goalToUpdate.populateForm();

    //Change submit button text
    GoalForm.modalForm.find('#goal-modal-submit').html("Save Changes");
  }
  GoalForm.modalForm.find('#goal-modal-submit').off("click").on("click", () => GoalForm.validateAndSubmit());
  GoalForm.modalForm.modal('show');
}

GoalForm.addSuggestedGoal = function(goalName, goalBasis){
  const container = $('#goal-suggested-group > .suggested-goal-box');

  if(goalBasis === "monthly"){
    goalBasis = "weekly";
  }

  const goalDiv = $('<div class="goal suggested-goal-button js-hoverable" style="order:-1"></div>');
  const headerDiv = $('<div class="goal-header"></div>');
  const wrapperDiv = $('<div></div>');
  const nameSpan = $('<span style="font-size:18px"></span>');
  nameSpan.html(goalName);

  headerDiv.on("click", () => {
    window.scrollTo(0,0);
    GoalForm.modalForm.scrollTop(0);
    GoalForm.modalForm.find('#goal-name-input').val(goalName);
    GoalForm.modalForm.find('#goal-basis-input').val(goalBasis).trigger("change");
  });

  goalDiv.append(headerDiv);
  headerDiv.append(wrapperDiv);
  wrapperDiv.append(nameSpan);
  container.append(goalDiv);
}

/********* Link Form control *********/

LinkForm.handleResponses = function (resps) {
  function handleItem(resp) {
    if (resp.success == true) {
      if (resp.message) {
        //Usually no message given on success. If there is a message, log it
        console.log("Link form submission successful.\nSource: " + resp.source + "\n" + resp.message);
      }

      //Success, add link and close form.

      //console.log(resp);
      const data = resp.data;
      if(data && data.id){
        //Insertion succeeded
        if(masterMilestone){
          masterMilestone.fetchAndAddLinkById(data.id);
        }
      }else{
        LinkForm.linkToUpdate.refreshData()
          .then(() => {
            LinkForm.linkToUpdate.updateViewComponent();
            LinkForm.linkToUpdate.addHandlersToViewComponent();
          });
      }

      LinkForm.modalForm.modal('hide');
      stopEditing();

      return true;
    }
    //Placeholder for proper validation steps addressing responses:
    console.log("Link form invalid.\nSource: " + resp.source + "\n" + resp.message);
    return false;
  }

  if (Array.isArray(resps)) {
    resps.forEach(handleItem);
  } else {
    console.error("Non-array passed to LinkForm.handleResponses: " + resps);
  }
}


LinkForm.validateAndSubmit = async function() {
  console.log("Validating link form...");

  const fieldErrors = [];
  if (!LinkForm.modalForm) {
    fieldErrors.push({ success: false, source: "form", message: "No form attached." });
  }

  const formName = LinkForm.modalForm.find('#link-name').val();
  const formUrl = LinkForm.modalForm.find('#link-url').val();

  if (!formName || formName.length == 0) {
    fieldErrors.push({ success: false, source: "link-name", message: "Please enter a description for the link." });
  }
  if (!formUrl || formUrl.length == 0) {
    fieldErrors.push({ success: false, source: "link-url", message: "Please enter a url." });
  }

  let successful;
  if (fieldErrors.length > 0) {
    LinkForm.handleResponses(fieldErrors);
  } else {
    LinkForm.handleResponses([await LinkForm.trySubmit()]);
  }
}

LinkForm.trySubmit = async function() {
  console.log("Validation successful. Attempting to submit link form...")

  const formName = LinkForm.modalForm.find('#link-name').val();
  const formUrl = LinkForm.modalForm.find('#link-url').val();

  let params;
  if (!LinkForm.linkToUpdate) {
    //No EditedLink, must be a new link. Try to insert.
    if (!formName || !formUrl) {
      return [{ success: false, source: "developer error", message: "Missing fields needed to insert." }];
    }
    if (!masterMilestone) {
      return [{ success: false, source: "developer error", message: "No milestone being edited." }];
    }

    const values = { name: formName, url: formUrl, milestone_id: masterMilestone.id };
    params = { action: "insert", entity: "Link", values: JSON.stringify(values) };
  } else {
    //EditedLink is set, so assume it's in the database. Try to update.
    const link = LinkForm.linkToUpdate;
    const updates = { name: formName, url: formUrl };
    params = { action: "update", entity: "Link", id: link.id, updates: JSON.stringify(updates) };

  }
  // Data looks okay. Send access request to server
  let response = await $.post("db/db_access.php", params);

  console.log(response);
  let json;
  try {
    json = JSON.parse(response);
  } catch (e) {
    return [{ success: false, source: "server", message: "Invalid JSON returned from server for link submit." }];
  }
  if (json) {
    return json;
  }
  return [{ success: false, source: "server", message: "An unknown server error occurred." }];
}

LinkForm.enableForm = function(){
  LinkForm.modalForm.find('#link-name').attr('readonly', false);
  LinkForm.modalForm.find('#link-url').attr('readonly', false);
}

LinkForm.disableForm = function(){
  LinkForm.modalForm.find('#link-name').attr('readonly', true);
  LinkForm.modalForm.find('#link-url').attr('readonly', true);
}


LinkForm.showForm = function() {
  console.log("Opened link form");
  LinkForm.modalForm.find('.modal-footer').show();
  LinkForm.enableForm();
  if (!LinkForm.linkToUpdate) {
    // No link specified to edit, so a new link is being created.
    //Set title
    LinkForm.modalForm.find('h5.modal-title').html("Add new link");
    //Empty fields
    LinkForm.modalForm.find('#link-name').val("");
    LinkForm.modalForm.find('#link-url').val("");
    //Change submit button text
    LinkForm.modalForm.find('#link-modal-submit').html("Submit");
  } else if (LinkForm.linkToUpdate.suggested) {
    //Set title
    LinkForm.modalForm.find('.modal-title').html("Suggested Link");

    LinkForm.linkToUpdate.populateForm();
    LinkForm.disableForm();

    //Change submit button text
    LinkForm.modalForm.find('.modal-footer').hide();
  } else {
    //Set title
    LinkForm.modalForm.find('.modal-title').html("Edit Link");

    LinkForm.linkToUpdate.populateForm();

    //Change submit button text
    LinkForm.modalForm.find('#link-modal-submit').html("Save Changes");
  }
  LinkForm.modalForm.find('#link-modal-submit').off("click").on("click", () => LinkForm.validateAndSubmit());
  LinkForm.modalForm.modal('show');
}