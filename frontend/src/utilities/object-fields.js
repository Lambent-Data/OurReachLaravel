import { DateTime } from "luxon";
import { Day, MeasureType, RepeatType } from "./enums";
import { describeDatetimeAbsolute, timeOfDayFromSeconds } from "./time";

/*
  *     measures: { // An object defining the measure type and options associated with the milestone.
  *                type: // Either "dropdown", "freeform", or "none". Anything else defaults to "none".
  *        // If type is not "none", also include the following two:
  *                startLabel: // The prompt on the form offered for the starting measure field, e.g. "Where are you now on this milestone?"
  *                endLabel: // The prompt on the form offered for the ending measure field, e.g. "Where do you want to be when this milestone is done?"
  *                          // Try to keep these pretty short.
  *         // If type = "freeform", include these three:
  *                unit: // Optional: A string for the unit of the measure, e.g. "lb", "%", "mmHg"
  *                placeholderStartValue: // The greyed-out placeholder text in the input textbox for the starting measure,
  *                                       // before anything is written by the user, e.g. "Current status",
  *                placeholderEndValue: // The same for the ending measure, e.g. "End Status"
  *         // If type = "dropdown", include these four instead:
  *                startOptions: // Array of strings defining the options for the starting measure dropdown
  *                endOptions: // Array of strings defining the options for the ending measure dropdown.
  *                            // NOTE! If these are the same as the start options, they can be omitted.
  *                defaultStart: // A string for the default value in the starting measure dropdown. If it is present in startOptions, then that one will be autoselected.
  *                              // Otherwise, it will act like a placeholder, e.g. "Choose an option", and won't be selectable
  *                defaultEnd: // The analogous field for the ending options
  *               }
  */


export class MeasureMetadata {
  constructor(type= MeasureType.FREEFORM, startLabel, endLabel, startOptions, endOptions, defaultStart, defaultEnd, placeholderStartValue, placeholderEndValue, unit) {
    this.type = type;
    switch (this.type) {
      case MeasureType.DROPDOWN:
        this.startOptions = startOptions;
        this.endOptions = endOptions;
        this.defaultStart = defaultStart;
        this.defaultEnd = defaultEnd;

        this.placeholderStartValue = defaultStart ?? "Current status";
        this.placeholderEndValue = defaultEnd ?? "Current status";

        if (this.startOptions && !this.endOptions) {
          // If start options are not given but end options are, default to end options
          this.endOptions = this.startOptions;
        }
        if (this.startOptions && this.endOptions)
          break;
      case MeasureType.FREEFORM:
        this.unit = unit ?? "";
        this.placeholderStartValue = placeholderStartValue ?? "Current status";
        this.placeholderEndValue = placeholderEndValue ?? "End status";
        break;
      case MeasureType.NONE:
      default:
        this.type = MeasureType.NONE;
      // No measures, do nothing
    }
    this.startLabel = startLabel ?? "Where are you now on this milestone?";
    this.endLabel = endLabel ?? "Where do you want to be?";
  }


  // Takes data in database JSON format
  static fromJSON(data_in_json) {
    const data = JSON.parse(data_in_json);
    return new MeasureMetadata(data.type, data.startLabel, data.endLabel, data.startOptions, data.endOptions,
      data.defaultStart, data.defaultEnd, data.placeholderStartValue, data.placeholderEndValue, data.unit)
  }

  toJSON(){
    const out = {type: this.type};
    if (this.startLabel) out.startLabel = this.startLabel;
    if (this.endLabel) out.endLabel = this.endLabel;
    switch (this.type) {
      case MeasureType.DROPDOWN:
        if (this.startOptions){
          out.startOptions = this.startOptions;
          out.endOptions = this.endOptions;
        }
        if (this.defaultStart) out.defaultStart = this.defaultStart;
        if (this.defaultEnd) out.defaultEnd = this.defaultEnd;
        break;
      case MeasureType.FREEFORM:
        if (this.unit) out.unit = this.unit;
        if (this.placeholderStartValue) out.placeholderStartValue = this.placeholderStartValue;
        if (this.placeholderEndValue) out.placeholderEndValue = this.placeholderEndValue;
        break;
    }
    return JSON.stringify(out);
  }
}

/*
 * type: // "one-time", "daily", "weekly", "monthly", or "yearly". See goalBasis.
 *           // Then there are different options depending on type.
 *           // MOST OF THESE DO NOT NEED TO BE FILLED IN JUST NOW. Stick with name and type, unless you really want to fill out more.
 *           // If type = "one-time":
 * deadline: // Presumably, no need to set a default deadline, so skip this field.
 *           // If type = "daily":
 * frequency: // Positive integer number of days between repetitions. E.g. 1 would repeat every day, 2 every other day, etc.
 * times: // A non-empty array of times of day, expressed in seconds since midnight, e.g. 12:00 noon would be 12*60*60.
 *           // If type = "weekly":
 * days: { // An object mapping days to arrays of times, just as above. The days of the week are listed in the days variable. It's fine to omit days entirely.
 * mon : [13 * 60 * 60, 18 * 60 * 60], // An example
 * tue : [], // No times listed on Tuesday, same as not including Tuesday at all
 * fri : [16 * 60 * 60],
 *               }
 *           // If type = "monthly":
 * monthly : // An array of numbers between 1 and 31, identifying days of the month (we'll expand this later). E.g. [1, 5, 10] for the first, fifth, and tenth of each month.
 *             }
 */

function listOffArray(arrayOfStrings){
  if (arrayOfStrings.length == 0){
    return "";
  }
  if (arrayOfStrings.length == 1) {
    return arrayOfStrings[0];
  }
  if (arrayOfStrings.length == 2) {
    return arrayOfStrings[0] + " and " + arrayOfStrings[1];
  }
  let out = "";
  for (let i = 0; i < arrayOfStrings.length-1; i++){
    out += arrayOfStrings[i] + ", ";
  }
  out += "and " + arrayOfStrings[arrayOfStrings.length - 1];
  return out;
}


export class RepeatRule {
  constructor(type, startingOn, frequency, times, daysOfWeek=[], daysOfMonth=[], timezone=undefined) {
    this.type = type;
    this.startingOn = startingOn ?? DateTime.now();
    this.frequency = frequency;
    this.times = times;
    this.daysOfWeek = daysOfWeek;
    this.daysOfMonth = daysOfMonth;
    this.timezone = timezone ?? DateTime.now().zoneName;
  }

  get daysOfWeekFullNames(){
    return this.daysOfWeek.map(day => Day[day]);
  }

  static fromJSON(data_in_json){
    const data = JSON.parse(data_in_json);
    return new RepeatRule(data.type, DateTime.fromSQL(data.startingOn), data.frequency, data.times, data.daysOfWeek, data.daysOfMonth, data.timezone);
  }

  toJSON(){
    return JSON.stringify({ type: this.type,
                            startingOn: this.startingOn.toSQL(),
                            frequency: this.frequency,
                            times: this.times,
                            daysOfWeek: this.daysOfWeek,
                            daysOfMonth: this.daysOfMonth,
                            timezone: this.timezone });
  }

  toString(){
    // needs work!
    if (this.type == RepeatType.ONE_TIME){
      return "By " + this.startingOn.toFormat('LLLL dd, yyyy') + " at " + timeOfDayFromSeconds(this.times[0], true);
    }

    let out = "";
    if (this.frequency > 1) {
      out += "Every " + this.frequency + " ";
      switch (this.type) {
        case RepeatType.DAILY:
          out += "days by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.WEEKLY:
          out += "weeks on " + listOffArray(this.daysOfWeekFullNames) + " by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.MONTHLY:
          out += "months on days " + listOffArray(this.daysOfMonth) + " by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.YEARLY:
          out += "years";
          break;
      }
    }else{
      switch (this.type) {
        case RepeatType.DAILY:
          out = "Every day by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.WEEKLY:
          out = "Every week on " + listOffArray(this.daysOfWeekFullNames) + " by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.MONTHLY:
          out = "Every month on days " + listOffArray(this.daysOfMonth) + " by " + timeOfDayFromSeconds(this.times[0], true);
          break;
        case RepeatType.YEARLY:
          out = "Every year";
          break;
      }
    }
    return out;
  }
}