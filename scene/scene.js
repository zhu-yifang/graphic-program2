//
// Program 2: make a scene
//
// scene.js
//
// CSCI 385: Computer Graphics, Reed College, Spring 2022
//
// This is a sample `opengl.js` program that displays a scene of a house,
// a waving arm and hand, and a recursively drawn Sierpinski carpet.
//
// The OpenGL drawing part of the code occurs in draw and that
// function relies on several helper functions to do its work.
// There is a `drawHouse`, a `drawWavingArm`, and a `drawSquarepinski`
// function to draw each figure.
//
// Your assignment is to change the three scenes to the following:
//
// - Scene: draw a scene differet than the house
// - Recursive: draw a different fractal
// - Animation: draw a different animation of some articulated figure
//
// For each of these, you'll write functions that describe their
// components in 2-space and 3-space. Then in their `draw...` functions
// you'll use `glTranslatef`, `glRotatef`, and `glScalef` calls to
// place, orient, and scale each component that's drawn.
//
// Your drawings will be hierarchical and rely on a transformation
// stack to layout a component and its subcomponents. You'll use
// calls to `glPushMatrix` and `glPopMatrix` to control the stack,
// saving and restoring where you are working in the scene or figure.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/scene.html
//
let orientation = quatClass.for_rotation(0.0, new vector(1.0,0.0,0.0));
let mouseStart  = {x: 0.0, y: 0.0};
let mouseDrag   = false;

var recursiveLevels = 3;
var treeAngle1 = -30;
var treeAngle2 = -30;
var scene = "scene";
var sunLocation = {x: -1.5, y: 1.0};

var birdLocation = {x: -1.5, y: 1.0};

var lastw = 800;
var lasth = 640;

function setLevel(level) {
    recursiveLevels = level;
    // Redraw.
    glutPostRedisplay();
}

function setAngle1(angle) {
    treeAngle1 = angle;
    // Redraw.
    glutPostRedisplay();
}

function setAngle2(angle) {
    treeAngle2 = angle;
    // Redraw.
    glutPostRedisplay();
}


function makeWireCube() {
    glBegin(GL_LINES, "WireCube");

    // front-back
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);


    // side-side
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);


    // down-up
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    
    glEnd();
}

let animate = true;
let shoulder = 0.0;
let elbow = 0.0;
let wrist = 15 / Math.PI;

function drawWavingArm() {
    if (animate) {
	shoulder += 7.5/180.0 * Math.PI;
	elbow += 7.5/180.0 * Math.PI;
	wrist += 15/180.0 * Math.PI;
    }
    
    const length = 0.8;
    const width = 0.25;
    
    const shoulderAngle = 20.0 * Math.cos(shoulder) + 20;
    const elbowAngle = 40.0 * Math.sin(elbow) + 40.0;
    const wristAngle = -75.0 * Math.sin(wrist);

    glColor3f(0.5,0.6,0.2)

    glPushMatrix();
    glScalef(1.5,1.5,1.5);
    glTranslatef(-length * 1.5, -length * 1.25, 0.0);
    glRotatef(shoulderAngle, 0.0, 0.0, 1.0);

    // Upper arm.
    glPushMatrix();
    glTranslatef(length/2, 0.0, 0.0);
    glScalef(length, width, width);
    glBeginEnd("WireCube");
    glPopMatrix();

    glTranslatef(length, 0.0, 0.0);
    glRotatef(elbowAngle, 0.0, 0.0, 1.0);

    // Forearm.
    glPushMatrix();
    glTranslatef(1.5 * length/2, 0.0, 0.0);
    glScalef(1.4 * length, 0.8 * width, 0.8 * width);
    glBeginEnd("WireCube");
    glPopMatrix();

    glTranslatef(1.5 * length, 0.0, 0.0);
    glRotatef(wristAngle, 0.0, 0.0, 1.0);

    // Palm/hand.
    glPushMatrix();
    glTranslatef(width, 0.0, 0.0);
    glPushMatrix();
    glScalef(2*width, width, width/2);
    glBeginEnd("WireCube");
    glPopMatrix();

    // Fingers
    for (let f = 0; f < 4; f++) {
	glPushMatrix();
	glRotatef(f*15.0-15.0, 0.0, 0.0, 1.0);
	glTranslatef(width*2,0.0,0.0);
	glScalef(width*1.5,width/4,width/4);
	glBeginEnd("WireCube");
	glPopMatrix();
    }
    // Thumb
    glPushMatrix();
    glRotatef(90, 0.0, 0.0, 1.0);
    glTranslatef(width,0.0,0.0);
    glScalef(width,width/3,width/3);
    glBeginEnd("WireCube");
    glPopMatrix();
    
    glPopMatrix();
    glPopMatrix();
}

// makeSquare():
//
// Makes a unit square centered at the origin.
//
function makeSquare() {
    glBegin(GL_TRIANGLES, "Square");
    glVertex3f(-0.5, 0.5, 0.0);
    glVertex3f(-0.5,-0.5, 0.0);
    glVertex3f( 0.5,-0.5, 0.0);
    glVertex3f(-0.5, 0.5, 0.0);
    glVertex3f( 0.5,-0.5, 0.0);
    glVertex3f( 0.5, 0.5, 0.0);
    glEnd();
}

// drawSquarepinski(levels):
//
// Draws the recursive figure of a Sierpinski square.  The integer
// parameter `levels` indicates how many recursive levels should be
// shown. 0 indicates that only a solid square gets drawn.
//
function drawSquarepinski(levels) {
    if (levels == 0) {  
	glBeginEnd("Square");
    } else {
        glPushMatrix();
        glScalef(1/3, 1/3, 1/3);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <=1; j++) {
                if ((i != 0) || (j != 0)) {
                    glPushMatrix();
                    glTranslatef(i,j,0);
                    drawSquarepinski(levels-1);
                    glPopMatrix();
                }
            }
        }
        glPopMatrix();
    }         
}

// RTRI
//
// Describes an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function makeRTRI() {
    glBegin(GL_TRIANGLES,"RTRI");
    glVertex3f(0.0,0.0,0.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);
    glEnd();
}

// RTRI
//
// Draws an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function RTRI() {
    glBeginEnd("RTRI");
}

// makeDISK
//
// Describes a unit disk centered at the origin.
//
function makeDISK() {
    glBegin(GL_TRIANGLES,"DISK");
    const sides = 100;
    const dtheta = 2.0 * Math.PI / sides;
    for (let i = 0; i < 100; i++) {
        const theta = i * dtheta;
        // draw a pie slice on the disk
        glVertex3f(0.0,0.0,0.0);
        glVertex3f(Math.cos(theta),
			Math.sin(theta),
			0.0);
        glVertex3f(Math.cos(theta + dtheta),
			Math.sin(theta + dtheta),
			0.0);
    }
    glEnd();
}

// DISK
//
// Draws a unit disk centered at the origin.
//
function DISK() {
    glBeginEnd("DISK");
}

// BOX
//
// Draws a unit square with lower-left corner at the origin.
//
function BOX() {
    RTRI();
    glPushMatrix();
    glTranslatef(1.0,1.0,0.0);
    glRotatef(180.0,0.0,0.0,1.0)
    RTRI();
    glPopMatrix();
}

// RECT
//
// Draws a 1x2 rectangle (1 wide, 2 high) with lower-left corner at the
// origin.
//
function RECT() {
    BOX()
    glPushMatrix()
    glTranslatef(0.0,1.0,0.0)
    BOX()
    glPopMatrix()

}

// HOUSE, etc.
//
// Below are a series of procedures that draw the elements of a
// scene containing a house, a tree, and the sun.
//
function WINDOW() {
    glColor3f(1.0,1.0,1.0)
    glPushMatrix()
    glScalef(0.2,0.2,0.2)
    BOX()
    glPopMatrix()
}

//
//
function DOOR() {
    glColor3f(0.6,0.6,0.8)
    glPushMatrix()
    glScalef(0.2,0.2,0.2)
    RECT()
    glPopMatrix()
}

//
//
function HOUSE() {
    glColor3f(0.5,0.125,0.125)

    BOX()

    glPushMatrix()
    glTranslatef(0.2,0.2,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.2,0.6,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.6,0.6,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.6,0.0,0.0)
    DOOR()
    glPopMatrix()

    glColor3f(0.25,0.25,0.25)
    glPushMatrix()
    glTranslatef(0.5,1.5,0.0)
    glScalef(1.1,0.8,1.1)
    glRotatef(-135,0.0,0.0,1.0)
    RTRI()
    glPopMatrix()
}

//
//
function TREE() {
    glColor3f(0.5,0.5,0.25);

    glPushMatrix();

    // Trunk.
    glTranslatef(-0.5,0.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);
    
    // Branch 1.
    glPushMatrix()
    glRotatef(treeAngle1,0.0,0.0,1.0);
    glScalef(0.3,0.6,0.3);
    RTRI(); 
    glPopMatrix();
    
    // Branch 2.
    glPushMatrix()
    glTranslatef(1.0,0.0,0.0);
    glRotatef(-90.0,0.0,0.0,1.0);
    glRotatef(treeAngle2,0.0,0.0,1.0);
    glScalef(0.3,0.6,0.3);
    RTRI();
    glPopMatrix();
    
    glPopMatrix();

    glColor4f(0.1,0.5,0.2,0.7);
    glPushMatrix()
    glTranslatef(0.0,3.0,0.01)
    glScalef(1.75,1.75,1.75)
    DISK()
    glPopMatrix()
}

function TREE1() {
    
    // trunk
    glTranslatef(-1, -1, 0);
    glPushMatrix();
    glScalef(0.5, 0.5, 0.5);
    glColor3f(0.57, 0.34, 0.15);
    RECT();
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.25, 1.71, 0);
    glRotatef(-135, 0, 0, 1);
    glColor4f(0.1,0.5,0.2,0.7);
    RTRI();
    glPopMatrix();

    glPushMatrix();

    glTranslatef(0.25, 2, 0);
    glRotatef(-135, 0, 0, 1);
    glScalef(0.8, 0.8, 0);
    glColor4f(0.1,0.5,0.2,0.7);
    RTRI();
    glPopMatrix();
    
}

function convertMouseToCurrent(mousex,mousey) {
    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX, pj);
    const mv = mat4.create();
    glGetFloatv(GL_MODELVIEW_MATRIX, mv);
    const xform = mat4.create();
    mat4.multiply(xform, pj, mv);
    const xform_inv = mat4.create();
    mat4.invert(xform_inv,xform);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT, vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
					1.0-2.0*mousey/vp[3],
					0.0, 1.0);
    vec4.transformMat4(location,mousecoords, xform_inv);
    return vec3.fromValues(location[0], location[1], location[3]);

}

//
//   
function SUN() {
    glPushMatrix();
    glTranslatef(sunLocation.x, sunLocation.y,-2.0);
    
    glPushMatrix();
    glScalef(0.15,0.15,0.15);
    glColor3f(1.0,0.8,0.3);
    DISK()
    glPopMatrix();
    
    glPopMatrix();
}

//
//
function BIRD() {
    glPushMatrix();

    glTranslatef(birdLocation.x, birdLocation.y, 0);

    // body
    glPushMatrix();
    glScalef(0.15,0.15,0.15);
    glColor3f(1, 1, 0);
    DISK();
    glPopMatrix();
    // head and eyes
    glPushMatrix();
    glTranslatef(0.25, 0, 0);
    glScalef(0.1, 0.1, 0.1);
    glColor3f(1, 1, 0);
    DISK();
    glTranslatef(0, 0.5, 0);
    glScalef(0.25, 0.25, 0.25);
    glColor3f(0, 0, 0);
    DISK();
    glPopMatrix();
    
    // wings
    glPushMatrix();
    glTranslatef(0, 0.35, 0);
    glScalef(0.2, 0.3, 0);
    glRotatef(-135, 0, 0, 1);
    glColor3f(1, 1, 0);
    RTRI();
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0, -0.35, 0);
    glScalef(0.2, 0.3, 0);
    glRotatef(-135, 0, 0, 1);
    glRotatef(180, 0, 0, 1);
    glColor3f(1, 1, 0);
    RTRI();
    glPopMatrix();
    
    // tail
    glPushMatrix();
    glTranslatef(-0.15, 0, 0);
    glRotatef(135, 0, 0, 1);
    glScalef(0.2, 0.2, 0);
    glColor3f(1, 1, 0);
    RTRI();
    glPopMatrix();
    
    // beak
    glPushMatrix();
    glTranslatef(0.38, 0, 0);
    glRotatef(135, 0, 0, 1);
    glScalef(0.05, 0.05, 0);
    glColor3f(1, 0, 0);
    RTRI();
    glPopMatrix();

    glPopMatrix();
}

function CAR() {
    // body
    glPushMatrix();
    glTranslatef(0, 1, 0);
    glRotatef(-90, 0, 0, 1);
    glColor3f(0.8, 0, 0);
    RECT();
    glPopMatrix();
    // wheels
    glPushMatrix();
    glColor3f(0.5, 0.5, 0.5);
    glTranslatef(0.5, 0, 0);
    glScalef(0.25, 0.25, 0.5);
    DISK();
    glPopMatrix();

    glPushMatrix();
    glColor3f(0.5, 0.5, 0.5);
    glTranslatef(1.5, 0, 0);
    glScalef(0.25, 0.25, 0.5);
    DISK();
    glPopMatrix();

    // windows
    glPushMatrix();
    glColor3f(1, 1, 1);
    glTranslatef(0.2, 0.75, 0);
    glScalef(0.8, 0.4, 0);
    glRotatef(-90, 0, 0, 1);
    RECT();
    glPopMatrix();


}
function handleKey(key, x, y) {
    /* 
     * Handle a keypress.
     */

    // Handle the h key.
    if (key == 's') {
        scene = "scene";
        // Redraw.
        glutPostRedisplay();
    }
    
    // Handle the r key.
    if (key == 'r') {
        scene = "recursive";
        // Redraw.
        glutPostRedisplay();
    }
    
    // Handle the r key.
    if (key == 'a') {
	if (scene == "animation") {
	    animate = !animate;
	} else {
	    scene = "animation";
	    animate = true;
	}

        // Redraw.
        glutPostRedisplay();
    }
    
}

function drawHouse() {
    SUN();

    glPushMatrix();
    
    glTranslatef(0.0,-1.5,0.0);

    // Draw the yard.
    glColor3f(0.1,0.3,0.1);
    glPushMatrix();
    glTranslatef(5.0,0.0,0.0);
    glRotatef(180,0.0,0.0,1.0);
    glScalef(10.0,10.0,10.0);
    BOX();
    glPopMatrix();

    // Draw the house.
    HOUSE();

    // Plant a happy little tree.
    glPushMatrix();
    glTranslatef(-1.0,0.0,0.0);
    glScalef(0.25,0.25,0.25);
    TREE()
    glPopMatrix();

    glPopMatrix();
}

function drawScene() {
    BIRD();
    glPushMatrix();
    glTranslatef(-1, -0.5, 0);
    TREE1();
    glPopMatrix();
    glTranslatef(-0.5, -1.5, 0);
    CAR();
}

function draw() {
    /*
     * Issue GL calls to draw the requested graphics.
     */

    // Clear the rendering information.
    if (scene == "scene") {
	glClearColor(0.8, 0.9, 1.0, 1.0);
    } else {
	glClearColor(0.4, 0.45, 0.5, 1.0);
    }
    glClearDepth(1.0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    if (scene == "scene") {
	
	drawScene();
	
    } else if (scene == "animation") {

	
	glPushMatrix();
	// Reorient according to the "trackball" motion of mouse drags.
	orientation.glRotatef();
	drawWavingArm();
	glPopMatrix();

    } else if (scene == "recursive") {
	
	glColor3f(0.5, 0.3, 0.55);
	glPushMatrix();
	glScalef(3.0,3.0,3.0);
	drawSquarepinski(recursiveLevels);
	glPopMatrix();
	
    }
    // Render the scene.
    glFlush();
}

function ortho(w,h) {
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    lastw = w;
    lasth = h;
    if (w > h) {
        glOrtho(-w/h*2.0, w/h*2.0, -2.0, 2.0, -2.0, 2.0);
    } else {
	glOrtho(-2.0, 2.0, -h/w * 2.0, h/w * 2.0, -2.0, 2.0);
    }
}

function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport.
     */
    glViewport(0, 0, w, h);
    ortho(w,h);
}

function worldCoords(mousex, mousey) {
    /*
     * Compute the world/scene coordinates associated with
     * where the mouse was clicked.
     */

    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX,pj);
    const pj_inv = mat4.create();
    mat4.invert(pj_inv,pj);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT,vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
					1.0-2.0*mousey/vp[3],
					0.0, 1.0);
    vec4.transformMat4(location,mousecoords,pj_inv);
    return {x:location[0], y:location[1]};
}    

function handleMouseClick(button, state, x, y) {
    /*
     * Records the location of a mouse click in 
     * world/scene coordinates.
     */

    // Start tracking the mouse for trackball motion.
    mouseStart  = worldCoords(x,y);
    mouseButton = button;
    if (state == GLUT_DOWN) {
	mouseDrag = true;
    } else {
	mouseDrag = false;
    }

    if (scene == "scene") {
	birdLocation = mouseStart;
    }
    
    glutPostRedisplay()
}

function handleMouseMotion(x, y) {
    /*
     * Reorients the object based on the movement of a mouse drag.
     *
     * Uses last and current location of mouse to compute a trackball
     * rotation. This gets stored in the quaternion orientation.
     *
     */
    
    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - mouseStart.x;
    dy = mouseNow.y - mouseStart.y;

    // Ready state for next mouse move.
    mouseStart = mouseNow;

    if (scene == "animation") {
	axis = (new vector(-dy,dx,0.0)).unit()
	angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
	orientation = quatClass.for_rotation(angle,axis).times(orientation);
    }
    if (scene == "scene") {
	birdLocation = mouseStart;
    }
    
    // Update window.
    glutPostRedisplay()
}

function main() {
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(800, 640);
    glutCreateWindow('A scene.');

    makeRTRI();
    makeDISK();
    makeSquare();
    makeWireCube();

    ortho(800,640);

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey)
    glutReshapeFunc(resizeWindow)
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    glutDisplayFunc(draw);
    glutMainLoop();
}

glRun(main, true);
