import * as dat from "../../node_modules/dat.gui/build/dat.gui.module.js";
 
const gui = new dat.GUI();
const debug = {

    set: function( configuration, view ){
        gui.add( configuration, "allowedLights" ).min(1).max(50).step(1);
        gui.add( configuration, "minRadius" ).min(1).max(500).step(1);
        gui.add( configuration, "lightRoomRatio" ).min(0).max(2).step(0.1);

        gui.add( configuration, "checkConstraints" );
        gui.add( configuration, "showAll" );
        gui.add( configuration, "showOutside" );

    }
};

export default debug;