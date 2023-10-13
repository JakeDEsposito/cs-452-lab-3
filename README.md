By Jake D'Esposito

# Transformation Composition Order

The order in which the transformations are composed is as follows:

1. Translation
1. Rotations
    1. Z Rotation
    1. Y Rotation
    1. X Rotation
1. Scaling

# My Approach To The Problem

I first started by using the code in class as a baseline to get started. Next, I modified the object to be more than a cube. I did not just want to add another vertice and call it a day, so I used a 3D model of an apple I created earlier. At first, I tried to parse the file to get the necessary data, but I was having trouble doing it, so I used a library to import the apple. Next, I worked on modifying the existing shader to have matrices to apply to the object's position to move it around. I used the slides from in class to create the matrices. I played with the values from there to see which transformation composition order I liked. Then, I set up some variables I made into uniforms that I could access in the JavaScript file. Then, I imported my KeyHandler class and set up global variables to hold persistent data about the object's rotation, transformation, and scale. I used my KeyHandler class to react to key presses, modified the global variables, and applied them to their respective uniform counterparts in the shader.

# GitHub Pages

[Link to live page](https://jakedesposito.github.io/cs-452-lab-3/)