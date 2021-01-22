/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"; // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // variables of the constant color shader
    this.mConstColorShader = null;
    // variables for the squares
    // these are the Renderable objects
    this.mRedSq = null;
    // The camera to view the scene
    this.mCamera = null;
    this.mSets = null;
    // Initialize the webGL Context
    gEngine.Core.initializeEngineCore(htmlCanvasID);
    // Initialize the game
    this.initialize();
}

MyGame.prototype.initialize = function () {
// Step A: set up the cameras
    this.mCamera = new Camera(
            vec2.fromValues(0, 0), // position of the camera
            100, // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    // Step  B: create the shader
    this.mConstColorShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl", // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl"); // Path to the Simple FragmentShader

    this.mSets = [];
    // Step  C: Create the Renderable objects:
    this.mRedSq = new Renderable(this.mConstColorShader);
    this.mRedSq.setColor([1, 0, 0, 1]);
    // Step  E: Initialize the red Renderable object: centered 2x2
    this.mRedSq.getXform().setPosition(0, 0);
    this.mRedSq.getXform().setSize(1, 1);
    // Step F: Start the game loop running
    gEngine.GameLoop.start(this);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    // Step  D: Activate the red shader to draw
    this.mRedSq.draw(this.mCamera.getVPMatrix());

    for (var i = 0; i < this.mSets.length; i++) {

        for (var j = 0; j < this.mSets[i].length; j++) {
            this.mSets[i][j].draw(this.mCamera.getVPMatrix());
        }
    }
};
// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var deltaX = 0.5;
    var redXform = this.mRedSq.getXform();
    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        redXform.incXPosBy(deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        redXform.incYPosBy(deltaX);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        redXform.incXPosBy(-deltaX);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        redXform.incYPosBy(-deltaX);
    }

    if (gEngine.Input.isKeyClicked((gEngine.Input.keys.Space))) {
        //spawn squares
        //add to set
        var setOfSquares = [];

        for (var i = 0; i < getRandomInt(10, 20); i++) {
            var newSquare = new Renderable(this.mConstColorShader);

            //set position to cursor position
            newSquare.getXform().setPosition(this.mRedSq.getXform().getXPos(), this.mRedSq.getXform().getYPos());

            //move
            newSquare.getXform().incXPosBy(getRandomFloat(-5, 5));
            newSquare.getXform().incYPosBy(getRandomFloat(-5, 5));
            //set color
            newSquare.setColor([Math.random(), Math.random(), Math.random(), 1]);

            //scale
            var size = getRandomFloat(1, 6);
            newSquare.getXform().setSize(size, size);

            //rotate
            newSquare.getXform().incRotationByDegree(getRandomFloat(0, 360));

            setOfSquares.push(newSquare);
        }
        this.mSets.push(setOfSquares);
    }


//    var redXform = this.mRedSq.getXform();
//    // Step  C: test for pulsing the red square
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
//        if (redXform.getWidth() > 5)
//            redXform.setSize(2, 2);
//        redXform.incSizeBy(0.05);
//    }
}
;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
;

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}