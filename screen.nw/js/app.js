var debug = false;
var scr = {
  imageDir: 'images/', // will be prepend to all images
  random: true,
  backstretch: { // see here for available options -> https://github.com/srobbin/jquery-backstretch#options
    duration: 3000, 
    fade: 750
  }
};

var imageArray;
var mouseDelta = {};
var playing = true;

// Trying to get images vom scr.imageDir with nodejs
// if it fails some, default images are used. For example when not used in node-webkit
try{ 
  // try using nodejs from node-webkit
  var fs = require('fs');
  imageArray = fs.readdirSync("./"+scr.imageDir);
  console.log("Readdir", imageArray);
  imageArray = imageArray.filter(function(el){ 
    // filter only images
    return checkExtension(el, 'jpg,png,gif');
  });
  console.log("Readdir filtered", imageArray);
}catch(e) { 
  //fallback for use in other browsers than node-webkit and
  console.log("Readdir Fallback", e);
  imageArray = [
    "demo1.jpg"
    ,"demo4.jpg"
  ];
}

scr.images = imageArray;
  
jQuery(function($){  
  // Prepend imageDir Path
  for (var i = 0, l = scr.images.length; i < l; i++) {
    scr.images[i] = scr.imageDir + scr.images[i];
  };
  
  // Randomize images (if scr.random is true)
  if(scr.random) {
    scr.images = shuffle(scr.images);
  }
  
  // Set Event Listeners for "exit on input"
  setEvents();

  // event after image has loaded
  $(window).on("backstretch.after", function (e, instance, index) {
    console.log("Backstretch.after", index,scr.images);
    window.focus();
    // Randomize images after loading last image (if scr.random is true)
    if(index === instance.images.length - 1 && scr.random) {
      scr.images = shuffle(scr.images);
    }
    //
  });
  
  // Start Backstretch Slideshow
  $.backstretch(scr.images, scr.backstretch);
});  // :jQuery

// Functions

function setEvents() {
  $(window).mousemove(function(e) {  
    if(!mouseDelta.x) {
      mouseDelta.x = e.pageX;
      mouseDelta.y = e.pageY;
      return false;
    }  
    
    deltax = Math.abs(e.pageX - mouseDelta.x);
    deltay = Math.abs(e.pageY - mouseDelta.y);  
    if(deltax > 20 || deltay > 20){
      endScreensaver(e);
    }
  });

  $(window).on("mousedown keydown", function(e){
    console.log("Event: mousedown||keydown", e);
    if(e.keyCode == 37) { // Prev     
      console.log("Backstretch", "Prev");
      $.backstretch("prev");
      return false;
    }else if(e.keyCode == 39) { // Next
      console.log("Backstretch", "Next");
      $.backstretch("next");
      return false;
    }else if(e.keyCode == 32) { // Play/Pause
      if(playing){
        console.log("Backstretch", "Pause");
        $.backstretch("pause");
        $('#statusPause').removeClass('hide');
        playing = false;
      }else{
        console.log("Backstretch", "Next");
        $.backstretch("next");
        $('#statusPause').addClass('hide');
        playing = true;
      }      
      return false;
    }
    if(!debug){
      e.preventDefault();    
    }
    endScreensaver(e);   
  });
}

function endScreensaver(e) {
  console.log("endScreensaver", e);
  if(!debug){ // don't close on debug-mode
    window.close(); // Firefox need about:config dom.allow_scripts_to_close_windows
  }
}

function shuffle(o){ // http://stackoverflow.com/a/6274381
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function checkExtension(str, ext) {
 extArray = ext.split(',');

 for(i=0; i < extArray.length; i++) {
  if(str.toLowerCase().split('.').pop() == extArray[i]) {
    return true;
  }
 }
 return false;
};