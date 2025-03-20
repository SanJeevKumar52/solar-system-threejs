### Solar System Simulation with Three.js
This project is a 3D simulation of the solar system built using Three.js. It features realistic planets, a dynamic sun, a starfield background, and interactive camera controls. The simulation includes planets like Earth, Mars, Jupiter, and Saturn, complete with textures, orbits, and rotation animations.

## Assets
Mistry all textures textures were taken from Planetary Pixel Emporium site, the the exception are only planets rings and stars texture. I'm sure there are plenty different and better textures around the internet so feel free to replace them as you see fit

## Features

# Realistic Planets:
1. Each planet has unique textures, sizes, and rotation speeds.
2. Earth includes city lights and a cloud layer.
3. Saturn and Uranus have rings.

# Dynamic Sun:
1. Animated plasma texture.
2. Corona and glow effects.
3. Point light for illumination.

# Starfield Background:
1. Randomly distributed stars with subtle color variations.
2. Smooth rotation for a dynamic effect.

# Interactive Controls:
Use the mouse to rotate, zoom, and pan the camera.

# Responsive Design:
Adjusts to the browser window size.


## Setup
# Prerequisites
1. Node.js (for local development)
2. A modern web browser (Chrome, Firefox, Edge, etc.)

### Installation
# Clone the repository:
1. git clone 
2. cd solar-system-threejs

### Install dependencies:
1. If you're using a package manager like npm or yarn, install the required dependencies:
npm install

2. Run a local server:
npm run dev

### How the Solar System's Movement is Implemented

1. **Orbital Math**
   - Each planet orbits the sun by rotating around the Y-axis of the scene.
   - The `orbitSpeed` property determines how fast a planet orbits.
   - The `orbitRadius` property determines the distance from the sun.
   - The `orbitRotationDirection` property determines the direction of orbit (clockwise or counterclockwise).

2. **Rotation Logic**
   - Each planet rotates on its own axis using the `planetRotationSpeed` property.
   - The `planetRotationDirection` property determines the direction of rotation.

3. **Animation Loop**
   - The `requestAnimationFrame` function is used to create a smooth animation loop.
   - In each frame:
     - The planet's orbit and rotation are updated.
     - The scene is re-rendered.
  
## Challenges and Solutions

### Challenge 1: Realistic Planet Textures
- **Problem:** Finding high-quality textures for planets and ensuring they align correctly with the 3D geometry.
- **Solution:** Used textures from Solar System Scope and adjusted UV mapping in Three.js.

### Challenge 2: Smooth Camera Controls
- **Problem:** The camera controls felt jerky and unresponsive.
- **Solution:** Used OrbitControls from Three.js and fine-tuned the `minDistance`, `maxDistance`, and `damping` properties.

### Challenge 3: Performance Optimization
- **Problem:** The simulation was slow on low-end devices.
- **Solution:** Reduced the resolution of textures and optimized shaders.

## Code Overview
### Key Classes

- **Planet:**
  - Base class for creating planets.
  - Handles orbit, rotation, and textures.
  - Supports rings (e.g., Saturn).

- **Earth:**
  - Extends `Planet`.
  - Adds city lights and a cloud layer.

- **Sun:**
  - Creates a dynamic sun with animated plasma, corona, and glow effects.
  - Includes a point light for illumination.

- **Starfield:**
  - Generates a 3D starfield background with random star distribution and color variation.

## Acknowledgments

- Textures from [Solar System Scope](https://www.solarsystemscope.com/).
- Inspired by various [Three.js](https://threejs.org/) examples and tutorials.