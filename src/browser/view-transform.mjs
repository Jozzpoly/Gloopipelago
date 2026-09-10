const LOGICAL_WORLD_WIDTH = 900;
const LOGICAL_WORLD_HEIGHT = 700;
const POINTER_WORLD_QUANTUM = 1e-9;
const POINTER_WORLD_EDGE_EPSILON = POINTER_WORLD_QUANTUM / 2;

function computeViewTransform(viewWidth, viewHeight, worldWidth = LOGICAL_WORLD_WIDTH, worldHeight = LOGICAL_WORLD_HEIGHT) {
  if (!Number.isFinite(worldWidth) || !Number.isFinite(worldHeight) || worldWidth <= 0 || worldHeight <= 0) {
    throw new RangeError('Logical world dimensions must be finite and positive');
  }

  const vw = Number.isFinite(viewWidth) ? Math.max(0, viewWidth) : 0;
  const vh = Number.isFinite(viewHeight) ? Math.max(0, viewHeight) : 0;
  const scale = Math.min(vw / worldWidth, vh / worldHeight);
  const displayWidth = worldWidth * scale;
  const displayHeight = worldHeight * scale;

  return {
    viewWidth: vw,
    viewHeight: vh,
    worldWidth,
    worldHeight,
    scale,
    displayWidth,
    displayHeight,
    offsetX: (vw - displayWidth) / 2,
    offsetY: (vh - displayHeight) / 2,
  };
}

function worldToView(x, y, transform) {
  return {
    x: transform.offsetX + x * transform.scale,
    y: transform.offsetY + y * transform.scale,
  };
}

function canonicalWorldCoordinate(value, max) {
  const quantized = Math.round(value / POINTER_WORLD_QUANTUM) * POINTER_WORLD_QUANTUM;
  return Math.max(0, Math.min(max, quantized));
}

function viewToWorld(x, y, transform) {
  const { scale, offsetX, offsetY, worldWidth, worldHeight } = transform;
  if (!(scale > 0)) return null;

  const rawX = (x - offsetX) / scale;
  const rawY = (y - offsetY) / scale;
  if (
    rawX < -POINTER_WORLD_EDGE_EPSILON || rawY < -POINTER_WORLD_EDGE_EPSILON ||
    rawX > worldWidth + POINTER_WORLD_EDGE_EPSILON || rawY > worldHeight + POINTER_WORLD_EDGE_EPSILON
  ) return null;

  return {
    x: canonicalWorldCoordinate(rawX, worldWidth),
    y: canonicalWorldCoordinate(rawY, worldHeight),
  };
}

export {
  LOGICAL_WORLD_WIDTH,
  LOGICAL_WORLD_HEIGHT,
  POINTER_WORLD_QUANTUM,
  computeViewTransform,
  worldToView,
  viewToWorld,
};
