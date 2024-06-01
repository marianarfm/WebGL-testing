var canvas;
var gl;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL is not available");

    /* Initial canvas setup. (1) What part of the ouput canvas should be used for drawing;
       (2) setting a background color to be cleared to; (3) clearing color and depth
       buffers for consistent rendering (this way every frame starts as a blank slate). */
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function drawPoints() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertices = [];

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "Shaders/points.vert", "Shaders/points.frag");
    gl.useProgram(program);
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    function convertToWebGLCoords(x, y, canvas) {
        var rect = canvas.getBoundingClientRect();
        var glX = (x - rect.left) / canvas.width * 2 - 1;
        var glY = (canvas.height - (y - rect.top)) / canvas.height * 2 - 1;
        return vec2(glX, glY);
    }

    canvas.addEventListener('click', function(event) {
        var point = convertToWebGLCoords(event.clientX, event.clientY, canvas);
        vertices.push(point);
    
        // Update the buffer with the new points
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
        // Redraw the scene with the new points
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, vertices.length);
    });
}

function drawLines() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertices = [];

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "Shaders/lines.vert", "Shaders/lines.frag");
    gl.useProgram(program);
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    function convertToWebGLCoords(x, y, canvas) {
        var rect = canvas.getBoundingClientRect();
        var glX = (x - rect.left) / canvas.width * 2 - 1;
        var glY = (canvas.height - (y - rect.top)) / canvas.height * 2 - 1;
        return vec2(glX, glY);
    }

    canvas.addEventListener('click', function(event) {
        var point = convertToWebGLCoords(event.clientX, event.clientY, canvas);
        vertices.push(point);
    
        // Update the buffer with the new points
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
        // Redraw the scene with the new points
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, vertices.length);
    });
}

function drawPolygons() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertices = [vec2(-0.5, -0.5), vec2(0, 0.5), vec2(0.5, -0.5)];
    var colors = [vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1)];

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "Shaders/polygons.vert", "Shaders/polygons.frag");
    gl.useProgram(program);
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Repeat the above process for vertices color attributes
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
    // Rendering
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}