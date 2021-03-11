define(['exports'], function (exports) { 'use strict';

    // all units are in cm

    const defaults = {
        grid: {
            x: 10,
            y: 10
        },
        allowedLights: 6,
        minRadius: 40,
        showOutside: true,
        checkConstraints: false,
        showAll: false,
        lightRoomRatio: 0.9
    };

    const positionFinder = function( opts ){
        this.options = Object.assign( {}, defaults, opts ); 
        console.log("PositionFinder Options: ", this.options );
    };

    positionFinder.prototype = Object.assign({ 

        constructor: positionFinder,

        maths: {
            distanceTo: function( v1, v2 ) {

                return Math.sqrt( this.distanceToSquared( v1, v2 ) );
                
            },
                
            distanceToSquared: function( v1, v2 ) {
                
                const dx = v1.x - v2.x;
                const dy = v1.y - v2.y;
                
                return dx * dx + dy * dy;
                
            },

            clone: function ( v ) {
                return { x: v.x, y: v.y }  
            },

            lerp: function ( v1, v2, alpha ) {
                
                v1.x += ( v2.x - v1.x ) * alpha ;
                v1.y += ( v2.y - v1.y ) * alpha ;
                return v1;

            },

            lengthSq: function (v) {
                return v.x * v.x + v.y * v.y;
            },

            dot: function( v1, v2 ){
                return v1.x * v2.x + v1.y * v2.y;
            },

            sub: function ( v1, v2 ) {
                
                v1.x = v1.x - v2.x ;
                v1.y = v1.y - v2.y ;

                return v1;

            },

            closestToSegment: function (p, la, lb) {
                let point = this.clone( p );
                let a     = this.clone( la );
                let b     = this.clone( lb );

                let ba = this.sub( this.clone( b ), a );
                let t = this.dot( this.sub( point, a ), ba ) / this.lengthSq( ba );

                let res = this.lerp( a, b, Math.min(Math.max(t, 0), 1));
                return this.distanceTo( res, p);
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
                    if (intersect) { inside = !inside; }
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
            let center = { x: height/2 + yMin, y: width/2 + xMin  };

        
            return { width: width, height: height, xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, center: center };
        },

        fillCircles: function( room, constraints ){

            let measures = this.getMeasures( room );
            let opts = this.options;

            let height = measures.height;
            let width  = measures.width;
            
            let stepX = width / opts.grid.x;
            let stepY = height / opts.grid.y;
            let lPos  = { x: 0, y: 0 };
            
            let smallestSide = 10000;
            let dist2;
            let circles = [];
            let inside = true;
            
            for ( let i = 0; i < stepX; i++ ){
            
            lPos.x = measures.xMin + i*opts.grid.x;
            
                for( let j = 0; j < stepY; j++ ){
                    smallestSide = 10000;
                    lPos.y = measures.yMin + j*opts.grid.y;
                    
                    if ( !opts.showOutside ){
                        inside = this.maths.inside( lPos, room ); 
                        if ( !inside ) { continue; }
                    }
                    
                    // check room
                    for( let z = 0; z < room.length ; z++ ){
                        
                        if ( z === room.length - 1 ){
                            dist2 = this.maths.closestToSegment( { x:lPos.x, y:lPos.y }, room[z], room[0] );
                        } else {
                            dist2 = this.maths.closestToSegment( { x:lPos.x, y:lPos.y }, room[z], room[z+1] );
                        }

                        if ( dist2 < smallestSide ){
                            smallestSide = dist2;
                        }
                    
                    }


                    // check constraints
                    if ( opts.checkConstraints ){
                        constraints.forEach( (constraint) => {
                            for( let z2 = 0; z2 < constraint.length ; z2++ ){
                            
                                if ( z2 === constraint.length - 1) { break; }
            
                                dist2 = this.maths.closestToSegment( { x:lPos.x, y:lPos.y }, constraint[z2], constraint[z2+1] );
                        
            
                                if ( dist2 < smallestSide ){
                                    smallestSide = dist2;
                                }
                            
                            }
                        });
                    }
                    
                    if ( smallestSide > opts.minRadius ){
                        circles.push( { position: { x:lPos.x, y:lPos.y }, radius: smallestSide});

                    }
                    
                
                }
            }

             if ( opts.showAll ) { return circles; }
             return this.findCandidates( circles, measures );
        },

        getLightRatio: function( measures, lights ){
            let roomDiagonale = Math.sqrt( measures.width*measures.width + measures.height*measures.height );
            let radiusSam = lights.map( item => item.radius ).reduce((prev, next) => prev + next);

            let ratio =  radiusSam*2 / roomDiagonale ; // maybe something better?
            // console.log("lights ratio: ", ratio );
            return ratio;
        },

        sortByRadius: function( candidates ){
            return candidates.sort((a, b) => parseFloat(b.radius) - parseFloat(a.radius));
        },

        findCandidates: function( circles, measures ){

            let lights = this.sortByRadius( circles );
            let opts = this.options;
            let candidates = [];
            let lightRatio = 0;

            for( let i = 1; i< lights.length; i++ ){

                if ( opts.allowedLights < 1 ) { return; }

                if ( candidates.length === 0 ){
                    lightRatio = this.getLightRatio( measures, [ lights[i] ] );
                    if ( lightRatio >= opts.lightRoomRatio ) { continue; }

                    candidates.push( lights[i] ); // first and biggest
                    continue;
                } 

                lightRatio = this.getLightRatio( measures, candidates );

                if ( lightRatio >= opts.lightRoomRatio || candidates.length ===  opts.allowedLights ) { break; }

                if ( this.checkDistanceToAll( candidates, lights[i] ) ) { candidates.push( lights[i]); }

            }

            //console.log("cand: ", candidates);
            return candidates;
        },
        checkDistanceToAll: function( candidates, light ){
            
            let dist = 0;
            
            for ( let j = 0; j < candidates.length; j++ ){
                    
                dist = this.maths.distanceTo( candidates[j].position, light.position );

                if ( dist < candidates[j].radius + light.radius ) { return false; }
            }
            return  true;
        } 
    });

    exports.default = positionFinder;

    Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=shapeTools.amd.js.map
