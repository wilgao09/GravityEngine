# GravityEngine

## Purpose
In physics classes, instructors talk about the four fundamental forces (Gravity, the Weak Force, Strong Force, and Electromagnetic Force). However, just saying "they're weak" undermines how weak they actually are. This project seeks to demonstrate how much mass and how small of a distance is required in order to have a meaningful interaction between macroscopic bodies. 

## Build tools
The display is written in HTML5 and CSS. Dynamic resizing and physics calculations are all done in the front end using Javascript.

## Challenges
One of the greatest problems was being able to link up the SVG objects with the calculations. Because we have two nearindependent modules, we should only be transferring the most essential parts: the starting locations of each object and how much they're displaced each physics tick. This way, if we convert units correctly, the front and the back can describe the same system of objects.

Javascript (and your browser) are single threaded. This makes things slightly more difficult because it forced my hand in making everything faster so that no ticks are delayed. 

I'm a first year and first time hackathoner, so I don't know much work I'm supposed to have done.

## Sample Numbers
Mass: 1*10^16 kg
Set time scale to 0
Set an object on the right to have an initial velocity of ~130 (all downward)
Set an object on the left to have an initial velocity of ~130 (all upward)
Play in .5 speed!

Here's a screenshot of it!

![binary system here] (binary.png)


## Downfalls
Features I didn't get to implement: 

- UI for vectors
- UI for static objects
- A more effective collision system
- More comprehensive debug information

## Learning Experience!?
Planning is the msot important thing in the universe, even if you think it's something you've done before. I overestimated how much I could do in 24 hours.
The time constraint also got me to stop featurecreeping.





## Technical Bits
This project only uses circles, so there are no AABBs. 
The space in the SVG is converted so that the coordinates are relative to a (0,0) in the center of the square screen as opposed to a (0,0) in the top left corner. 
