import positionFinder from "../../src/positionFinder.module.js"
import visualiser from "./visualiser.module.js"
import debug from "./debug.module.js"

let configuration = {

    allowedLights: 3,
    minRadius: 40,
    lightRoomRatio: 1,

    checkConstraints: true,
    showAll: false,
    showOutside: false

};
let positionHelper = new positionFinder( configuration );
let visualisation = new visualiser(  );

debug.init( positionHelper.options );


let room  = [ { x: 100, y: 100 }, { x: 400, y: 100 } , 
              { x: 400, y: 400 }, { x: 550, y: 400 }, { x: 550, y: 550 },  { x: 100, y: 550 } ];

let constraints = [ [ {x: 200, y:200 }, { x:300, y:300 } ],
                    [ {x: 220, y:500 }, { x:450, y:450 } ],
                    [ {x: 220, y:400 }, { x:450, y:250 } ] ];


let myp5 = new p5( visualisation.sketch, window.document.getElementById('sketch') );

myp5.points      = room;
myp5.constraints = constraints;

myp5.circles = positionHelper.fillCircles( room, constraints );
/*
setTimeout( () =>{
    positionHelper.options.allowedLights = 1;
    myp5.circles = positionHelper.fillCircles( room, constraints );

    myp5.redraw();
}, 4000 );
*/
/* Interatction */
myp5.mouseReleased = function(){

    myp5.draw_allowed = false;
    myp5.circles = positionHelper.fillCircles( room, constraints );

    // disable moving points
    myp5.points.forEach( ( edge , index ) =>{
        myp5[ "drawP_" + index ] = false; 
    });

    myp5.constraints.forEach( ( constraint , index ) =>{
        constraint.forEach( ( point, index2 ) => {
            myp5[ "drawC_" + index +"_"+ index2 ] = false; 
        })
    });

};
