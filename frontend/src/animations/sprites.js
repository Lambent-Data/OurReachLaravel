import './animate-sprite-edited.js'

function createSpriteDiv(wrapperDiv, spriteData, callback){
  if (!wrapperDiv){
    wrapperDiv = $('<div></div>'); 
  }
  wrapperDiv.css({
    "position": "absolute",
    "pointer-events": "none", // This keeps the animation from preventing mouse events on elements behind the animation
  })


  let sprite = $('<div></div>'); 

  // Basic css to prepare for animation
  sprite.css({"width": spriteData.width+"px",
              "height": spriteData.height+"px",
              "background-image": "url("+spriteData.sheet+")",
              "position": "relative",
              "left": "-" + (spriteData.width/2) + "px",
              "top": "-" + (spriteData.height/2) + "px",
              "background-repeat" : "no-repeat",
              "background-position": "0px "+spriteData.height,
            });

  // Add custom css for specific sprite
  if (spriteData.custom_css) sprite.css(spriteData.custom_css);

  let frames;
  if (spriteData.frames){
    frames = spriteData.frames;
  }else{
    const reps = spriteData.repetitions ? spriteData.repetitions : 1;
    const startingFrame = spriteData.startingFrame ? spriteData.startingFrame : 0;
    frames = [];
    for (let i = 0; i < spriteData.numFrames*reps; i++) frames.push((startingFrame + i)%spriteData.numFrames);
  }

  sprite.animateSprite({
    fps: spriteData.fps,
    animations: {
        frames: frames
    },
    loop: spriteData.loop ? true : false,
    complete: function(){
        // use complete only when you set animations with 'loop: false'
        sprite.remove();
        wrapperDiv.remove();
        callback();
    }
  });

  wrapperDiv.append(sprite);
  return wrapperDiv;
}

export { createSpriteDiv }