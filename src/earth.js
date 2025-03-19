import {
  Mesh,
  AdditiveBlending,
  MeshPhongMaterial,
  MeshStandardMaterial,
  DoubleSide,
} from "three";
import { Planet } from "./planet";

export class Earth extends Planet {
  constructor(props) {
    super(props);

    this.loadTextures();
    this.createPlanetLights();
    this.createPlanetClouds();
  }

  loadTextures() {
    this.earthLightsTexture = this.loader.load(
      "/solar-system-threejs/assets/earth-map-2.jpg"
    );
    this.earthCloudsTexture = this.loader.load(
      "/solar-system-threejs/assets/earth-map-3.jpg"
    );
    this.earthAlphaTexture = this.loader.load(
      "/solar-system-threejs/assets/earth-map-4.jpg"
    );
  }

  createPlanetLights() {
    const planetLightsMaterial = new MeshPhongMaterial({
      map: this.earthLightsTexture,
      emissive: 0xffffcc, // Soft yellow glow for city lights
      emissiveMap: this.earthLightsTexture,
      emissiveIntensity: 1.2,
      blending: AdditiveBlending,
    });

    const planetLightsMesh = new Mesh(
      this.planetGeometry,
      planetLightsMaterial
    );
    this.planetGroup.add(planetLightsMesh);
  }

  createPlanetClouds() {
    const planetCloudsMaterial = new MeshStandardMaterial({
      map: this.earthCloudsTexture,
      transparent: true,
      opacity: 0.6, // Slightly reduced opacity for realism
      blending: AdditiveBlending,
      alphaMap: this.earthAlphaTexture,
      side: DoubleSide, // Ensures visibility from all angles
    });

    const planetCloudsMesh = new Mesh(
      this.planetGeometry,
      planetCloudsMaterial
    );
    planetCloudsMesh.scale.setScalar(1.01); // Slightly increased size for realistic cloud separation

    this.planetGroup.add(planetCloudsMesh);
  }
}
