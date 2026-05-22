<template>
  <div ref="container" class="panorama-container">
    <!-- Loading -->
    <div v-if="state === 'loading'" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
      <div class="w-8 h-8 rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
      <p class="font-body text-sm text-gray-500">Loading panorama...</p>
    </div>

    <!-- Error -->
    <div v-if="state === 'error'" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
      <p class="font-body text-sm text-red-400">Failed to load panorama image</p>
      <button
        @click="loadPanorama(imageUrl)"
        class="px-5 py-2 rounded-full font-body text-sm text-noir-base bg-neon-cyan transition"
      >Retry</button>
    </div>

    <!-- Controls -->
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
      <button
        @click="captureScreenshot"
        class="control-btn group"
        title="Capture screenshot"
      >
        <!-- camera icon -->
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span class="control-tooltip">Screenshot</span>
      </button>
      <button
        @click="resetView"
        class="control-btn group"
        title="Reset view"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span class="control-tooltip">Reset view</span>
      </button>
      <button
        @click="toggleFullscreen"
        class="control-btn group"
        :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
      >
        <svg v-if="!isFullscreen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
        <span class="control-tooltip">{{ isFullscreen ? 'Exit' : 'Fullscreen' }}</span>
      </button>
    </div>

    <!-- Hint -->
    <Transition name="hint-fade">
      <div v-if="showHint" class="fixed bottom-28 left-1/2 -translate-x-1/2 z-30">
        <p class="font-body text-xs text-gray-500 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
          Drag to look around &middot; Scroll to zoom
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'

const PANO_URL = '/sphere.jpg'

const container = ref(null)
const state = ref('loading')
const showHint = ref(true)
const isFullscreen = ref(false)

let scene, camera, renderer, sphere
let isDragging = false
let prevMouse = { x: 0, y: 0 }
let lon = 0
let lat = 0
let fov = 75
const TARGET_FOV = 75
const MIN_FOV = 30
const MAX_FOV = 120
let animationId = null

function loadPanorama(url) {
  state.value = 'loading'

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(
    url,
    () => { state.value = 'ready' },
    undefined,
    () => { state.value = 'error' },
  )
  texture.colorSpace = THREE.SRGBColorSpace
  sphere.material.map = texture
  sphere.material.needsUpdate = true
}

function initScene() {
  const el = container.value
  const w = el.clientWidth
  const h = el.clientHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 1100)
  camera.target = new THREE.Vector3(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(w, h)
  el.prepend(renderer.domElement)

  const geometry = new THREE.SphereGeometry(500, 64, 64)
  const material = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
  })
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)

  loadPanorama(PANO_URL)

  // Hide hint after 4s
  setTimeout(() => { showHint.value = false }, 4000)
}

function updateCamera() {
  if (!camera) return
  lat = Math.max(-90, Math.min(90, lat))
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon)

  const x = 500 * Math.sin(phi) * Math.cos(theta)
  const y = 500 * Math.cos(phi)
  const z = 500 * Math.sin(phi) * Math.sin(theta)

  camera.lookAt(x, y, z)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  updateCamera()
  // Smooth FOV
  camera.fov += (fov - camera.fov) * 0.08
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

// --- Resize ---
function onResize() {
  if (!container.value || !renderer) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

// --- Pointer controls ---
function onPointerDown(e) {
  isDragging = true
  prevMouse = { x: e.clientX, y: e.clientY }
}

function onPointerMove(e) {
  if (!isDragging) return
  const dx = e.clientX - prevMouse.x
  const dy = e.clientY - prevMouse.y
  lon -= dx * 0.3
  lat += dy * 0.3
  prevMouse = { x: e.clientX, y: e.clientY }
}

function onPointerUp() {
  isDragging = false
}

function onWheel(e) {
  e.preventDefault()
  fov = Math.max(MIN_FOV, Math.min(MAX_FOV, fov + e.deltaY * 0.05))
}

// --- Touch support ---
function onTouchStart(e) {
  if (e.touches.length === 1) {
    const t = e.touches[0]
    isDragging = true
    prevMouse = { x: t.clientX, y: t.clientY }
  }
}

function onTouchMove(e) {
  if (!isDragging || e.touches.length !== 1) return
  const t = e.touches[0]
  const dx = t.clientX - prevMouse.x
  const dy = t.clientY - prevMouse.y
  lon -= dx * 0.3
  lat += dy * 0.3
  prevMouse = { x: t.clientX, y: t.clientY }
}

function onTouchEnd() {
  isDragging = false
}

// --- Actions ---
function captureScreenshot() {
  if (!renderer) return
  renderer.render(scene, camera)
  const link = document.createElement('a')
  link.download = 'panorama-screenshot.png'
  link.href = renderer.domElement.toDataURL('image/png')
  link.click()
}

function resetView() {
  lon = 0
  lat = 0
  fov = TARGET_FOV
  showHint.value = true
  setTimeout(() => { showHint.value = false }, 2000)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    container.value?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
  setTimeout(onResize, 200)
}

onMounted(() => {
  initScene()
  animate()

  const el = container.value
  el.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  el.addEventListener('wheel', onWheel, { passive: false })
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: true })
  el.addEventListener('touchend', onTouchEnd)
  window.addEventListener('resize', onResize)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  const el = container.value
  el?.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  el?.removeEventListener('wheel', onWheel)
  el?.removeEventListener('touchstart', onTouchStart)
  el?.removeEventListener('touchmove', onTouchMove)
  el?.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.panorama-container {
  position: relative;
  width: 100%;
  height: min(600px, 80vh);
  border-radius: 16px;
  overflow: hidden;
  background: #07070b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}
.panorama-container:active {
  cursor: grabbing;
}

.control-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(19, 19, 31, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9e9eb8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}
.control-btn:hover {
  color: #00f4ff;
  border-color: rgba(0, 244, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 244, 255, 0.15);
  transform: translateY(-2px);
}

.control-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  color: #9e9eb8;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.group:hover .control-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.6s ease;
}
.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}
</style>
