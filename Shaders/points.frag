precision mediump float;

void main(void) {
    /* Make the points appear smoother by calculating the distance from their center,
       if the distance is greater than the radius the fragment is discarded */
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (dist > 0.5) discard;
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}