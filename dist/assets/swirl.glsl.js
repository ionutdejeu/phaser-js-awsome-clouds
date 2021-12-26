
---
name: swirl
type: fragment
author: ionut.dejeu
---

precision mediump float;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 2.0 * PI;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;


mat2 rotate2D(float a)
{
    float c = cos(a);
    float s = sin(a);
    return mat2(
        c, -s,
        s, c
    );
}

float smokeBase(vec2 pos)
{
    float v = clamp(pos.x, -1.0, 1.0);
    return 1.0 - exp(-cos(v * PI * 0.5) * smoothstep(0.0, -1.0, pos.y) * 5.0);
}

vec2 swirl(vec2 center, float angle, float radius, vec2 pos)
{
    pos -= center;
    angle *= exp(-length(pos) / radius);
    pos *= rotate2D(angle);
    pos += center;
    return pos;
}

vec2 movingSwirl(vec2 start, vec2 end, float angle, float radius, float frequency, vec2 pos)
{
    float phase = .4;
    angle *= (1.0 - cos(phase * TAU)) * 0.3;
    vec2 center = mix(start, end, phase);
    return swirl(center, angle, radius, pos);
}

vec2 swirls(vec2 pos)
{
    pos = movingSwirl(vec2( 0.0, -1.5), vec2( 0.3, 2.0),  20.0, 0.5, 0.10, pos);
    
    return pos;
}

float smoke(vec2 pos)
{
    pos = swirls(pos);
    return smokeBase(pos);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = 2.0 * (fragCoord.xy - resolution.xy * 0.5) / resolution.y;
    
    float gamma = 2.2;
    
    vec3 bg = vec3(0.5, 0.4, 0.4);
    float smokeWhite = smoke(uv);
    float smokeShadow = smoke(uv + vec2(-0.15, 0.1));
    
    vec3 color = mix(bg * mix(1.0, 0.3, smokeShadow), vec3(1.0), smokeWhite);
    
    gl_FragColor = vec4(pow(color, vec3(1.0 / gamma)), 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}