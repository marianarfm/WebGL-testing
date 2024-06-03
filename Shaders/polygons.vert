attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;
uniform vec3 theta;
uniform vec3 translation;

void main() {
    // Rotation around the X,Y and Z axis
    vec3 theta_radians = radians(theta);
    vec3 c = cos(theta_radians);
    vec3 s = sin(theta_radians);
    mat4 Rx = mat4(1, 0, 0, 0,
                  0, c.x, -s.x, 0,
                  0, s.x, c.x, 0,
                  0, 0, 0, 1);
    mat4 Ry = mat4(c.y, 0, s.y, 0,
                  0, 1, 0, 0,
                  -s.y, 0, c.y, 0,
                  0, 0, 0, 1);
    mat4 Rz = mat4(c.z, -s.z, 0, 0,
                  s.z, c.z, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1);
    
    mat4 R = Rx*Ry*Rz;
    
    // Translation
    mat4 T = mat4(1.0, 0.0, 0.0, 0.0,
                  0.0, 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0, 0.0,
                  translation.x, translation.y, translation.z, 1.0);
    
    fColor = vColor;
    gl_Position = T*R*vPosition;
}