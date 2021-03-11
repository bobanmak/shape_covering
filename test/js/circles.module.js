import positionFinder from "../../src/positionFinder.module.js"
import visualiser from "./visualiser.module.js"

let v = new visualiser( );

let constraints = [];

let room1  = [ { x: 100, y: 100 }, { x: 400, y: 100 } , 
               { x: 400, y: 400 }, { x: 550, y: 400 }, { x: 550, y: 550 },  { x: 100, y: 550 } ];
let room2  = [ { x: 100, y: 100 }, { x: 600, y: 100 } , 
               { x: 600, y: 500 }, { x: 100, y: 500 } ];

let innenWand1 = [ {x: 200, y:200 }, { x:300, y:300 }];
let innenWand2 = [ {x: 220, y:500 }, { x:450, y:450 }];
constraints.push( innenWand1 );
constraints.push( innenWand2 );

let room = room1;
let myp5 = new p5( v.sketch, window.document.getElementById('sketch') );

myp5.points = room;
myp5.constraints = constraints;

myp5.circles = positionFinder.fillCircles( room, constraints );


/* Interatction */
myp5.mouseReleased = function(){

    myp5.draw_allowed = false;
    myp5.circles = positionFinder.fillCircles( room, constraints );

    myp5.points.forEach( ( edge , index ) =>{
        myp5[ "drawP_" + index ] = false; 
    });

    myp5.constraints.forEach( ( constraint , index ) =>{
        constraint.forEach( ( point, index2 ) => {
            myp5[ "drawC_" + index +"_"+ index2 ] = false; 
        })
    });
    console.log("myp", myp5);

};
