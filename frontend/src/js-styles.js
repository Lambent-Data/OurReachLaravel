/* Method for detecting nodes inserted into the DOM. Adapted from John Clegg:
 * https://stackoverflow.com/questions/10415400/jquery-detecting-div-of-certain-class-has-been-added-to-dom
 */
function onElementInserted(containerSelector, elementSelector, callback) {
  var onMutationsObserved = function(mutations) {
      mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
              var elements = $(mutation.addedNodes).find(elementSelector);
              for (var i = 0, len = elements.length; i < len; i++) {
                  callback(elements[i]);
              }
          }
      });
  };

  var target = $(containerSelector)[0];
  var config = { childList: true, subtree: true };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(onMutationsObserved);    
  observer.observe(target, config);
}





/* Homebrew jQuery solution for hover events, for consistent mobile & desktop experience */
$(document).on('mouseenter', '.js-hoverable',
    function(){
      $(this).addClass('js-hover');
      $(this).trigger('starthover');
  });
$(document).on('mouseleave','.js-hoverable',
    function(){
      $(this).removeClass('js-hover');
      $(this).trigger('endhover');
    });

/* Homebrew jQuery solution for activate events, for consistent mobile & desktop experience */
$(document).on('mousedown mouseenter', '.js-activable',
  function (e) {
    // if left mouse is down, make active
    if (e.buttons % 2){
      $(this).addClass('js-active');
      $(this).trigger('startactive');
    }
  });
$(document).on('mouseleave mouseup', '.js-activable',
  function () {
    $(this).removeClass('js-active');
    $(this).trigger('endactive');
  });


/* Homebrew solution for fitting text to limited width by setting font-size.
 * I could use a community solution also.
 */
const hiddenFittingDiv = $('<div style="position:fixed; left: 0; top: 200vh; width: 10000px;"></div>');
const nestedFittingDiv = $('<div style="width:fit-content;"></div>');
const fittingSpan = $('<span></span>');

nestedFittingDiv.append(fittingSpan);
hiddenFittingDiv.append(nestedFittingDiv);
$('body').prepend(hiddenFittingDiv);

function fitTextByWidth(){
  const span = $(this);
  const div = $(this).parent();

  const minFontSize = span.attr("minfontsize") ? span.attr("minfontsize") : 8;
  const maxFontSize = span.attr("maxfontsize") ? span.attr("maxfontsize") : 50;

  fittingSpan.css('font-size', maxFontSize+'px');
  fittingSpan.html(span.html());
  
  const fittingWidth = nestedFittingDiv.width();
  const spanWidth = div.width();
  
  span.css('font-size', 'max(' + minFontSize + 'px, min(' + maxFontSize + 'px, ' + spanWidth/fittingWidth*parseInt(maxFontSize) + 'px))');
}
// Extend fitTextByWidth to a jquery function
(function( $ ){
  $.fn.fitTextByWidth = function() {
     this.each(fitTextByWidth);
     return this;
  }; 
})( jQuery );

$(window).on("resize", ()=> {
  $('div.js-fit-text > span').fitTextByWidth();
});

$(document).ready(() => {
  $('div.js-fit-text > span').fitTextByWidth();
});

onElementInserted('body', 'div.js-fit-text > span', (sp) => $(sp).fitTextByWidth());


/* Solution for pasting only plain text into contenteditable divs.
 * Adapted from Jamie Barker at
 * https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand
 * This solves problems that happen when you try to paste rich text into the journal textboxes.
 */

//const hiddenTextArea = $('<textarea style="position:fixed; left: 0; top: 200vh; width: 400px;"></textarea>');

$(document).on('paste', 'div[contenteditable]', function(e) {
  e.preventDefault();
  let text = '';
  if (e.clipboardData || e.originalEvent.clipboardData) {
    text = (e.originalEvent || e).clipboardData.getData('text/plain');
  } else if (window.clipboardData) {
    text = window.clipboardData.getData('Text');
  }
  //hiddenTextArea.innerHTML = text;
  //text = hiddenTestArea.innerHTML;
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    document.execCommand('paste', false, text);
  }
});