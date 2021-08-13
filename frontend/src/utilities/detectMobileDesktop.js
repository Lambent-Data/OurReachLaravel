/* Determine whether we are on a phone. For now, just going by screen size, later will do something better. */
function isMobile() {
  return $(window).width() <= 640;
}
let mobileView = undefined;





const executeOnMobile = [];
const executeOnDesktop = [];

function onMobileView(handler) {
  executeOnMobile.push(handler);
}

function onDesktopView(handler) {
  executeOnDesktop.push(handler);
}


/* Called to transition between mobile and desktob view */
function setMobileOrDesktopView() {
  if (mobileView === isMobile()) return; // Nothing has changed. Do nothing.

  // Else, set mobileView correctly.
  mobileView = isMobile();
  if(mobileView){
    executeOnMobile.forEach(handler => handler());
  }else{
    executeOnDesktop.forEach(handler => handler());
  }
}

$(document).ready(function () {
  setMobileOrDesktopView();
});

$(window).resize(function () {
  setMobileOrDesktopView();
});

export { isMobile, onMobileView, onDesktopView }