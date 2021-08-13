import { DateTime } from "luxon";

export function DateTimeToDatabaseFormat(dt){
  return dt.toUTC().toSQL({ includeOffset: false });
}

export function DateTimeFromDatabaseFormat(dt_str){
  return DateTime.fromSQL(dt_str, {zone:'UTC'}).toLocal();
}

export function DateTimeFromISO(dt_str) {
  return DateTime.fromISO(dt_str, { zone: 'UTC' }).toLocal();
}

export function timeOfDayFromSeconds(secondsSinceMidnight, humanReadable=false) {
  let hr = Math.floor(secondsSinceMidnight / 3600).toString().padStart(2, '0');
  let min = Math.floor((secondsSinceMidnight % 3600) / 60).toString().padStart(2, '0');

  if (humanReadable) {
    hr = parseInt(hr);
    if (hr > 12){
      return (hr-12) + ":" + min + " PM";
    }else if (hr == 12){
      return "12:" + min + " PM";
    }else if (hr == 0){
      return "12:" + min + " AM";
    }else{
      return hr + ":" + min + " AM";
    }
  }else{
    return hr + ":" + min;
  }
}

export function timeOfDayToSeconds(timeString, defaultValue = -1) {
  const t = timeString.split(":");
  try {
    const secs = parseInt(t[0]) * 3600 + parseInt(t[1]) * 60;
    return secs;
  } catch (e) {
    return defaultValue;
  }
}

export function formatTimesOfDay(times) {
  times = times.map((t) => t % (24 * 60 * 60));
  times.sort((a, b) => a - b);
  const formatted = [];
  for (const time of times) {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % (60 * 60)) / 60);
    const ampm = time % (24 * 60 * 60) >= 12 * 60 * 60 ? "PM" : "AM";
    formatted.push((((hour - 1) % 12) + 1) + ":" + ("0" + minute).slice(-2) + " " + ampm);
  }

  if (formatted.length == 1) {
    return formatted[0];
  }
  if (formatted.length == 2) {
    return formatted[0] + " and " + formatted[1];
  }
  return formatted.slice(0, -1).join(", ") + ", and " + formatted[formatted.length - 1];
}

export function describeDatetimeAbsolute(dt) {
  return describeTimestampAbsolute(dt.toSeconds());
}

export function describeTimestampAbsolute(unixTimestamp) {
  const now = Date.now() / 1000; //Divide by 1000 to convert from ms to s

  const date = new Date(unixTimestamp * 1000);


  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const day = date.toLocaleDateString(undefined, options);
    const time = date.toLocaleTimeString('en-US', { hour: "numeric", minute: "2-digit" });
    return day + " at " + time;
  } catch (e) {
    console.log(e);
    return "...";
  }
}

export function describeDatetimeRelative(dt) {
  return describeTimestampRelative(dt.toSeconds());
}

export function describeTimestampRelative(unixTimestamp) {
  let description;
  const now = Date.now() / 1000; //Divide by 1000 to convert from ms to s

  const minutesDifference = Math.floor((unixTimestamp - now)/60);

  let mostRecentMidnight = new Date();
  mostRecentMidnight.setHours(0, 0, 0, 0);

  let midnightBeforeTimestamp = new Date(unixTimestamp * 1000);
  midnightBeforeTimestamp.setHours(0, 0, 0, 0);

  const daysDifference = Math.round((midnightBeforeTimestamp - mostRecentMidnight) / 1000 / 3600 / 24);
  const timeOfDayInSeconds = unixTimestamp - midnightBeforeTimestamp/1000;

  if (Math.abs(daysDifference) >= 7) {
    // More than a week ahead or behind
    // Format the date in an absolute way
    const date = new Date(unixTimestamp * 1000);

    let options;
    if (daysDifference < 0 || daysDifference >= 180) {
      // More than six months ahead, or in the past. Show the year.
      options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    } else {
      // Less than six months ahead
      options = { weekday: 'long', month: 'short', day: 'numeric' };
    }
    return date.toLocaleDateString(undefined, options);
  }

  if (Math.abs(minutesDifference) < 90){
    // clsoe enough to express in minutes
    if (minutesDifference == 0){
      return "now";
    }
    if (minutesDifference == 1) {
      return "in 1 minute";
    }
    if (minutesDifference == -1) {
      return "1 minute ago";
    }
    if (minutesDifference > 0) {
      return "in " + minutesDifference +  " minutes";
    }
    if (minutesDifference < 0) {
      return -minutesDifference + " minutes ago";
    }
  }

  //Otherwise format date in relative terms

  let dayString;

  switch (daysDifference){
    case -1:
      dayString = "yesterday";
      break;
    case 0:
      dayString = "today";
      break;
    case 1:
      dayString = "tomorrow";
      break;
    default:
      if (daysDifference > 0){
        dayString = "in " + daysDifference + " days";
      }else{
        dayString = -daysDifference + " days ago";
      }
      break;
  }
  return dayString + " at " + timeOfDayFromSeconds(timeOfDayInSeconds, true);
}
