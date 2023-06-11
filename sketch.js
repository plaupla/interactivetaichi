//Task: Run two posenet, one with trainer video, one with webcam side by side. 


//current problem: should have run posenet once and saved each in different var? ReferenceError: posesWeb is not defined. resolved 7/5/23

//next error :ReferenceError: skeleton is not defined at /sketch.js:169:19. resolved. but the skeleton is off.

//webcam run but overlapped. sort of resolved atm but still warped.

//next step. calculate similarity for both keypoints.
//cosine sim function implemented, but 8/5.23 no error and no result. result is no where to find?

//functions needed for cosine similarity

// function calcPoseArrScore(poseArr1, poseArr2) {
//   const WEIGHTINGS = [1, 3, 3, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 0, 0, 0, 0]   // More important body parts are weighted more
//   const WEIGHTING_SUM = 40

  // // Calculates cosine similarity
  // function cosSim(pair1, pair2) {
  //   return (pair1[0] * pair2[0] + pair1[1] * pair2[1]) / ((Math.sqrt(Math.pow(pair1[0], 2) + Math.pow(pair1[1], 2)))* (Math.sqrt(Math.pow(pair2[0], 2) + Math.pow(pair2[1], 2))))
  // }
  
    // Returns array of values, each in [0, 1]
  // function calcCosSimArr(pose1, pose2) {
  //   let res = []
  //   for (let i = 0; i < WEIGHTINGS.length; i++) {
  //     // Normalize vectors and calc cosSimilarity
  //     let denom1 = Math.sqrt(Math.pow(pose1.keypoints[i].position.x, 2) + Math.pow(pose1.keypoints[i].position.y, 2))
  //     let denom2 = Math.sqrt(Math.pow(pose2.keypoints[i].position.x, 2) + Math.pow(pose2.keypoints[i].position.y, 2))
  //     res[i] = cosSim([Math.pow(pose1.keypoints[i].position.x, 2) / denom1, Math.pow(pose1.keypoints[i].position.y, 2) / denom1],
  //       [Math.pow(pose2.keypoints[i].position.x, 2) / denom2, Math.pow(pose2.keypoints[i].position.y, 2) / denom2])
  //   }
  //   res = res.map(x => Math.min(x, 1))
  //   console.log(res);
  //   return res
  // }
  
    // Returns value in [0, 1], where 1 is more similar
  // function calcCosScore(cosSimArr) {
  //   let sum = 0
  //   for (let i = 0; i < WEIGHTINGS.length; i++) {
  //     sum += cosSimArr[i] * WEIGHTINGS[i]
  //   }
  //   return Math.min(sum / WEIGHTING_SUM, 1)
  // }
  
  //   // Returns value in [0, 1], where 0 is more similar
  // function calcEucScore(cosSimArr) {
  //   let sum = 0;
  //   for (let i = 0; i < WEIGHTINGS.length; i++) {
  //     sum += Math.sqrt(2 * (1 - cosSimArr[i])) * WEIGHTINGS[i]
  //   }
  //   return Math.min(sum / WEIGHTING_SUM, 1)
  // }
  
  //  // Returns a value in [0, 1], where 1 is more similar
  // function calcPoseScore(pose1, pose2) {
  //   let cosSimArr = calcCosSimArr(pose1, pose2)
  //   let cosScore = calcCosScore(cosSimArr)
  //   let euclidScore = calcEucScore(cosSimArr)

  //   return Math.max(0, cosScore - euclidScore)
  // }
  
  
  
//} // kurung cosine 


/////setup calculate similarity

//take keypoints 

//set function


//calculate cosine similarity
   
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
    posesWeb = results; //results or resultweb
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

////////////////////DRAW/////////////////////////

function draw() {
    // Draw on your buffers however you like
    drawLeftBuffer();
    drawRightBuffer();
    
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(rightBuffer, 400, 0);
}

//Left buffer for video trainer
function drawLeftBuffer() {
   image(video, 0, 0, 400, 400);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}


///for cosine sim
const LIMIT = 500;
let poseArr1 = []
let poseArr2 = []



// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    // if (localStorage.getItem("switch") === null && poseArr1.length < LIMIT) {
    //   localStorage.setItem("trigger", 'true');
     poseArr1.push(pose)
    //   // console.log(pose)
    //   localStorage.setItem("poseArr1",JSON.stringify(poseArr1));
    
    // }
      //works
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
      	noStroke();
        fill(255, 0, 0);
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}


//right for webcam
function drawRightBuffer() {
  image(videoWeb, 400, 0, 400, 400);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypointsWeb();
  drawSkeletonWeb();
}

// A function to draw ellipses over the detected keypoints
function drawKeypointsWeb()  {
  // Loop through all the poses detected
  for (let k = 0; k < posesWeb.length; k++) {
    // For each pose detected, loop through all the keypoints
    let poseWeb = posesWeb[k].pose;
      poseArr2.push(poseWeb)
    //  //  console.log(poseArr2)
    //   localStorage.setItem("poseArr2",JSON.stringify(poseArr2));
    for (let l = 0; l < poseWeb.keypoints.length; l++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypointWeb = poseWeb.keypoints[l];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypointWeb.score > 0.2) {
        fill("darkblue");
        noStroke();
        ellipse(keypointWeb.position.x, keypointWeb.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeletonWeb() {
  // Loop through all the skeletons detected
  for (let k = 0; k < posesWeb.length; k++) {
    let skeletonWeb = posesWeb[k].skeleton;
    // For every skeleton, loop through all body connections
    for (let l = 0; l < skeletonWeb.length; l++) {
      let partA = skeletonWeb[l][0];
      let partB = skeletonWeb[l][1];
      stroke("white");
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

///////draw cosine similarity////
//9may23
// let res = calcPoseArrScore(JSON.parse(localStorage.getItem("poseArr1")),
// JSON.parse(localStorage.getItem("poseArr2")))

//test getting poseArr1 and PoseArr2
//let testing = poseArr1 - poseArr2  //this wont work because these are objects
// function testArr(p1,p2){
// return p1+p2;
// }
// let testing = testArr(JSON.parse(localStorage.getItem("poseArr1")),JSON.parse(localStorage.getItem("poseArr2")));
// console.log (testing + "test getting keypoints");
//still doesnt show any keypoints

 //coba get arr pake alyssa
 //doesnt work, no output. Maybe the posearr not 

 //console.log(poseArr1); //result in arrays, so not object but json
 //console.log(poseArr2);

//keyppoints can be printed here
//  console.log("expert keypoints", poseArr1);
//  console.log("liveweb", poseArr2); 

//  const poseExpert = poseArr1;
//   console.log(poseExpert); //object? not json

 
//11may23
 //can i get x position?
//how to access keypoints in each frames?
 //from my old script to get keypoints from right shoulder, elbow and hand
 //const rightElbowModelXExp = poseArr1.keypoints[8].position.x; 
 //console.log("right elbow expert", rightElbowModelXExp); //result in all keypoints for the whole movement 
 
 //12may23
 //cosine similarity
//tried to converge the keypoints in one function and call it to get the keypoints 


//works
// console.log(JSON.parse(localStorage.getItem("poseArr1")));
// console.log(JSON.parse(localStorage.getItem("poseArr2")));

//accessing the poseArr1 and2

 //undefined //console.log("expert pose keypoints ", poseExpert.keypoints);

 // Compare the poses //try this one works
// let poseVideo = JSON.parse(localStorage.getItem("poseArr1"));
// let poseWeb = JSON.parse(localStorage.getItem("poseArr2"));
// console.log (poseVideo); //this result in arrays
// console.log(poseWeb);// also works

//how do i access the keypoint inside the 
// let test1 = poseVideo.keypoints[i].position.x;
// console.log (test1);

//16 may 23

//initializing cosine sim

//this doesnt show anything
// function cosinesim(){
//   let similarity = 0;
//   //loop on the video 
//   for (let m =0; m < poses.length; m++) {
//     let poseVideo = poses.pose;
//     for (let n = 0; n < poseNetWeb; n++) {
//       let poseWeb = posesWeb.pose;
//       let distance = dist(poseVideo.keypoint[0].position.x,poseVideo.keypoint[0].position.y,poseWeb.keypoint[0].position.x, poseWeb.keypoint[0].position.x)
//       console.log(distance);
//     }
//   }
// }

//17 may 23

//combine two array of poses
//normalize

//works
console.log(JSON.parse(localStorage.getItem("poseArr1")));
console.log(JSON.parse(localStorage.getItem("poseArr2")));
//these are the same.
let array1 = JSON.parse(localStorage.getItem("poseArr1"));
let array2 = JSON.parse(localStorage.getItem("poseArr2"));
console.log("possibly json parsed",array1);
console.log("possibly json parsed",array2);

// console.log("pose vid", poses); //undefined
// console.log("pose arr", poseArr1); //nested array


//trying to get the x and y map not a p5 method
// const xPosLive = array1.map((k) => k.position.x);
// console.log("get the arrays video",xPosLive)

// Create empty arrays for normalized keypoints
//create vector. flatting the array
//for video
let vector1 = [];
for (let i = 0; i < array1.length; i++) {
  let keypoint1 = array1[i]; //undefined
  vector1.push(keypoint1.position.x, keypoint1.position.y);
}

console.log("vector", vector1);//empty?

let vector2 = [];
for (let i = 0; i < Array2.length; i++) {
  let keypoint2 = Array2[i];
  vector2.push(keypoint2.position.x, keypoint2.position.y);
}

console.log("vector2", vector2);//empty

// let distance = dist(JSON.parse(localStorage.getItem("poseArr1")),JSON.parse(localStorage.getItem("poseArr2"))); //dist no defined berati p5 ga bisa dipake?
// console.log(distance);

//
// let res = calcPoseArrScore(JSON.parse(localStorage.getItem("poseArr1")),
//        JSON.parse(localStorage.getItem("poseArr2")))

//        console.log(res); //undefined

  
//   console.log("pose in similarity function",poseVideoEx);

  
// }

    // Returns array of values, each in [0, 1]
  // function calcCosSimArr(pose1, pose2) {
  //   let res = []
  //   for (let i = 0; i < WEIGHTINGS.length; i++) {
  //     // Normalize vectors and calc cosSimilarity
  //     let denom1 = Math.sqrt(Math.pow(pose1.keypoints[i].position.x, 2) + Math.pow(pose1.keypoints[i].position.y, 2))
  //     let denom2 = Math.sqrt(Math.pow(pose2.keypoints[i].position.x, 2) + Math.pow(pose2.keypoints[i].position.y, 2))
  //     res[i] = cosSim([Math.pow(pose1.keypoints[i].position.x, 2) / denom1, Math.pow(pose1.keypoints[i].position.y, 2) / denom1],
  //       [Math.pow(pose2.keypoints[i].position.x, 2) / denom2, Math.pow(pose2.keypoints[i].position.y, 2) / denom2])
  //   }
  //   res = res.map(x => Math.min(x, 1))
  //   console.log(res);
  //   return res
  // }

// function cosSim(poseArr1, poseArr2) {
//     return (pair1[0] * pair2[0] + pair1[1] * pair2[1]) / ((Math.sqrt(Math.pow(pair1[0], 2) + Math.pow(pair1[1], 2)))* (Math.sqrt(Math.pow(pair2[0], 2) + Math.pow(pair2[1], 2))))
//   }

//   cosSim;
//   console.log("test cosim",cosSim)

// console.log("test keypoints",similarityTest)

//does not result in anything. something like this.

// function calculateSimilarity() {
//   let similarity = 0;
//   //run through all keypoints
//   for (let i = 0; i < poseVideo.length; i++) {
//     let pose1 = poseVideo[i].pose;
//     console.log ("pose1", pose1);
//     for (let j = 0; j < poseWeb.length; j++) {
//       let pose2 = poseWeb[j].pose;
//       console.log("pose2",pose2);
//       let distance = dist(poseVideo.keypoints[0].position.x, poseVideo.keypoints[0].position.y, poseWeb.keypoints[0].position.x, poseWeb.keypoints[0].position.y);
//       similarity += distance;

//       console.log(similarity);
//     }
//   }
//   return similarity;
  
// }

//dipanggil ga ada hasilnya
 // Calculate the similarity score
//  let similarity = calculateSimilarity();
//  console.log('Similarity Score:', similarity);

//test git change