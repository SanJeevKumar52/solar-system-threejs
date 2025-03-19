import {
  Mesh,
  Color,
  Group,
  DoubleSide,
  RingGeometry,
  TorusGeometry,
  TextureLoader,
  ShaderMaterial,
  SRGBColorSpace,
  AdditiveBlending,
  MeshPhongMaterial,
  MeshBasicMaterial,
  SphereGeometry,
  Clock,
} from "three";

export class Planet {
  constructor({
    orbitSpeed = 0.001,
    orbitRadius = 5,
    orbitRotationDirection = "clockwise",

    planetSize = 1,
    planetAngle = 0,
    planetRotationSpeed = 0.005,
    planetRotationDirection = "clockwise",
    planetTexture = "/solar-system-threejs/assets/mercury-map.jpg",

    rimHex = 0x0088ff,
    facingHex = 0x000000,

    rings = null,
  } = {}) {
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;
    this.orbitRotationDirection = orbitRotationDirection;

    this.planetSize = planetSize;
    this.planetAngle = planetAngle;
    this.planetRotationSpeed = planetRotationSpeed;
    this.planetRotationDirection = planetRotationDirection;
    this.planetTexture = planetTexture;

    this.rings = rings;

    this.group = new Group();
    this.planetGroup = new Group();
    this.loader = new TextureLoader();
    this.clock = new Clock();
    this.planetGeometry = new SphereGeometry(this.planetSize, 64, 64); // Higher resolution for smoothness

    this.createOrbit();
    this.createPlanet();
    this.createGlow(rimHex, facingHex);
    this.createRings();

    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.02, 50, 100);
    const orbitMaterial = new MeshBasicMaterial({ color: 0xadd8e6, side: DoubleSide });
    const orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 2;
    this.group.add(orbitMesh);
  }

  createPlanet() {
    const map = this.loader.load(this.planetTexture);
    map.colorSpace = SRGBColorSpace;

    const planetMaterial = new MeshPhongMaterial({ map });
    const planetMesh = new Mesh(this.planetGeometry, planetMaterial);

    this.planetGroup.add(planetMesh);
    this.planetGroup.position.x = this.orbitRadius;
    this.planetGroup.rotation.z = this.planetAngle;

    this.group.add(this.planetGroup);
  }

  createGlow(rimHex, facingHex) {
    const uniforms = {
      color1: { value: new Color(rimHex) },
      color2: { value: new Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 2.0 },
      fresnelPower: { value: 5.0 },
    };

    const vertexShader = `
      varying float vReflectionFactor;
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
        vec3 viewDir = normalize(worldPosition.xyz - cameraPosition);
        vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(viewDir, worldNormal), fresnelPower);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      varying float vReflectionFactor;

      void main() {
        gl_FragColor = vec4(mix(color2, color1, vec3(clamp(vReflectionFactor, 0.0, 1.0))), vReflectionFactor);
      }
    `;

    const glowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });

    const glowMesh = new Mesh(this.planetGeometry, glowMaterial);
    glowMesh.scale.setScalar(1.1);
    this.planetGroup.add(glowMesh);
  }

  createRings() {
    if (!this.rings) return;

    const innerRadius = this.planetSize + 0.2;
    const outerRadius = innerRadius + this.rings.ringsSize;

    const ringsGeometry = new RingGeometry(innerRadius, outerRadius, 64);
    const ringTexture = this.loader.load(this.rings.ringsTexture);
    ringTexture.colorSpace = SRGBColorSpace;

    const ringsMaterial = new MeshBasicMaterial({
      map: ringTexture,
      side: DoubleSide,
      transparent: true,
    });

    const ringMesh = new Mesh(ringsGeometry, ringsMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    this.planetGroup.add(ringMesh);
  }

  createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();

      this.updateOrbitRotation(delta);
      this.updatePlanetRotation(delta);
    };
  }

  updateOrbitRotation(delta) {
    const direction = this.orbitRotationDirection === "clockwise" ? -1 : 1;
    this.group.rotation.y += direction * this.orbitSpeed * delta * 60;
  }

  updatePlanetRotation(delta) {
    const direction = this.planetRotationDirection === "clockwise" ? -1 : 1;
    this.planetGroup.rotation.y += direction * this.planetRotationSpeed * delta * 60;
  }

  getPlanet() {
    return this.group;
  }
}
