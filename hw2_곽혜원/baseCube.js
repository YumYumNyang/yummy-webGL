var indices;
function main()
{
	canvas = document.getElementById("mycanvas");
	gl = canvas.getContext("webgl");

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width  = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 1, 1, 0);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);


	// Create Shaders
	const vs_source = document.getElementById('vertexShader').text;
	const vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vs_source);
	gl.compileShader(vs);
	if ( ! gl.getShaderParameter(vs, gl.COMPILE_STATUS) ) {
		alert( gl.getShaderInfoLog(vs) );
		gl.deleteShader(vs);
	}

	const fs_source = document.getElementById('fragmentShader').text;
	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fs_source);
	gl.compileShader(fs);
	if ( ! gl.getShaderParameter(fs, gl.COMPILE_STATUS) ) {
		alert( gl.getShaderInfoLog(fs) );
		gl.deleteShader(fs);
	}

	prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if ( ! gl.getProgramParameter(prog, gl.LINK_STATUS) ) {
		alert( gl.getProgramInfoLog(prog) );
	}

	// Create a cube
	//    v6----- v5
	//   /|      /|
	//  v1------v0|
	//  | |     | |
	//  | |v7---|-|v4
	//  |/      |/
	//  v2------v3

    var positions = new Float32Array([   // Vertex coordinates
    	// v0-v5-v6-v1 up
    	 1.0, 1.0, 1.0, //v0 1,0 
    	 1.0, 1.0,-1.0, //v5 1,1
    	-1.0, 1.0,-1.0, //v6 0,1
    	-1.0, 1.0, 1.0, //v1 0,0

    	// v0-v1-v2-v3 front 
    	 1.0, 1.0, 1.0, //v0 1,1
    	-1.0, 1.0, 1.0, //v1 0,1
    	-1.0,-1.0, 1.0, //v2 0,0
    	 1.0,-1.0, 1.0, //v3 1,0
   
       // v0-v3-v4-v5 right
       1.0, 1.0,-1.0, //v5 1,1
    	 1.0, 1.0, 1.0, //v0 0,1
       1.0,-1.0, 1.0, //v3 0,0
       1.0,-1.0,-1.0, //v4 1,0
 
       // v5-v6-v7-v4 back
       -1.0, 1.0,-1.0, //v6 1,1
       1.0, 1.0,-1.0, //v5 0,1
       1.0,-1.0,-1.0, //v4 0,0
       -1.0,-1.0, -1.0, //v7 1,0

       // v6-v1-v2-v7 left
       -1.0, 1.0, 1.0, //v1 1,1
       -1.0, 1.0,-1.0, //v6 0,1
       -1.0,-1.0, -1.0, //v7 0,0
    	-1.0,-1.0, 1.0, //v2 1,0

       // v6-v1-v2-v7 bottom
       1.0, -1.0, 1.0, //v3 1,0 
       -1.0, -1.0, 1.0, //v2 0,0
       -1.0, -1.0,-1.0, //v7 0,1
    	 1.0, -1.0,-1.0, //v4 1,1

	]);
	var texCoord = new Float32Array([
		//up
		2.0, 0.0, 
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		//front
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		2.0, 0.0,
		//right
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		2.0, 0.0,
		//back
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		2.0, 0.0,
		//left
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
		2.0, 0.0,
		//bottom
		2.0, 0.0, 
		2.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
	]);

  	var indices = new Uint16Array([       // Indices of the vertices
    	 0, 1, 2,    0, 2, 3,    // up
    	 4, 5, 6,    4, 6, 7,    // front
    	 8, 9, 10,   8, 10, 11,  // right
    	 12, 13, 14, 12, 14, 15,  // back
    	 16, 17, 18,  16, 18, 19,  // left
    	 20, 21, 22,  20, 22, 23,  // bottom
  	]);

	var position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	var texCoord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoord_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW);

	var index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	var posAttribLoc = gl.getAttribLocation(prog, 'pos');
	gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
	gl.vertexAttribPointer(posAttribLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(posAttribLoc);
	
	var texCoordAttrbLoc = gl.getAttribLocation(prog, 'texCoord');
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoord_buffer);
	gl.vertexAttribPointer(texCoordAttrbLoc, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(texCoordAttrbLoc);


	// Create a texture object
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  // Flip the image's y axis
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('textureImg'));
	gl.bindTexture(gl.TEXTURE_2D, null);

	gl.useProgram(prog);
	var wM = gl.getUniformLocation(prog,'worldMat');
	var vM = gl.getUniformLocation(prog,'viewMat');
	var pM = gl.getUniformLocation(prog,'projMat');

	//var u_Sampler = gl.getUniformLocation(prog, 'sampler');

	var worldMatrix = new Matrix4();
	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();

	worldMatrix.setRotate(0,0,1,0);
	viewMatrix.setLookAt(0,5,-8,0,0,0,0,1,0);
	projMatrix.setPerspective(30,1,0.1,100);

	gl.uniformMatrix4fv( wM, false, worldMatrix.elements );
	gl.uniformMatrix4fv( vM, false, viewMatrix.elements );
	gl.uniformMatrix4fv( pM, false, projMatrix.elements );


	var currentAngle = 0.0;
	var loop = function (){
		currentAngle = animate(currentAngle);
		worldMatrix.setRotate(currentAngle, 0, 1, 0);
		gl.uniformMatrix4fv( wM, false, worldMatrix.elements );

		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.activeTexture(gl.TEXTURE0);
		//gl.uniform1i(u_Sampler, 0);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);

	};
	requestAnimationFrame(loop);
}

function setSpeed(){
	var speed = document.getElementById('scaleBar').value;
	ANGLE_STEP = 30.0 * speed;
}

var ANGLE_STEP = 30.0;
var g_last = Date.now();
function animate(angle){
	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;
	var newAngle = angle + (ANGLE_STEP * elapsed) /1000.0;
	return newAngle %= 360;
}