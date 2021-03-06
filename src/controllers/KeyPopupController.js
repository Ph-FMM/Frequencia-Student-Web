export function timeNow() {
  var date = new Date().toUTCString();

  date = updateTime(date.split(" ")[4]);

  var time_now = date.substring(0, 2) + "h" + date.substring(3, 5) + "min";
  return time_now;
}

export function updateTime(date) {
  var hour = parseInt(date.substring(0, 2));

  hour -= 4;

  if (hour < 10 && hour >= 0) hour = "0" + hour.toString();
  else if (hour < 0) hour = 24 + hour;
  else hour = hour.toString();

  hour += date.substring(2, date.length);

  return hour;
}

export function compareTime(event, is_check) {
  var response = [false, null, ""];

  if (is_check) {
    if (event.keys.key1.time === timeNow()) {
      response = [true, event, "1"];
    } else if (event.keys.key2.time === timeNow()) {
      response = [true, event, "2"];
    } else if (event.keys.key3.time === timeNow()) {
      response = [true, event, "3"];
    }
  }

  return response;
}

export function areKeysInEvent(event) {
  if (
    event.keys.key1 !== "" ||
    event.keys.key2 !== "" ||
    event.keys.key3 !== ""
  )
    return true;

  return false;
}

export function compareBetweenEvents(event1, event2) {
  var hourEvent1 = parseInt(event1.substring(0, 2));
  var minutesEvent1 = parseInt(event1.substring(3, 5));

  var hourEvent2 = parseInt(event2.substring(0, 2));
  var minutesEvent2 = parseInt(event2.substring(3, 5));

  return (hourEvent2 - hourEvent1) * 60 + (minutesEvent2 - minutesEvent1);
}

export function nextEvent(events) {
  var next_event = null;
  var next_event_index = 0;
  var current_index = 0;
  var check = [];
  var is_check = true;

  events.forEach((event) => {
    var dif = compareBetweenEvents(event.begin, timeNow());
    var current_check = false;

    if (dif <= compareBetweenEvents(event.begin, event.end)) {
      if (next_event !== null) {
        dif = compareBetweenEvents(event.begin, next_event.begin);
        if (dif > 0) {
          next_event = event;
          next_event_index = current_index;
        }
      } else {
        next_event = event;
        next_event_index = current_index;
      }
      if (dif >= -10) current_check = true;
    }
    current_index++;
    check.push(current_check);
  });

  if (next_event) {
    if (!next_event.checkin || !next_event.checkout) {
      for (current_index = 0; current_index < check.length; current_index++) {
        if (current_index !== next_event_index) check[current_index] = false;
      }
    }
    if (!next_event.checkin) is_check = false;
    if (next_event.checkin && next_event.checkout) is_check = false;
  }

  return [next_event, check, is_check];
}

export function popupText(event) {
  var subject = event.subject;
  var description = event.description;

  if (description.length > 12) {
    description = description.substring(0, 12) + "...";
  }

  var message = subject + ": " + description;

  return message;
}

export function compareKeys(event, key_input, key_number) {
  if (key_number === "1") {
    if (event.event.keys.key1.key.toLowerCase() === key_input.toLowerCase())
      return true;
  } else if (key_number === "2") {
    if (event.event.keys.key2.key.toLowerCase() === key_input.toLowerCase())
      return true;
  } else if (key_number === "3") {
    if (event.event.keys.key3.key.toLowerCase() === key_input.toLowerCase())
      return true;
  }
  return false;
}

export function createMessageRequest(event, student_uid, key_number) {
  var data = {};

  if (key_number === "1") {
    data = {
      key1: "ok",
    };
  } else if (key_number === "2") {
    data = {
      key2: "ok",
    };
  } else if (key_number === "3") {
    data = {
      key3: "ok",
    };
  }
  // console.log(event, student_uid);

  var messageRequest = `frequency/${event.key}/${student_uid}/keys`;

  return [messageRequest, data];
}
