/*
findLightPositions3: function( ecken ){

    let measures = this.getMeasures( ecken );
    let scope = this;

    
    let height = measures.height;
    let width  = measures.width;
    
    let grid = { x: 10, y: 10 };
    let radius= 300;

    let stepX = width/grid.x;
    let stepY = height/grid.y;
    let distance;

    let lightPos     = new THREE.Vector2( 0, 0 );

    

    let occupancy = 1;
    let maxOccupancy = 0;

    let positions = [], intenitys = [];
    let results = [];

    let findEdges = function( edges, res, callback ){
       
        let rest = [];
        let used = [];

        let lastUsed = [];
        let notUsed  = [];


        for ( let i = 0; i < stepX; i++ ){
    
            lightPos.x = 0 + i*grid.x;
        
            for( let j = 0; j < stepY; j++ ){
                
                lightPos.y = 0 + j*grid.y;
        
                edges.forEach( function( edge, index ){
                    
                    distance = lightPos.distanceTo( edge );

                    if ( distance > radius ){ // if edge distance bigger than radius
                        rest.push( index );
                        occupancy =  1 - ( rest.length / edges.length );
                    } else{
                        used.push( index );
                    }
                });

                if (  occupancy >= maxOccupancy ){
                    maxOccupancy = occupancy;
                    notUsed = rest;
                    lastUsed = used;
                    
                }
        
                rest = [];
                used = [];
                occupancy = 1;
            
            }
        
        
        }

        res.push( lastUsed );

        if ( notUsed.length > 2 ){
            findEdges( notUsed, res, callback );
        } else {
            callback( res );
            return res;
        }
    }

    let afterwork = function( rects ){
        let bbox =[];
        rects.forEach( function( indexes ){
            if ( indexes.length === 1 || indexes.length === 2 ){ // if only two edges take naighbour edge

                if ( indexes[0] === 0 ){
                    indexes.push( _.last( indexes ) + 1 ); 
                } else {
                    // search for smallest distance naighbour
                    indexes.unshift( indexes[0] - 1 ); 
                }
            } 

            let measures = scope.getMeasures( scope.filterArray( ecken, indexes ) );

        });
        //console.log("rectse", rects);

       
    };

    let rects = findEdges( ecken, results, afterwork );
    
    return rects;
   // return  { x:300, y:300 };

   // this.debugPos( new THREE.Vector3( bestPosition.x, 200, bestPosition.y) )

},

filterArray: function( base, indexes ){
    return indexes.map( function ( index ) {
        return base[index];
    });
},

getCenters: function( ecken, rects ){
   // console.log( "base ", ecken, rects);

    let scope = this;
    let centers = [];

    rects.forEach( function( rect ){
        
        let measures = scope.getMeasures( scope.filterArray( ecken, rect) );
        centers.push( measures.center );
    });

    return centers;
},

minimumDistPoint: function( room ){

    let measures = this.getMeasures( room );

    let height = measures.height;
    let width  = measures.width;
    
    let gridX = 10;
    let gridY = 10;
    
    let stepX = width/gridX;
    let stepY = height/gridY;
    let lPos  = { x: 0, y: 0 };
    let totalDist = 0;
    let totalDistMin = 100000;
    let bestPosition = { x: 0, y:0 };
    let dist;
    let dist2;

    let totalDist2 = 0;
    let totalDistMin2 = 100000;
    
    for ( let i = 0; i < stepX; i++ ){
    
        lPos.x = 0 + i*gridX;
        
        for( let j = 0; j < stepY; j++ ){
        
            totalDist = 0;
            totalDist2 = 0;
            lPos.y = 0 + j*gridY;
        
        for( let z = 0; z < room.length ; z++ ){
        
            dist = this.maths.distanceTo( lPos, room[z] );
            totalDist += dist;
                        
            if ( z === room.length - 1 ){
                dist2 = this.maths.closestToSegment( lPos, room[z], room[0] );
            } else {
                dist2 = this.maths.closestToSegment( lPos, room[z], room[z+1] );
            }
            if ( dist2 < 150 ) dist2 = 1000;
            totalDist2 += dist2;
        
     }
    
    
         if ( totalDist2 < totalDistMin2 ){
    
             bestPosition.x = lPos.x;
             bestPosition.y = lPos.y;
    
             totalDistMin2 = totalDist2;
    
     }
    
    }
    
    }
   // console.log("best Pos: ", bestPosition);
    return bestPosition;
},

minimumDistPointEdges: function( room ){

    let measures = this.getMeasures( room );

    let height = measures.height;
    let width  = measures.width;
    
    let gridX = 10;
    let gridY = 10;
    
    let stepX = width/gridX;
    let stepY = height/gridY;
    let lPos  = { x: 0, y: 0 };
    let totalDist = 0;
    let totalDistMin = 100000;
    let bestPosition = { x: 0, y:0 };
    let dist;
    let dist2;
    let inside = true;
    
    for ( let i = 0; i < stepX; i++ ){
    
    lPos.x = 0 + i*gridX;
    
    for( let j = 0; j < stepY; j++ ){
    
     totalDist = 0;
     lPos.y = 0 + j*gridY;
    
     for( let z = 0; z < room.length ; z++ ){
    
        dist = this.maths.distanceTo( lPos, room[z] );
        
        if ( z === room.length - 1 ){
            dist2 = this.maths.closestToSegment( lPos, room[z], room[0] );
        } else {
            dist2 = this.maths.closestToSegment( lPos, room[z], room[z+1] );
        }
        inside = this.maths.inside( lPos, room ); 

        
        if ( dist2 < 100 || !inside ) dist += 2000;
        
        
        totalDist += dist;
     }
    
         if ( totalDist < totalDistMin ){
             bestPosition.x = lPos.x;
             bestPosition.y = lPos.y;
    
             totalDistMin = totalDist;
    
     }
    
    }
    
    }
   // console.log("best Pos: ", bestPosition);
    return bestPosition;
        // depricated,
    findCandidatesOld: function( circles, measures ){
        this.findCandidates2( circles, measures );
        let list = [];

        let roomDiagonale = Math.sqrt( measures.width*measures.width + measures.height*measures.height );
        circles.sort((a, b) => parseFloat(b.radius) - parseFloat(a.radius));
        let dist = 0;
        let biggest = circles[ 0 ];
        list.push( biggest );

        if ( roomDiagonale/1.5 > biggest.radius*2 ){
            for( let i = 1; i< circles.length; i++ ){
                dist = this.maths.distanceTo( biggest.position, circles[i].position );
    
                if ( dist >= biggest.radius + circles[i].radius ){
                    list.push( circles[i] );
                    break;
                }
            }
        }
        this.getLightRatio( measures, list );
        
        //console.log("circles: ", list, roomDiagonale, biggest.radius);

        return list;
    } 
}