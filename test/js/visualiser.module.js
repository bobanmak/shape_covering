  const visualiser = function( room, center ){
    this.points = room;
    this.center = center;
    console.log(this);
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
      }

      s.draw = () => {
          s.background(220);
          s.visualiseLines( s.points );
          s.visualisePoints( s.center );

      }

      s.visualisePoints = ( points ) => {
        if ( !Array.isArray( points ) ) points = [ points ];
          
        points.forEach( ( edge) =>{
            s.stroke('red'); // Change the color
            s.strokeWeight(5); // Make the points 10 pixels in size
            s.point( edge.x, edge.y);
        });   
      }

      s.visualiseLines = ( points ) => {
        points.forEach( ( edge , index ) =>{
                
          s.stroke('purple'); // Change the color
          s.strokeWeight(5); // Make the points 10 pixels in size
      
          if ( index === points.length - 1 ){
            s.line( edge.x, edge.y, points[0].x, points[0].y)
          }
          else {
            s.line( edge.x, edge.y, points[index+1].x, points[index+1].y);
          }
      
          
        });
      }
    } 

});



export default visualiser;
