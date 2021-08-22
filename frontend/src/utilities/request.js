import User from "../classes/data-sources/User";
import { Pages } from "./enums";
import { DateTime } from "luxon";
import { DateTimeToDatabaseFormat } from "./time";
import { secure, subdomain, runningLocal, endpoint, ruko_endpoint } from '../env'

async function makeRequest(req) {
  // Only allow objects to be sent as data, not plain strings, ints, etc.
  if (!(req.data instanceof Object)){
    if (req !== undefined){
      console.error("req.data not an object! req = " + req);
    }
    req.data = {};
  }
  req.data = {...req.data}; // Copy the data, so as not to overwrite any other uses for the input variable

  // If data is being sent, double-check that all DateTimes are converted to database versions
  for (const field in req.data){
    if (req.data[field] instanceof DateTime){
      req.data[field] = DateTimeToDatabaseFormat(req.data[field]);
    }
  }

  // Add the endpoint if not already present
  if (!req.url.startsWith(endpoint)){
    req.url = endpoint + req.url;
  }

  // Now there are two options. The secure way to make an api request is to post it to subdomain.ourreachld.com/ourreach/index.php?module=ldbackend/
  // Then ruko will verify the user, attach the user id, and send the real request to the backend.
  if (secure){
    //console.log("SECURE", $.ajax({ url: ruko_endpoint, type: 'POST', data: req}));
    const p = new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = ({ data }) => {
        channel.port1.close();
        console.log("EVENT", data);
        if (data.response) {
          resolve(data.response);
        }else{
          reject(data);
        }
      };
      window.parent.postMessage({request: {url: ruko_endpoint, type: "POST", data: req}}, 'https://ourreachld.com', [channel.port2]);
    });
    return p;
  }else{
    // The insecure way is to just attach the ruko user and send it. The real backend will reject any request that is not from a subdomain, so this will fail.
    // For a development server, it will work.
    req.data.ruko_user = User.currentUserId;
    return $.ajax(req);
  }
}

function isValidURL(string) {
  // https://stackoverflow.com/a/49849482/6525081
  var res = string.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

function formatUrl(path){
  if (subdomain && path.includes('ourreach/index.php')){
    path = 'https://' + subdomain + '.ourreachld.com/ourreach/' + path.split('ourreach/')[1];
  }

  if (!path.startsWith('http')) {
    return 'http://' + path;
  }
  return path;
}

function redirect(path) {
  if (path instanceof Object){
    switch (path.page){
      case Pages.NOT_FOUND:
      case Pages.DASHBOARD:
        path = runningLocal ? endpoint + 'dashboard?ruko_user=' + User.currentUserId
                            : 'ourreach/index.php?module=dashboard/';
        break;
      case Pages.LISTING: 
        path = runningLocal ? endpoint + 'milestones?ruko_user=' + User.currentUserId
                            : 'ourreach/index.php?module=items/items&path=83';
        break;
      case Pages.VIEW_MILESTONE:
        path = runningLocal ? endpoint + 'ruko/milestone/' + path.ruko_id +'?ruko_user='+User.currentUserId
                            : 'ourreach/index.php?module=items/info&path=83-' + path.ruko_id;
        break;
      default:
        console.error("Bad input to redirect function: " + path);
        return;
    }
  }

  path = formatUrl(path);
  if (!runningLocal){
    window.parent.postMessage({ url: path }, 'https://' + subdomain + '.ourreachld.com');
  }else{
    location = path;
  }
}

export { makeRequest, redirect }