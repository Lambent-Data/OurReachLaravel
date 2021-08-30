// js to be applied to all pages based on index.php
// (which I believe is all pages on ruko)

// console.log("all-pages.js"); // For debugging script load order

// Add apple-touch-icon: This changes the icon on the homescreen of phones
var touch_title_id = "touch-icon";
if($("#" + touch_title_id).length == 0){
  $("head").prepend('<link id="' + touch_title_id + '" rel="apple-touch-icon" href="lambent/touch-icon.png">');
}


OneSignal.push(function() {
  OneSignal.setExternalUserId(externalUserId);
});