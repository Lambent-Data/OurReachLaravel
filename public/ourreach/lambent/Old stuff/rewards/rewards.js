function createSpriteDiv(sprite_data, callback){
  let wrapper_div = $(document.createElement("div"));
  wrapper_div.css({
    "position": "absolute",
    "pointer-events": "none", // This keeps the animation from preventing mouse events on elements behind the animation
  })


  let sprite = $(document.createElement("div")); 

  // Basic css to prepare for animation
  sprite.css({"width": sprite_data.width+"px",
              "height": sprite_data.height+"px",
              "background-image": "url("+sprite_data.sheet+")",
              "position": "relative",
              "left": "-" + (sprite_data.width/2) + "px",
              "top": "-" + (sprite_data.height/2) + "px",
              "background-repeat" : "no-repeat",
              "background-position": "0px "+sprite_data.height,
            });

  // Add custom css for specific sprite
  if (sprite_data.custom_css) sprite.css(sprite_data.custom_css);

  let frames;
  if (sprite_data.frames){
    frames = sprite_data.frames;
  }else{
    const reps = sprite_data.repetitions ? sprite_data.repetitions : 1;
    const startingFrame = sprite_data.startingFrame ? sprite_data.startingFrame : 0;
    frames = [];
    for (let i = 0; i < sprite_data.numFrames*reps; i++) frames.push((startingFrame + i)%sprite_data.numFrames);
  }

  sprite.animateSprite({
    fps: sprite_data.fps,
    animations: {
        frames: frames
    },
    loop: sprite_data.loop ? true : false,
    complete: function(){
        // use complete only when you set animations with 'loop: false'
        sprite.remove();
        wrapper_div.remove();
        callback();
    }
  });

  wrapper_div.append(sprite);
  return wrapper_div;
}

// Define all sprite objects that can be used:
sprite_objects = {
/*   scott : {sheet : "spritesheet.png",
            width: 108,
            height: 140,
            frames:[0, 1, 2, 3, 4, 5, 6, 7],
            fps: 12,
            loop : true,
           },
    smiley : {sheet : "smiley.png",
              width: 198,
              height: 200,
              numFrames: 30,
              repetitions : 1.6,
              fps: 20,
             },
    popper : {sheet : "party-popper.png",
              width: 400,
              height: 400,
              startingFrame : 30,
              numFrames: 60,
              fps: 30
             },*/
    confetti1 : {sheet : "lambent/rewards/confetti1.png", // Author on lottie: Musa Baysan
                width: 320,
                height: 320,
                numFrames: 23,
                fps: 12
               },
    confetti2 : {sheet : "lambent/rewards/confetti2.png", // Author on lottie: sportbank
                width: 640,
                height: 640,
                numFrames: 63,
                fps: 24
               },
    checkmark : {sheet : "lambent/rewards/check.png", // AUTHOR on lottie: sergey designer
              width: 160,
              height: 160,
              numFrames: 65,
              fps: 24,
             },
                           /*custom_css: {"transform": "scale(0.5, 0.5)"},*/

  }


// Preload all spritesheets used in sprite_objects
let image_urls = new Set();
for(const sprite_name in sprite_objects){
  image_urls.add(sprite_objects[sprite_name].sheet);
}
for(const image_url in image_urls){
  var preloadLink = document.createElement("link");
  preloadLink.href = image_url;
  preloadLink.rel = "preload";
  preloadLink.as = "image";
  document.head.appendChild(preloadLink);
}

/*
let popper = createSpriteDiv(sprite_objects.popper, callback=function(){});
$(document.body).append(popper);
popper.css({
  "left": "120px",
  "top": "100px",
});

let sprite = createSpriteDiv(sprite_objects.scott, callback=function(){});
$(document.body).append(sprite);
sprite.css({
  "left": "600px",
  "top": "300px",
});

let smiley = createSpriteDiv(sprite_objects.smiley, callback=function(){});
$(document.body).append(smiley);
smiley.css({
  "left": "50px",
  "top": "200px",
});
*/


/*

let checkmark = createSpriteDiv(sprite_objects.checkmark, callback=function(){});
$(document.body).append(checkmark);
checkmark.css({
  "left": "0px",
  "top": "0px",

});


let confetti2 = createSpriteDiv(sprite_objects.confetti2, callback=function(){});
$(document.body).append(confetti2);
confetti2.css({
  "left": "170px",
  "top": "350px",
});

let confetti1 = createSpriteDiv(sprite_objects.confetti1, callback=function(){});
$(document.body).append(confetti1);
confetti1.css({
  "left": "70px",
  "top": "300px",
});
*/
/*
function randomProperty(obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};


const btn_elem = document.getElementById("btn");
let old_handler = $("#btn").
$("#btn").click(function(){
  let sprite = createSpriteDiv(randomProperty(sprite_objects), callback=function(){});
  $(document.body).append(sprite);
  const pos = $(this).offset;
  sprite.css({
    "left": (pos.left + $(this).width/2) + "px",
    "top": (pos.top + $(this).height/2) + "px",
  });
});
*/
function reward_element(elem, anim, callback){
  if (elem.hasClass("has-"+anim)) { 
    // Already animating on this element - do nothing
    return false;
  }
  // Add a class name to record that there is an attached animation
  elem.addClass("has-"+anim);
  let sprite = createSpriteDiv(sprite_objects[anim], function(){ elem.removeClass("has-"+anim); callback(); });
  $(document.body).append(sprite);
  const pos = elem.offset();
  //console.log(pos.left + "      " + pos.top);
  //console.log(elem.height() + "      " + elem.width());
  sprite.css({
    "left": (pos.left + elem.width()/2) + "px",
    "top": (pos.top + elem.height()/2) + "px",
  });
  return true;
}