import positionFinder from "../../src/positionFinder.module.js"
import visualiser from "./visualiser.module.js"
let v = new visualiser( );

let room1  = [ { x: 100, y: 100 }, { x: 400, y: 100 } , 
    { x: 400, y: 400 }, { x: 550, y: 400 }, { x: 550, y: 550 },  { x: 100, y: 550 } ];
let room2  = [ { x: 100, y: 100 }, { x: 600, y: 100 } , 
   { x: 600, y: 500 }, { x: 100, y: 500 } ];

let room = room2;

let center = positionFinder.minimumDistPoint( room );
let myp5   = new p5( v.sketch, window.document.getElementById('sketch') );

myp5.points = room;
myp5.center = center;

myp5.mouseReleased = function(){
    myp5.center = positionFinder.minimumDistPoint( room );
    myp5.draw_allowed = false;
    myp5.points.forEach( ( edge , index ) =>{
        myp5[ "draw_" + index ] = false; 
    });
};