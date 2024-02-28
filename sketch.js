// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// https://learn.ml5js.org/#/reference/posenet

/* ===
ml5 Example
PoseNet example using p5.js
=== */
// Global Variables
let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
let explosionImage; 
//let explosionNoise;
const cam_w = 640;
const cam_h = 480;

const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: true,
  minConfidence: 0.75,
  maxPoseDetections: 2, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

function setup() {
  createCanvas(cam_w, cam_h);
  capture = createCapture(VIDEO);
  capture.size(cam_w, cam_h);
  
  // song = loadSound("Deep-explosion-sound-effect.mp3");

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, options, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected.
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the capture element, and just show the canvas
  capture.hide();
  
  
}

function preload() {
  explosionImage = loadImage("explode-1.gif")
  //explosionNoise = loadSound("Deep-explosion-sound-effect.mp3")
 }

// this function gets called once the model loads successfully.
function modelReady() {
  console.log("Model loaded");
}

function draw() {
  // mirror the capture being drawn to the canvas
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  if (poses.length > 1) {
    connectWrists();
  }
}

function connectWrists() {
  
  // store person one data
  let pose0 = poses[0].pose;
  
  // store person two data
  let pose1 = poses[1].pose;
  
  let personLeft;
  let personRight;
  
  if (pose0.rightWrist.x < pose1.leftWrist.x) {
    personLeft = pose0
    personRight = pose1 
  } else {
    personLeft = pose1
    personRight = pose0
  }
  
  // store the wrist of each person
  let rightWrist = createVector(pose0.rightWrist.x, pose0.rightWrist.y);
  let leftWrist = createVector(pose1.leftWrist.x, pose1.leftWrist.y);
  
  fill(0)
  // ellipse(nose0.x, nose0.y, 40, 40);
  // ellipse(nose1.x, nose1.y, 40, 40);
  
  let wristDistance = rightWrist.dist(leftWrist);
  
  // if (wristDistance < 10) {
  //   loadImage("explosion.gif");
  //   loadSound("Deep-explosion-sound-effect.mp3")
  //  } else {ellipse(leftWrist.x, leftWrist.y, 10, 10)}
  
  if (wristDistance < 30) {
    image(explosionImage, rightWrist.x, rightWrist.y, 50, 50)
    //explosionNoise()
  } else {ellipse(leftWrist.x, leftWrist.y, 10, 10)}
  
  
 // strokeWeight(10);
 // line(rightWrist.x, rightWrist.y, leftWrist.x, leftWrist.y)
  
  
  //find halfway point between nose 1 and 2
  // let midPoint = nose0.lerp(nose1, 0.5)
  // fill(120, 100, 100)
  // ellipse(midPoint.x, midPoint.y, 50, 50)
  
}








