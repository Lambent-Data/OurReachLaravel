/************ Globals ************/
let milestoneId = undefined;

let editedSection = undefined;
let masterMilestone = undefined;
let userData = undefined;

/* Consider adding order field, which specifies order of sections */
const tabs = [{ name: "Support", tabClass: "ms-tab-support", iconName: "fa-hands" },
              { name: "Goals", tabClass: "ms-tab-goals", iconName: "fa-mountain" },
              { name: "Vision", tabClass: "ms-tab-journal", iconName: "fa-book" }];

/************ AJAX ***********/

function loadAndRenderPage(){
  // Page is hidden until we show it, after the data is ready.
  masterMilestone = new Milestone(milestoneId);
  masterMilestone.setFieldsFromRecord(DummyData.milestones[milestoneId]);
  masterMilestone.populateViewPage();
  
  const dummyGoals = DummyData.goalsByMilestoneId[milestoneId];
  if(dummyGoals){
    //dummyGoals.sort((g1, g2)=>g1.next_deadline >= g2.next_deadline);
    dummyGoals.forEach((goal) => masterMilestone.addGoal(new Goal(goal, masterMilestone)));
  }
  
  if(masterMilestone.templateContent){
    // Add suggested links to milestone page
    for (templateLink of masterMilestone.templateContent.links){
      const record = {
        name: templateLink.name,
        url: templateLink.url,
        sort_order: 1,
        deleted: false };
      const suggestedLink = new Link(record, milestoneId, true);
      masterMilestone.addLink(suggestedLink);
    }
    // Add suggested goals to goal edit form
    for (templateGoal of masterMilestone.templateContent.goals){
      GoalForm.addSuggestedGoal(templateGoal.name, templateGoal.type);
    }
  }

  $('.ms-page-content').fadeIn();
}

window.addEventListener("message", (event) => {
  if(!milestoneId){
    if(event.data.milestoneId){
      milestoneId = event.data.milestoneId;
      loadAndRenderPage();
    }
  }
  if(event.data.milestoneId && milestoneId !== undefined){
    window.parent.postMessage({receivedId: true});
  }
}, false);

/************* On document load *************/
$(document).ready(function(){
  alterPage();
  
  $('div.ms-journal-wrapper .ms-journal-accordion .ms-journal-textarea').each(showOrHideAccordionButton);
  setMobileOrDesktopView();

  //loadUserRecord().then(data => userData = data);

  milestoneId = 46;
  loadAndRenderPage();
});

/************* On window resize *************/
$(window).resize(function () {
  // Show/hide accordion button if needed
  $('div.ms-journal-wrapper .ms-journal-accordion .ms-journal-textarea').each(showOrHideAccordionButton);

  setMobileOrDesktopView();
});

/************* Editing HTML components dynamically *************/

$('.ms-page-content').hide();
for (const tab of tabs) {
  $('#ms-tab-selector').append(constructTabButton(tab, goToTab(tab)));
}

function alterPage(){
  /* Field editing logic */
  $('#ms-title-section').append(constructEditButton("Title"));
  $('#ms-goals-section').append(constructEditButton("Goals"));
  $('#ms-links-section').append(constructEditButton("Links"));
  $('#ms-vision-section .ms-journal-wrapper').append(constructEditButton("Vision"));
  $('#ms-purpose-section .ms-journal-wrapper').append(constructEditButton("Purpose"));
  $('#ms-obstacles-section .ms-journal-wrapper').append(constructEditButton("Obstacles"));

  /* The edit button toggles editing, or confirms a field being edited. */
  $('.ms-edit-button').each(function() {
    $(this).on("click", () => {
      const section = $(this).attr("section");
      if ($(this).hasClass("editing")){
        stopEditing();
      }else{
        editSection(section);
      }});  
  });
}


/* Determine whether we are on a phone. For now, just going by screen size, later will do something better. */
function inMobileView() {
  return $(window).width() <= 640;
}
let mobileView = undefined;

/* Called to transition between mobile and desktob view */
function setMobileOrDesktopView(){
  if (mobileView === inMobileView()) return; // Nothing has changed. Do nothing.

  // Else, set mobileView correctly.
  mobileView = inMobileView();
  if (mobileView) {
    $('.ms-tab').hide();
    // Just entered mobile view! Go to the current tab.
    clickTabButton(currentTab === undefined ? startingTab : currentTab);
  } else {
    // Just left mobile view! Show everything (except the tab selector).
    $('.ms-tab').show();
  }
}

/************* Tab logic ************/
let currentTab = undefined;
const startingTab = "Goals";

/*
 * Returns a function that transitions to a tab, 
 * displaying the relevant sections and fading in the background image
 */
function goToTab({ name, tabClass }) {
  return () => {
    // Note : If you want to change the order of section, this can be done with the order css property.
    $('.ms-tab-button').removeClass('selected');
    $('.ms-tab-button.' + tabClass).addClass('selected');
    $('.ms-tab').hide();
    if (name === currentTab) {
      $('.' + tabClass).show();
    } else {
      stopEditing();
      window.scrollTo(0, 0); /* Go to top */
      const fadingImage = $('#ms-image-background'); /* Get the fading background image */
      if (fadingImage.hasClass(tabClass)){ /* If it is present on this tab */
        fadingImage.removeClass("transition-active"); /* Disable the transition animation */
        fadingImage.removeClass("transparent"); /* Make it visible */
        setTimeout(()=> {
          fadingImage.addClass("transition-active"); /* Enable the transition animation */
          fadingImage.addClass("transparent"); /* Then fade after delay */
        }, 0);
      }else{
        fadingImage.removeClass("transition-active"); /* Disable the transition animation */
        fadingImage.addClass("transparent"); /* Then immediately make invisible */
      }
      $('.' + tabClass).fadeIn(800);
    }
    currentTab = name;
  }
}
function clickTabButton(tabName) {
  const matching = tabs.filter((tab) => tab.name === tabName);
  if (matching.length > 0) {
    const tabClass = matching[0].tabClass;
    $('.ms-tab-button.' + tabClass).click();
  }
}

function stopEditing(){
  $('.ms-edit-button').removeClass("editing");

  let journalWrapper;

  // Turn off editing for currently edited section
  switch(editedSection){
    case "Goals":
      $('#ms-goals-section').removeClass("editing");
      break;
    case "Links":
      $('#ms-links-section').removeClass("editing");
      break;
    case "Vision":
      journalWrapper = $('#ms-vision-section .ms-journal-wrapper');
      journalWrapper.removeClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", false);
      
      masterMilestone.push({vision: $('#vision-input').html()});
      break;
    case "Purpose":
      journalWrapper = $('#ms-purpose-section .ms-journal-wrapper');
      journalWrapper.removeClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", false);

      masterMilestone.push({purpose: $('#purpose-input').html()});
      break;
    case "Obstacles":
      journalWrapper = $('#ms-obstacles-section .ms-journal-wrapper');
      journalWrapper.removeClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", false);

      masterMilestone.push({obstacles: $('#obstacles-input').html()});
      break;
  }

  editedSection = undefined;
}

function editSection(section){
  if (section === editedSection) return;

  stopEditing();

  editedSection = section;

  let journalWrapper;

  switch(section){
    case "Title":
      $('#ms-title-section .ms-edit-button').addClass("editing");
      break;
    case "Goals":
      $('#ms-goals-section').addClass("editing");
      $('#ms-goals-section .ms-edit-button').addClass("editing");
      break;
    case "Links":
      $('#ms-links-section').addClass("editing");
      $('#ms-links-section .ms-edit-button').addClass("editing");
      break;
    case "Vision":
      journalWrapper = $('#ms-vision-section .ms-journal-wrapper');
      journalWrapper.addClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", true).focus();
      journalWrapper.find('.ms-edit-button').addClass("editing");
      break;
    case "Purpose":
      journalWrapper = $('#ms-purpose-section .ms-journal-wrapper');
      journalWrapper.addClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", true).focus();
      journalWrapper.find('.ms-edit-button').addClass("editing");
      break;
    case "Obstacles":
      journalWrapper = $('#ms-obstacles-section .ms-journal-wrapper');
      journalWrapper.addClass("editing");
      journalWrapper.find('.ms-journal-accordion .ms-journal-textarea').attr("contenteditable", true).focus();
      journalWrapper.find('.ms-edit-button').addClass("editing");
      break;
  }
}

/************* Add handlers for contenteditable textareas *************/

$('div.ms-journal-wrapper .ms-journal-accordion .ms-journal-textarea').on('input', showOrHideAccordionButton);


/* Show or hide the accordion button (to expand or minimize) associated with a journal textarea,
 * based on whether the height is larger than the minimum.
*/
function showOrHideAccordionButton(){
  const textarea = $(this);
  const accordion = textarea.parent();
  const accordionButton = accordion.find('.ms-journal-accordion-button');
  if(accordionButton.css('display') === 'none' && textarea.height() > parseInt(textarea.css('min-height'))){
    accordionButton.css('display', 'block');
  }else{
    if(accordionButton.css('display') !== 'none' && textarea.height() <= parseInt(textarea.css('min-height'))){
      accordionButton.css('display', 'none');
    }
  }
}

// Add handlers to textareas in journal areas
$('div.ms-journal-wrapper .ms-journal-accordion .ms-journal-textarea').on("focus",
function(){
  const accordion = $(this).parent();
  if(accordion.hasClass('closed')){
    accordion.removeClass('closed');
    accordion.addClass('open');
  }
});

$('div.ms-journal-wrapper .ms-journal-accordion .ms-journal-accordion-button').on("click",
function(){
  const accordion = $(this).parent();
  if(accordion.hasClass('closed')){
    accordion.removeClass('closed');
    accordion.addClass('open');
  }else{
    accordion.removeClass('open');
    accordion.addClass('closed');
  }
});
