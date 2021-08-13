/* constructCategoryIcon: Takes name : ("Housing" | "Health" | "Education" | "Money Management" | "Jobs" | "Children" | "Other" | string) */
function constructCategoryIcon(name, includeLabel = true) {
  const outerDiv = $('<div class="category-icon-container"></div>');
  const backCircle = $('<i class="fa fa-circle fa-stack-2x"></i>');
  let outerSpan, icon, label;
  switch (name) {
    case "Housing":
      outerSpan = $('<span class="fa-stack fa-2x ld-housing"></span>');
      icon = $('<i class="fa fa-home fa-stack-1x inverse"></i>');
      label = $('<span>Housing</span>');
      break;
    case "Health":
      outerSpan = $('<span class="fa-stack fa-2x ld-health"></span>');
      icon = $('<i class="fa fa-heart fa-stack-1x inverse"></i>');
      label = $('<span>Health</span>');
      break;
    case "Education":
      outerSpan = $('<span class="fa-stack fa-2x ld-education"></span>');
      icon = $('<i class="fa fa-graduation-cap fa-stack-1x inverse"></i>');
      label = $('<span>Education</span>');
      break;
    case "Money":
    case "Money Management":
      outerSpan = $('<span class="fa-stack fa-2x ld-money"></span>');
      icon = $('<i class="fa fa-money-bill-wave fa-stack-1x inverse"></i>');
      label = $('<span>Money</span>');
      break;
    case "Jobs":
      outerSpan = $('<span class="fa-stack fa-2x ld-jobs"></span>');
      icon = $('<i class="fa fa-chart-line fa-stack-1x inverse"></i>');
      label = $('<span>Jobs</span>');
      break;
    case "Children":
      outerSpan = $('<span class="fa-stack fa-2x ld-children"></span>');
      icon = $('<i class="fa fa-child fa-stack-1x inverse"></i>');
      label = $('<span>Children</span>');
      break;
    case "Other":
      outerSpan = $('<span class="fa-stack fa-2x ld-other"></span>');
      icon = $('<i class="fa fa-star fa-stack-1x inverse"></i>');
      label = $('<span>Other</span>');
      break;
    default:
      outerSpan = $('<span class="fa-stack fa-2x ld-other"></span>');
      icon = $('<i class="fa fa-star fa-stack-1x inverse"></i>');
      label = $('<span>' + name + '</span>');
      break;
  }
  outerSpan.append(backCircle).append(icon);
  outerDiv.append(outerSpan)
  if (includeLabel) outerDiv.append(label);
  return outerDiv;
}

function constructEditButton(){
  const buttonDiv = $('<div class="action-icon edit-button js-hoverable"><div></div></div>');
  return buttonDiv;
}

function constructDeleteButton() {
  const buttonDiv = $('<div class="action-icon delete-button js-hoverable"><div></div></div>');
  return buttonDiv;
}

function constructAddButton() {
  const buttonDiv = $('<div class="action-icon add-button js-hoverable"><div></div></div>');
  return buttonDiv;
}

/* constructTag: Takes tagName: string */
function constructTag(tagName) {
  const tagDiv = $('<div class="milestone-tag no-select js-hoverable"></div>');
  tagDiv.html(tagName);
  return tagDiv;
}

/* ConstructTabButton: Takes tab: { name : string, tabClass : string, iconName : string }
 *                     and clickHandler: () => void;
 */
function constructTabButton({ name, tabClass, iconName }) {
  const wrapper = $('<div class="tab-button ' + tabClass + '"></div>');
  const icon = $('<i class="fa ' + iconName + '"></i>');
  const label = $('<span>' + name + '</span>');
  wrapper.append(icon).append(label);
  return wrapper;
}

function constructInspirationalImage(){
  const url = 'https://www.uschamber.com/co/uploads/images/_w622h415/inspiration.jpg';
  const imgDiv = $('<div style="background-image:url(\'' + url + '\');background-size: auto; background-repeat: no-repeat; background-position: 72% 60%; height:300px; width:300px;"></div>');
  return imgDiv;
}

function constructTimeInput(){
  const timeInput = $('<input type="time" style="margin: 2px;">');
  timeInput.val('22:00');
  return timeInput;
}

function constructWeekSelector(){
  const weekDiv = $('<div class="week-selector"></div>');
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const classes = ['sunday', 'monday', 'tueday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < 7; i++){
    const dayDiv = $('<div class="day-of-the-week day-' + classes[i] + '">' + labels[i] + '</div>');

    dayDiv.on('click', ()=>{
      dayDiv.toggleClass('selected');
    })

    weekDiv.append(dayDiv);
  }

  return weekDiv;
}

export {constructCategoryIcon, constructEditButton, constructDeleteButton, constructAddButton,
  constructTag, constructTabButton, constructInspirationalImage, constructTimeInput, constructWeekSelector }