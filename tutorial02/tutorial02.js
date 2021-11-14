function main(){
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);


  // Get the rendering context for WebGL

  if(!gl){
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  //var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  //Set clear color
  gl.clearColor(0.0,0.0,0.0,1.0);

  //Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}