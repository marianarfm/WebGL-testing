var canvas2D;
var canvas3D;
var gl2D;
var gl3D;

//// Variables for the 3D canvas
var program;
// Rotation
var theta = [0.0, 0.0, 0.0];
var thetaLoc;
// Translation
var t = [0.0, 0.0, 0.0];
var tLoc;
// Mouse dragging, last X and Y position
var dragging = false;
var lastX;
var lastY;
// Vertices and colors for the 3D polygon
var vs_vertices = []
var vs_colors = []

window.onload = function init() {
    canvas2D = document.getElementById("gl-canvas2D");
    canvas3D = document.getElementById("gl-canvas3D");
    gl2D = WebGLUtils.setupWebGL(canvas2D);
    gl3D = WebGLUtils.setupWebGL(canvas3D);
    if (!gl2D || !gl3D) alert("WebGL is not available");

    // Initial 2D canvas setup
    gl2D.viewport(0, 0, canvas2D.width, canvas2D.height);
    gl2D.clearColor(0.8, 0.8, 0.8, 1.0);
    gl2D.clear(gl3D.COLOR_BUFFER_BIT | gl2D.DEPTH_BUFFER_BIT);

    // Initial 3D canvas setup
    gl3D.viewport(0, 0, canvas3D.width, canvas3D.height);
    gl3D.clearColor(0.8, 0.8, 0.8, 1.0);
    gl3D.enable(gl3D.DEPTH_TEST);
    gl3D.clear(gl3D.COLOR_BUFFER_BIT | gl3D.DEPTH_BUFFER_BIT);
}

function drawPoints() {
    gl2D.clear(gl2D.COLOR_BUFFER_BIT | gl2D.DEPTH_BUFFER_BIT);

    var vertices = [];

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl2D, "Shaders/points.vert", "Shaders/points.frag");
    gl2D.useProgram(program);
    
    // Load the data into the GPU
    var bufferId = gl2D.createBuffer();
    gl2D.bindBuffer(gl2D.ARRAY_BUFFER, bufferId);
    gl2D.bufferData(gl2D.ARRAY_BUFFER, flatten(vertices), gl2D.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl2D.getAttribLocation(program, "vPosition");
    gl2D.vertexAttribPointer(vPosition, 2, gl2D.FLOAT, false, 0, 0);
    gl2D.enableVertexAttribArray(vPosition);

    canvas2D.addEventListener("click", function(event) {
        var line = posMouse_to_posCanvas(event.clientX, event.clientY, canvas2D);
        vertices.push(line);
    
        // Update the buffer with the new points
        gl2D.bindBuffer(gl2D.ARRAY_BUFFER, bufferId);
        gl2D.bufferData(gl2D.ARRAY_BUFFER, flatten(vertices), gl2D.STATIC_DRAW);
    
        // Redraw the scene with the new points
        gl2D.clear(gl2D.COLOR_BUFFER_BIT | gl2D.DEPTH_BUFFER_BIT);
        gl2D.drawArrays(gl2D.POINTS, 0, vertices.length);
    });
}

function drawLines() {
    gl2D.clear(gl2D.COLOR_BUFFER_BIT | gl2D.DEPTH_BUFFER_BIT);

    var vertices = [];

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl2D, "Shaders/lines.vert", "Shaders/lines.frag");
    gl2D.useProgram(program);
    
    // Load the data into the GPU
    var bufferId = gl2D.createBuffer();
    gl2D.bindBuffer(gl2D.ARRAY_BUFFER, bufferId);
    gl2D.bufferData(gl2D.ARRAY_BUFFER, flatten(vertices), gl2D.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl2D.getAttribLocation(program, "vPosition");
    gl2D.vertexAttribPointer(vPosition, 2, gl2D.FLOAT, false, 0, 0);
    gl2D.enableVertexAttribArray(vPosition);

    canvas2D.addEventListener("click", function(event) {
        var point = posMouse_to_posCanvas(event.clientX, event.clientY, canvas2D);
        vertices.push(point);
    
        // Update the buffer with the new lines
        gl2D.bindBuffer(gl2D.ARRAY_BUFFER, bufferId);
        gl2D.bufferData(gl2D.ARRAY_BUFFER, flatten(vertices), gl2D.STATIC_DRAW);
    
        // Redraw the scene with the new lines
        gl2D.clear(gl2D.COLOR_BUFFER_BIT | gl2D.DEPTH_BUFFER_BIT);
        gl2D.drawArrays(gl2D.LINES, 0, vertices.length);
    });
}

function drawPolygons() {
    // Mouse tracking
    canvas3D.onmousedown = function(event) {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    };

    canvas3D.onmouseup = function(event) {
        dragging = false;
    };

    canvas3D.onmousemove = function(event) {
        if (!dragging) return;
    
        var deltaX = event.clientX - lastX;
        var deltaY = event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;
    
        if (event.shiftKey) {
            // Translation
            t[0] += deltaX * 0.005;
            t[1] -= deltaY * 0.005;
        } else {
            // Rotation
            theta[1] += deltaX * 0.5;
            theta[0] += deltaY * 0.5;
        }
    
        renderPolygons();
    };

    // Draw polygons
    gl3D.clear(gl3D.COLOR_BUFFER_BIT | gl3D.DEPTH_BUFFER_BIT);

    var vertices = [
        vec3(0.25, 0.25, 0.25),
        vec3(-0.25, 0.25, 0.25),
        vec3(-0.25, -0.25, 0.25),
        vec3(0.25, -0.25, 0.25),
        vec3(0.25, 0.25, -0.25),
        vec3(-0.25, 0.25, -0.25),
        vec3(-0.25, -0.25, -0.25),
        vec3(0.25, -0.25, -0.25)
    ];
    
    var faces = [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [3, 7, 4, 0]
    ];
    
    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0), 
        vec4(0.0, 1.0, 0.0, 1.0),  
        vec4(0.0, 0.0, 1.0, 1.0), 
        vec4(1.0, 1.0, 0.0, 1.0), 
        vec4(0.0, 1.0, 1.0, 1.0),
        vec4(1.0, 0.0, 1.0, 1.0)
    ];

    // Creating 3D polygon (cube)
    for(var f=0; f<faces.length; f++) {
        var a = vertices[faces[f][0]]
        var b = vertices[faces[f][1]]
        var c = vertices[faces[f][2]]
        var d = vertices[faces[f][3]]
        var color = colors[f]

        vs_vertices.push(a)
        vs_vertices.push(b)
        vs_vertices.push(c)
        vs_vertices.push(c)
        vs_vertices.push(d)
        vs_vertices.push(a)

        for(var i=0; i<6; i++) vs_colors.push(color)
    }

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl3D, "Shaders/polygons.vert", "Shaders/polygons.frag");
    gl3D.useProgram(program);
    
    // Load the data into the GPU
    var vBuffer = gl3D.createBuffer();
    gl3D.bindBuffer(gl3D.ARRAY_BUFFER, vBuffer);
    gl3D.bufferData(gl3D.ARRAY_BUFFER, flatten(vs_vertices), gl3D.STATIC_DRAW );    
    
    // Associate our shader variables with our data buffer
    var vPosition = gl3D.getAttribLocation(program, "vPosition");
    gl3D.vertexAttribPointer(vPosition, 3, gl3D.FLOAT, false, 0, 0);
    gl3D.enableVertexAttribArray(vPosition);
    
    // Load the data (colors) into the GPU 
    var cBuffer = gl3D.createBuffer();
    gl3D.bindBuffer(gl3D.ARRAY_BUFFER, cBuffer);
    gl3D.bufferData(gl3D.ARRAY_BUFFER, flatten(vs_colors), gl3D.STATIC_DRAW);    
    
    // Associate our shader variables with our data buffer
    var vColor = gl3D.getAttribLocation(program, "vColor");
    gl3D.vertexAttribPointer(vColor, 4, gl3D.FLOAT, false, 0, 0);
    gl3D.enableVertexAttribArray(vColor);
    
    thetaLoc = gl3D.getUniformLocation(program, "theta");
    tLoc = gl3D.getUniformLocation(program, "translation");

    renderPolygons();
}

function renderPolygons() {
    gl3D.clear(gl3D.COLOR_BUFFER_BIT | gl3D.DEPTH_BUFFER_BIT);
    gl3D.uniform3fv(thetaLoc, theta);
    gl3D.uniform3fv(tLoc, t);
    gl3D.drawArrays(gl3D.TRIANGLES, 0, vs_vertices.length);
    requestAnimFrame(renderPolygons);
}

/* Gets the X and Y coordinates of the mouse and converts it
   to the corresponding coordinates of the WebGL canvas.
   
   The mouse event provides coordinates in the screen space 
   (pixels relative to the top-left corner of the canvas) but
   WebGL uses normalized coordinates from -1 to 1 */
function posMouse_to_posCanvas(x, y, canvas) {
    var rect = canvas.getBoundingClientRect();
    var glX = (x-rect.left)/canvas.width*2 - 1;
    var glY = (canvas.height - (y-rect.top))/canvas.height*2 - 1;
    return vec2(glX, glY);
}