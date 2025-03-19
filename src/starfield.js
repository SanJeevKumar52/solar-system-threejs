import {
  Group,
  Color,
  Points,
  Vector3,
  TextureLoader,
  PointsMaterial,
  BufferGeometry,
  AdditiveBlending,
  Float32BufferAttribute,
  Clock,
} from "three";

export class Starfield {
  constructor({ numStars = 1000 } = {}) {
    this.numStars = numStars;
    this.group = new Group();
    this.loader = new TextureLoader();
    this.clock = new Clock();

    this.createStarfield();
    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createStarfield() {
    const positions = new Float32Array(this.numStars * 3);
    const colors = new Float32Array(this.numStars * 3);
    const color = new Color();

    for (let i = 0; i < this.numStars; i++) {
      const { x, y, z, hue } = this.getRandomSpherePoint();
      const index = i * 3;
      
      positions[index] = x;
      positions[index + 1] = y;
      positions[index + 2] = z;

      color.setHSL(hue, 0.6, Math.random() * 0.5 + 0.3); // Slight hue and brightness variation
      colors[index] = color.r;
      colors[index + 1] = color.g;
      colors[index + 2] = color.b;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.15,
      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
      depthWrite: false, // Ensures blending looks good
      map: this.loader.load("/solar-system-threejs/assets/circle.png"),
    });

    this.group.add(new Points(geometry, material));
  }

  getRandomSpherePoint() {
    const radius = Math.random() * 30 + 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1); // Evenly distributed points

    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      hue: 0.55 + Math.random() * 0.05, // Subtle color variation
    };
  }

  createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.animate);
      this.group.rotation.y += this.clock.getDelta() * 0.01; // Smooth & slow rotation
    };
  }

  getStarfield() {
    return this.group;
  }
}
