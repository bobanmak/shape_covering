
const visualiser = {
    setup: function() {
        createCanvas(800, 800);
    }, 
      
    draw: function( room ) {
        
        background(220);
        //visualisePoints( room );
        this.visualiseLines( room );
        
        this.visualisePoints( minimumDistPoint( room ) );
        
    },
      
    visualisePoints: function( points ){
        if ( !Array.isArray( points ) ) points = [ points ];
        
        points.forEach( ( edge) =>{
            stroke('red'); // Change the color
            strokeWeight(5); // Make the points 10 pixels in size
            point( edge.x, edge.y);
        });
    },
      
    visualiseLines: function( points ){
        points.forEach( ( edge , index ) =>{
              
          stroke('purple'); // Change the color
          strokeWeight(5); // Make the points 10 pixels in size
      
          if ( index === points.length - 1 ){
            line( edge.x, edge.y, points[0].x, points[0].y)
          }
          else {
            line( edge.x, edge.y, points[index+1].x, points[index+1].y);
          }
      
          
        });
      }

};

export default visualiser;
