
const positionFinder = {

    maths: {
        distanceTo: function( v1, v2 ) {

            return Math.sqrt( this.distanceToSquared( v1, v2 ) );
            
        },
            
        distanceToSquared: function( v1, v2 ) {
            
            const dx = v1.x - v2.x;
            const dy = v1.y - v2.y;
            
            return dx * dx + dy * dy;
            
        }
    },

    getMeasures: function( points ){
        let xMin = 100000;
        let xMax = -10000;
    
        let yMin = 100000;
        let yMax = -10000;
    
        points.forEach( function( point ){
        xMin = Math.min( xMin, point.x );
        yMin = Math.min( yMin, point.y );
        xMax = Math.max( xMax, point.x );
        yMax = Math.max( yMax, point.y );
        });
    
        let width  = xMax - xMin;
        let height = yMax - yMin;
    
    
        return { width, height, xMin, xMax, yMin, yMax };
    },

    minimumDistPoint: function( room ){

        let height = measures.height;
        let width  = measures.width;
        console.log("H:", height, "w: width", width);
        
        let gridX = 10;
        let gridY = 10;
        
        let stepX = width/gridX;
        let stepY = height/gridY;
        let lPos  = { x: 0, y: 0 };
        let totalDist = 0;
        let totalDistMin = 100000;
        let bestPosition = { x: 0, y:0 };
        let dist;
        
        
        for ( let i = 0; i < stepX; i++ ){
        
        lPos.x = 0 + i*gridX;
        
        for( let j = 0; j < stepY; j++ ){
        
         totalDist = 0;
         lPos.y = 0 + j*gridY;
        
         for( let z = 0; z < room.length ; z++ ){
        
             dist = maths.distanceTo( lPos, room[z] );
             totalDist += dist;
        
         }
        
        
             if ( totalDist < totalDistMin ){
        
                 bestPosition.x = lPos.x;
                 bestPosition.y = lPos.y;
        
                 totalDistMin = totalDist;
        
         }
        
        }
        
        }
        console.log("best Pos: ", bestPosition);
        return bestPosition;
    }

}

export default positionFinder;
