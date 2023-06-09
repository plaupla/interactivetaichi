//Task: Run two posenet, one with trainer video, one with webcam side by side. 


//current problem: should have run posenet once and saved each in different var? ReferenceError: posesWeb is not defined. resolved 7/5/23

//next error :ReferenceError: skeleton is not defined at /sketch.js:169:19. resolved. but the skeleton is off.

//webcam run but overlapped. sort of resolved atm but still warped.

//next step. calculate similarity for both keypoints.
//cosine sim function implemented, but 8/5.23 no error and no result. result is no where to find?

   
//////////////Canvas and posenet///////////////////////////

//buffer to divide canvas left and right
var leftBuffer;
var rightBuffer;

//setup posenet 
let poseNet;
let poses = [];

//error fix posenetweb not set yet
let poseNetWeb;
let posesWeb =[];

let video;
var videoIsPlaying; 

//temp keypoints storage

let keypointsVideo =[];
let keypointsWeb =[];

function setup() {
    // 800 x 400 (double width to make room for each "sub-canvas")
    createCanvas(800, 400);
    // Create both of your off-screen graphics buffers
    leftBuffer = createGraphics(400, 400);
    rightBuffer = createGraphics(400, 400);
  
  //for video
  videoIsPlaying = false; 
  // createCanvas(640, 360);
  video = createVideo('singlewhipwu1.mp4', vidLoad);
  video.size(width, height);
  
  
 // Create a new poseNet method with a single detection for Video
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  // Hide the video element, and just show the canvas
  video.hide();

    //for webcam
  videoWeb = createCapture(VIDEO);
  
  //setup posenet for webcam
  poseNetWeb = ml5.poseNet(videoWeb, modelReadyWeb);
   poseNetWeb.on('pose', function(results) {
    posesWeb = results; //results or resultweb. resultweb bcz its a differnt global param
    // console.log(posesWeb)
  });
  
  // Hide the video element, and just show the canvas
  videoWeb.hide();
  
//this belong to setup 
}


function modelReady() {
  select('#status').html('Model Loaded');
}

function modelReadyWeb() {
  select('#status').html('Model for webcam Loaded');
}

function mousePressed(){
  vidLoad();
}


// //test fresh function 
// //poses from posenet for video
// function getPosesVid() {
//   for (let i = 0; i < poses.length; i++) {
//         let pose = poses[i].pose;
//   for (let j = 0; j < pose.keypoints.length; j++) {
//          // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//         let keypointsVideo = pose.keypoints[j];
//         // console.log("video keypoints in setup",keypointsVideo);
//         keypointsVideo = keypointsVideoF; //setting up result to outside function
//          }
         
//         }
// }

// console.log("test keypoints outside function", keypointsVideo); //null

// function getPosesWeb() {
//   for (let k = 0; k < posesWeb.length; k++) {
//     let poseWeb = posesWeb[k].pose;
//      for (let l = 0; l < poseWeb.keypoints.length; l++) {
//        let keypointsWeb = poseWeb.keypoints[l];
//       //  console.log("web keypoints in setup",keypointsWeb);
      
//    }   
//   //  return keypointsWeb;
//   }
// }

// // Calculate similarity when both keypoints are available
//  function calculateSimilarity() {
//   let sum = 0;
//   let sumSqVid = 0;
//   let sumSqWeb = 0;

//   console.log(keypointsVideo);
//   for(let m = 0;  m < keypointsVideo.length; m++) {
//     const x1 = keypoints1[i].position.x;
//     const y1 = keypoints1[i].position.y;
//     console.log(x1);
//     console.log(y1);
//   }
//  }


////////////////////DRAW/////////////////////////

function draw() {
    // Draw on your buffers however you like
    drawLeftBuffer();
    drawRightBuffer();
    
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(rightBuffer, 400, 0);

    //7may23
    //tes keypointsvideo bisa ditangkep disini ga
    // console.log("in draw", keypointsVideo); //empty of couse because out of scope
  
      // if (keypointsVideo.length > 0 && keypointsWeb.length > 0) {
      //     let similarity = calculateSimilarity(keypointsVideo, keypointsWeb);
      //     textSize(20);
      //     fill(255);
      //     text(`Similarity: ${similarity}`, 10, 30);
      //   }
     
}

//right for webcam
function drawRightBuffer() {
  image(videoWeb, 400, 0, 400, 400);
  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypointsWeb();
  // drawSkeletonWeb();
}

//Left buffer for video trainer
function drawLeftBuffer() {
   image(video, 0, 0, 400, 400);
  // We can call both functions to draw all keypoints and the skeletons in video
  // drawKeypoints();
  // drawSkeleton();
  getPosesVid();
  getPosesWeb();
  
  // normalizeVideo(); //uncaught
}


// This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

///for cosine sim
const LIMIT = 500;
let poseArr1 = []
let poseArr2 = []


//console.log(poses); //empty array?
//its literally the same but why it doesnt work //it has to be on the canvas other wise it doesnt work.

//19 may 23

//next steps: 
//vectorize : get only the x and y in each position, in each frames. 
// position x and y? gottem

//next step: make the array to contain liveweb keypoints
//somewhat done?

//31 may 23
//got keypoints from both video and 



//this send the keypoints to array but it keeps adding up. THIS WORKS THOU
function getPosesVid() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    // console.log(pose);
     for (let j = 0; j < pose.keypoints.length; j++) {
           // A keypoint is an object describing a body part (like rightArm or leftShoulder)
       let keypoint = pose.keypoints[j];
       keypointsVideo.push(keypoint.position.x, keypoint.position.y)
      // keypointsVideo.map(keypointsVideo.position.x, keypointsVideo.position.y)
       console.log(keypoint); //this shows up all the keypoints.
       console.log("array for vectorization",keypointsVideo);
   }   
   return keypointsVideo;
  }
}




//same like above
function getPosesWeb() {
  for (let k = 0; k < posesWeb.length; k++) {
    let poseWeb = posesWeb[k].pose;
     for (let l = 0; l < poseWeb.keypoints.length; l++) {
       let keypoint2 = poseWeb.keypoints[l];
       keypointsWeb.push(keypoint2.position.x, keypoint2.position.y)
       console.log(keypoint2); //this shows up all the keypoints.
       console.log("array for vector from web",keypointsWeb);
   }   
   return keypointsWeb;
  }
}



//sort of set up the timing and clean the array so it only calculate in each frame if that is possible
//because the size of the cosine calculation has to be in the same array size. 

//try same frame approach. is it possible? 

//steps for me to follow. after getting each keypoints from both video. make function to calculate the similarity.
//then run cosine similarity such as this one
//A is vector from video, B is vectorr from live cam

//hm idk
// function cosineSim(keypointsVideo, keypointsWeb) {
//   let dotproduct = 0;
//   console.log("dotproduct", dotproduct)
//   let mkeypointsVideo = 0;
//   console.log("mkeypointsVideo")
//   let mkeypointsWeb = 0;
//   console.log("mkeypointsWeb")
//   for (i = 0; i < keypointsVideo.length; i++) {
//     dotproduct += (keypointsVideo[i] * keypointsWeb [i]);
//     mkeypointsVideo += (keypointsVideo[i] * keypointsVideo[i]);
//     mkeypointsWeb  += (keypointsWeb [i] * keypointsWeb [i]);
//   }
//   mkeypointsVideo = Math.sqrt(mkeypointsVideo);
//   mkeypointsWeb = Math.sqrt(mkeypointsWeb);
//   let similarity = (dotproduct) / ((mkeypointsVideo) * (mkeypointsWeb))
//   // let distance = 2 * (1 - similarity);
//   // return Math.sqrt(distance);
//   return similarity;
// }

 

 