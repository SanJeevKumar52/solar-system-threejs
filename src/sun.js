import {
  Mesh,
  Group,
  Color,
  SphereGeometry,
  BackSide,
  PointLight,
  TextureLoader,
  ShaderMaterial,
  AdditiveBlending,
  MeshBasicMaterial,
  Clock,
} from "three";

export class Sun {
  constructor() {
    this.sunTexture = "/solar-system-threejs/assets/sun-map.jpg";
    this.group = new Group();
    this.loader = new TextureLoader();
    this.clock = new Clock();

    this.createSun();
    this.createCorona();
    this.createGlow();
    this.addLighting();
    this.animate();
  }

  createSun() {
    const map = this.loader.load(this.sunTexture);
    const sunGeometry = new SphereGeometry(5, 64, 64);
    
    // Shader for animated texture (simulates plasma movement)
    const sunMaterial = new ShaderMaterial({
      uniforms: {
        texture1: { value: map },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture1;
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          uv.x += sin(time * 0.3) * 0.02; // Horizontal plasma movement
          uv.y += cos(time * 0.3) * 0.02; // Vertical plasma movement
          gl_FragColor = texture2D(texture1, uv);
        }
      `,
    });

    this.sunMesh = new Mesh(sunGeometry, sunMaterial);
    this.group.add(this.sunMesh);
  }

  createCorona() {
    const coronaGeometry = new SphereGeometry(5.3, 64, 64);
    this.coronaMaterial = new MeshBasicMaterial({
      color: 0xff5500,
      side: BackSide,
      transparent: true,
      opacity: 0.4,
    });
    this.coronaMesh = new Mesh(coronaGeometry, this.coronaMaterial);
    this.group.add(this.coronaMesh);
  }

  createGlow() {
    const glowGeometry = new SphereGeometry(5.6, 64, 64);
    const glowMaterial = new ShaderMaterial({
      uniforms: {
        color1: { value: new Color(0xff4400) },
        color2: { value: new Color(0xffaa00) },
        fresnelBias: { value: 0.2 },
        fresnelScale: { value: 2.5 },
        fresnelPower: { value: 3.0 },
      },
      vertexShader: `
        varying float vReflectionFactor;
        void main() {
          vec3 worldNormal = normalize( normalMatrix * normal );
          vec3 I = normalize( vec3(modelViewMatrix * vec4(position, 1.0)) );
          vReflectionFactor = dot( worldNormal, I );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying float vReflectionFactor;
        void main() {
          float f = clamp( vReflectionFactor, 0.0, 1.0 );
          gl_FragColor = vec4(mix(color2, color1, f), f * 0.8);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
    });

    this.glowMesh = new Mesh(glowGeometry, glowMaterial);
    this.group.add(this.glowMesh);
  }

  addLighting() {
    this.sunLight = new PointLight(0xffaa00, 1800, 80);
    this.sunLight.position.set(0, 0, 0);
    this.group.add(this.sunLight);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    const time = this.clock.getElapsedTime();
    this.sunMesh.material.uniforms.time.value = time;

    // Pulsating corona effect
    this.coronaMaterial.opacity = 0.4 + Math.sin(time * 2) * 0.1;
    
    // Flickering light effect
    this.sunLight.intensity = 1800 + Math.sin(time * 5) * 100;
  };

  getSun() {
    return this.group;
  }
}
