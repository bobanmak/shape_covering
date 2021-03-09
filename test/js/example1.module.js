import positionFinder from "../../src/positionFinder.module.js"
import visualiser from "./visualiser.module.js"


let room  = [ { x: 100, y: 100 }, { x: 400, y: 100 } , 
    { x: 400, y: 400 }, { x: 550, y: 400 }, { x: 550, y: 550 },  { x: 100, y: 550 } ];
let room1  = [ { x: 100, y: 100 }, { x: 600, y: 100 } , 
   { x: 600, y: 500 }, { x: 100, y: 500 } ];


let center = positionFinder.minimumDistPoint( room );
visualiser.draw( center );