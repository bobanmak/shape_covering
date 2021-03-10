import * as THREE from "../node_modules/three/build/three.module.js";

const positionFinder = {

    maths: {
        distanceTo: function( v1, v2 ) {

            return Math.sqrt( this.distanceToSquared( v1, v2 ) );
            
        },
            
        distanceToSquared: function( v1, v2 ) {
            
            const dx = v1.x - v2.x;
            const dy = v1.y - v2.y;
            
            return dx * dx + dy * dy;
            
        },
         // Stupid lack of operator overloading, this looks so dumb
        closestToSegment: function (p, la, lb) {
            let point = new THREE.Vector2( p.x, p.y );
            let a     = new THREE.Vector2( la.x, la.y );
            let b     = new THREE.Vector2( lb.x, lb.y );

            let ba = b.clone().sub(a);
            let t = point.clone().sub(a).dot(ba) / ba.lengthSq();

            let res = a.clone().lerp(b, Math.min(Math.max(t, 0), 1));
            return this.distanceTo( res, p);
        },

        intersectionWalls : function ( a1, e1, a2, e2 ) {
  
            let b1 = new THREE.Vector2().copy(e1);
            b1.sub( a1 );

            let b2 = new THREE.Vector2().copy(e2);
            b2.sub( a2 );

            let s1 = a1.x * b1.y - a1.y * b1.x ;
            let s2 = a2.x * b1.y - a2.y * b1.x ;
            let d  = b2.x * b1.y - b2.y * b1.x ;  // determinant
            let mu = (s1-s2) / d;

            let schnittPunkt = new THREE.Vector2().copy( b2 ).multiplyScalar( mu ).add( a2 );
            console.log("schnittPunkt: ", schnittPunkt );

            return schnittPunkt;
        },

        inside: function(point, vs) {
            // https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon
            // ray-casting algorithm based on
            // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
            
            let x = point.x, y = point.y;
            
            let inside = false;
            for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                let xi = vs[i].x, yi = vs[i].y;
                let xj = vs[j].x, yj = vs[j].y;
                
                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
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
        let center = new THREE.Vector2( height/2 + yMin, width/2 + xMin  );

    
        return { width, height, xMin, xMax, yMin, yMax, center };
    },

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
    }

}

export default positionFinder;
