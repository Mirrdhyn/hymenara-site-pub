const e={ruisseau:1,tronc:1,pont:.45,cercle:.35};export function relief(t,n,r){let i=Object.keys(e),a=i[Math.floor(Math.random()*i.length)],o=e=>`${r}fond/${e}.webp`;n.src=o(a);let s=matchMedia(`(prefers-reduced-motion: reduce)`).matches?null:t.getContext(`webgl2`,{antialias:!1,alpha:!1});if(!s)return;let c=(e,t)=>{let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n},l=s.createProgram();if(s.attachShader(l,c(s.VERTEX_SHADER,`#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`)),s.attachShader(l,c(s.FRAGMENT_SHADER,`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uImg, uDepth, uMask, uWater;
uniform vec2 uCam, uCover;
uniform float uTime;
const float FOCUS = 0.78;
const float ZOOM = 1.07;
float curve(float d) { return d * d; }
void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  uv = 0.5 + (uv - 0.5) * uCover / ZOOM;
  vec2 p = uv;
  for (int i = 0; i < 12; i++) p = mix(p, uv - uCam * (curve(texture(uDepth, p).r) - FOCUS), 0.55);
  vec3 c = texture(uImg, p).rgb;
  vec3 w = texture(uWater, p * vec2(4.0, 3.0) + vec2(-uTime * 0.012, uTime * 0.02)).rgb;
  c += texture(uMask, p).r * w * vec3(0.30, 0.26, 0.16);
  outColor = vec4(c, 1.0);
}`)),s.linkProgram(l),!s.getProgramParameter(l,s.LINK_STATUS))return;s.useProgram(l);let u=e=>s.getUniformLocation(l,e),d=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,d),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),s.STATIC_DRAW);let f=s.getAttribLocation(l,`aPos`);s.enableVertexAttribArray(f),s.vertexAttribPointer(f,2,s.FLOAT,!1,0,0);let p=(e,t,n)=>new Promise((r,i)=>{let a=new Image;a.onload=()=>{s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,s.createTexture()),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,a),s.generateMipmap(s.TEXTURE_2D),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR_MIPMAP_LINEAR);let e=n?s.REPEAT:s.CLAMP_TO_EDGE;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,e),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,e),r()},a.onerror=i,a.src=e}),m=[[`uImg`,o(a),!1],[`uDepth`,o(`${a}_profondeur`),!1],[`uMask`,o(`${a}_eau`),!1],[`uWater`,o(`eau`),!0]],h={x:0,y:0},g={x:0,y:0};addEventListener(`pointermove`,e=>{h.x=e.clientX/innerWidth*2-1,h.y=e.clientY/innerHeight*2-1}),Promise.all(m.map(([,e,t],n)=>p(e,n,t))).then(()=>{m.forEach(([e],t)=>s.uniform1i(u(e),t)),t.classList.add(`on`);let n=performance.now(),r=i=>{let o=Math.min(.1,(i-n)/1e3),c=i/1e3;n=i;let l=Math.min(1.5,devicePixelRatio),d=Math.round(t.clientWidth*l),f=Math.round(t.clientHeight*l);(t.width!==d||t.height!==f)&&(t.width=d,t.height=f),s.viewport(0,0,d,f);let p=d/f,m=16/9;s.uniform2f(u(`uCover`),p>m?1:p/m,p>m?m/p:1);let _=1-Math.exp(-o*2);g.x+=(h.x-g.x)*_,g.y+=(h.y-g.y)*_;let v=e[a];s.uniform2f(u(`uCam`),(.028*Math.sin(c*.21)+.018*g.x)*v,(.012*Math.sin(c*.33)+.012*g.y)*v),s.uniform1f(u(`uTime`),c),s.drawArrays(s.TRIANGLE_STRIP,0,4),requestAnimationFrame(r)};requestAnimationFrame(r)}).catch(()=>{})}