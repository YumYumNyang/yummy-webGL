var gl;
function main()
{
	canvas = document.getElementById("mycanvas");
	gl = canvas.getContext("webgl");

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width  = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0,1.0,1.0,0.0);
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


  positions = [];
  normals = [];
  indices = [];
  var sphere = createSphere();
  positions = new Float32Array(sphere.positions);
  normals = positions;
  indices = new Uint16Array(sphere.indices);


	var position_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	var normal_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

	var index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	var posAttribLoc = gl.getAttribLocation(prog, 'pos');
	gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
	gl.vertexAttribPointer(posAttribLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(posAttribLoc);
	
	var normalAttribLoc = gl.getAttribLocation(prog,'normal');
	gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
	gl.vertexAttribPointer(normalAttribLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalAttribLoc);

	var worldMatrix = new Matrix4();
	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();
	var nMatrix = new Matrix4();
	var eyePos = new Vector3([0.0, 5.0, -8.0]);
	var lightDirection = new Vector3([5.0,5.0,-8.0]);

	worldMatrix.setIdentity();
	viewMatrix.setLookAt(eyePos.elements[0],eyePos.elements[1],eyePos.elements[2],0,0,0,0,1,0);
	projMatrix.setPerspective(30,1,0.1,100);
	nMatrix.setInverseOf(worldMatrix);
	nMatrix.transpose();

	gl.useProgram(prog);
	var wM = gl.getUniformLocation(prog,'worldMat');
	var vM = gl.getUniformLocation(prog,'viewMat');
	var pM = gl.getUniformLocation(prog,'projMat');
	var nM = gl.getUniformLocation(prog,'normalMat');
	var uEye = gl.getUniformLocation(prog, 'eyePos');
	var uLightDir = gl.getUniformLocation(prog, 'lightDir');

	gl.uniformMatrix4fv( wM, false, worldMatrix.elements );
	gl.uniformMatrix4fv( vM, false, viewMatrix.elements );
	gl.uniformMatrix4fv( pM, false, projMatrix.elements );
	gl.uniformMatrix4fv( nM, false, nMatrix.elements );
	gl.uniform3fv(uEye, eyePos.elements);

	// HW3: set uniform variables for shaders for Phong lighting
	// TODO here


	var currentAngle = 0.0;
	var loop = function (){
		currentAngle = animate(currentAngle);
		var rotateM = new Matrix4();
		rotateM.setRotate(currentAngle, 0,1,0);
		rotatedLight = rotateM.multiplyVector3(lightDirection);
		gl.uniform3fv(uLightDir, rotatedLight.elements);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
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

function createSphere() { // Create a sphere
  var SPHERE_DIV = 23;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var positions = [];
  var indices = [];

  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj);  // X
      positions.push(cj);       // Y
      positions.push(ci * sj);  // Z
    }
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }
  return {
  	positions: positions,
  	indices: indices
  };
}