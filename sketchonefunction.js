//testing to get the image frame by frame

//1 setup video and webcam
//2 setup 
//3 get keypoints though one posenet function?
//4 save the keypoints 
//5 put the keypoints to similarity measurre

//setup const

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

let keypointsVideo = [];
let keypointsLive = [];
//setup all

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
video.hide();

    //      // Load the PoseNet model
    // poseNet = ml5.poseNet(video, modelReady);
    // poseNet.on('pose', getKeypoints);

      // Load the PoseNet model
  poseNet = ml5.poseNet(modelReady);
  poseNet.on('pose', getKeypoints);

  // poseNet.multiPose(videoWeb, getWebcamKeypoints);


  // Detect keypoints for the pre-recorded video
  // video.elt.addEventListener('canplaythrough', () => {
  //   poseNet.singlePose(video.elt, getVideoKeypoints);
  // });
  // poseNet.multiPose(video);

   //for webcam
   videoWeb = createCapture(VIDEO);
   videoWeb.hide();

}

   
function modelReady() {
    console.log('Model Loaded');
  }

  //not sure how this get keypoints
  //where does it used?
  function getKeypoints(poses) {
    if (poses.length > 0) {
      keypointsVideo = poses[0].pose.keypoints;
    }
  }

  // function getWebcamKeypoints(poses) {
  //   if (poses.length > 0) {
  //     keypointsLive = poses[0].pose.keypoints;
  //   }
  // }

  

//setup draw

function draw (){

     // Draw on your buffers however you like
     drawLeftBuffer();
     drawRightBuffer();
     
     // Paint the off-screen buffers onto the main canvas
     image(leftBuffer, 0, 0);
     image(rightBuffer, 400, 0);

   

 
}



//right for webcam
function drawRightBuffer() {
    image(videoWeb, 400, 0, 400, 400);

  }

  //draw for left webcam
  function drawLeftBuffer() {
    image(video, 0, 0, 400, 400);
 }

  // This function is called when the video loads
function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

if (keypointsVideo.length > 0 && keypointsLive.length > 0) {
  let similarity = calculateSimilarity(keypointsVideo, keypointsLive);
  textSize(20);
  fill(255);
  text(`Similarity: ${similarity}`, 10, 30);
}


