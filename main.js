// @ts-check
const { EffectComposer, EffectPass, RenderPass, SMAAEffect } = require('postprocessing');
const path = require('path');
const { ChromaticAberration } = require('@react-three/postprocessing');
const { EffectAttribute, BlendFunction } = require('postprocessing');
const fs = require('fs');

// Custom Effect for Chromatic Aberration
class ChromaticAberrationEffect extends Effect {
  constructor({ offset = [0.005, 0.005] } = {}) {
    const fragmentShader = `
      uniform float offsetX;
      uniform float offsetY;

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 center = vec2(0.5);
        vec2 dir = normalize(uv - center);
        float strength = length(uv - center) * 2.0;
        
        float r = texture2D(inputBuffer, uv + dir * offsetX * strength).r;
        float g = texture2D(inputBuffer, uv).g;
        float b = texture2D(inputBuffer, uv - dir * offsetY * strength).b;
        
        outputColor = vec4(r, g, b, inputColor.a);
      }
    `;

    super('ChromaticAberrationEffect', fragmentShader, {
      attributes: EffectAttribute.CONSTANT_BUFFER_SIZE,
      uniforms: new Map([
        ['offsetX', new Uniform(offset[0])],
        ['offsetY', new Uniform(offset[1])]
      ])
    });
  }
}

class EffectController {
  constructor(canvas, plane, materials, videoTexture) {
    this.canvas = canvas;
    this.plane = plane;
    this.materials = materials;
    this.videoTexture = videoTexture;
    this.init();
  }

  init() {
    const { gl, scene, camera } = initScene(this.canvas, this.plane, this.materials, this.videoTexture);
    this.gl = gl;
    this.scene = scene;
    this.camera = camera;

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };

    this.setupEventListeners();
    this.setupPostProcessing();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / this.canvas.clientWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / this.canvas.clientHeight) * 2 + 1;
    });

    this.canvas.addEventListener('click', () => {
      this.animateClick();
    });
  }

  animateClick() {
    gsap.to(this.plane.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.gl);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const chromaticAberration = new ChromaticAberrationEffect({
      offset: [0.002, 0.002]
    });
    const chromaticPass = new EffectPass(this.camera, chromaticAberration);
    this.composer.addPass(chromaticPass);

    const smaaEffect = new SMAAEffect({
      quality: 'Medium'
    });
    const smaaPass = new EffectPass(this.camera, smaaEffect);
    this.composer.addPass(smaaPass);

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth rotation following mouse
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

    this.plane.rotation.y = this.currentRotation.x * 0.3;
    this.plane.rotation.x = this.currentRotation.y * 0.3;

    // Subtle floating animation
    this.plane.position.y = Math.sin(elapsedTime) * 0.05;

    // Update chromatic aberration offset based on mouse position
    const offset = [
      0.002 + Math.abs(this.mouse.x) * 0.003,
      0.002 + Math.abs(this.mouse.y) * 0.003
    ];
    
    this.composer.passes[1].effect.uniforms.get('offsetX').value = offset[0];
    this.composer.passes[1].effect.uniforms.get('offsetY').value = offset[1];

    this.composer.render();
  }
}

// Scene initialization
function initScene(canvas, plane, materials, videoTexture) {
  const gl = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  gl.setSize(canvas.clientWidth, canvas.clientHeight);
  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 5, 15);

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Create video plane
  const planeGeometry = new THREE.PlaneGeometry(3, 1.8);
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    opacity: 0.9
  });

  const videoPlane = new THREE.Mesh(planeGeometry, videoMaterial);
  scene.add(videoPlane);

  // Add particles/dots
  const particleCount = 500;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Animation loop for particles
  function animateParticles() {
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.002;
      if (positions[i + 1] < -5) {
        positions[i + 1] = 5;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Add glow effect behind the plane
  const glowGeometry = new THREE.PlaneGeometry(4, 2.5);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x4444ff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  });
  const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
  glowPlane.position.z = -0.1;
  scene.add(glowPlane);

  return { gl, scene, camera };
}

// Error handling wrapper
function withErrorHandling(fn) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      console.error('Error in effect:', error);
      return null;
    }
  };
}

// Video loader with retry mechanism
async function loadVideoTexture(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      
      await new Promise((resolve, reject) => {
        video.oncanplaythrough = resolve;
        video.onerror = reject;
        video.load();
      });
      
      await video.play();
      
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      return texture;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Cleanup function
function disposeEffect(controller) {
  if (controller) {
    controller.composer.dispose();
    controller.gl.dispose();
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EffectController,
    initScene,
    loadVideoTexture,
    disposeEffect,
    withErrorHandling,
    ChromaticAberrationEffect
  };
}