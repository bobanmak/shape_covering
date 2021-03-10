  const visualiser = function( room, center ){

  };

  Object.assign( visualiser.prototype, {

    
    addPoints: ( points ) => {
      this.points = points;
    },
    
    addCenter: ( center ) => {
      this.center = center;
    },    
    
    sketch: function( s ){

      s.points = [];
      s.center = [];
      s.setup = () => {
        
        s.createCanvas(800, 800);
        s.background(220);
        s.draw_allowed = true;

      }

      s.draw = () => {
          s.background(220);

          if ( s.draw_allowed ){
            s.points.forEach( ( edge , index ) =>{
              if (s[ "draw_" + index ]) {
                edge.x = s.mouseX;
                edge.y = s.mouseY;
              }
            });
          }
          
          s.visualiseLines( s.points );
          s.visualisePoints( s.center );
          s.visualiseTestLines( s.points );

          if ( s.rects ) s.visualiseRectangles( s.rects, s.points );

      }

      s.visualisePoints = ( points ) => {
        if ( !Array.isArray( points ) ) points = [ points ];
          
        points.forEach( ( edge) =>{
            s.stroke('red'); // Change the color
            s.strokeWeight(5); // Make the points 10 pixels in size
            s.point( edge.x, edge.y);
        });   
      }

      s.visualiseTestLines = ( points ) => {
        s.stroke('grey'); // Change the color
        s.strokeWeight(2); // Make the points 10 pixels in size
    
        points.forEach( ( edge , index ) =>{
            
            s.line( s.center.x, s.center.y, edge.x, edge.y);

        });
      }

      s.visualiseLines = ( points, opts ) => {
        
        let color = opts && opts.color ? opts.color : 'purple'; 
        let strokeWeight = opts && opts.strokeWeight ? opts.strokeWeight : 5; 

        s.stroke( color ); // Change the color
        s.strokeWeight(strokeWeight); // Make the points 10 pixels in size
    
        points.forEach( ( edge , index ) =>{
                
          if ( index === points.length - 1 ){
            s.line( edge.x, edge.y, points[0].x, points[0].y)
          }
          else {
            s.line( edge.x, edge.y, points[index+1].x, points[index+1].y);
          }
      
          
        });
      }

      s.visualiseRectangles = ( rects, room ) => {
        let visuelList = [];
        rects.forEach( ( rect  ) =>{

            for ( let i = 0; i < rect.length ; i ++ ){
              visuelList.push( room[ rect[i] ] );
            }


        });

        s.visualiseLines( visuelList, { color:'red', strokeWeight:2 })

      }


      s.mousePressed = function(){
        s.draw_allowed = true;
        s.points.forEach( ( edge , index ) =>{
          s[ "d" + index ] = s.dist( edge.x, edge.y, s.mouseX, s.mouseY);
        });
      }

      s.mouseDragged = function() {

        for ( let i = 0; i < s.points.length; i++ ){
          if (  s[ "d" + i ] < 10 ) {
            s[ "draw_" + i ] = true;
            return;
          } 
        }
        
      }

      s.mouseReleased = function() {
        s.draw_allowed = false;
        s.points.forEach( ( edge , index ) =>{
          s[ "draw_" + index ] = false; 
        });
      }
    } 

});



export default visualiser;
