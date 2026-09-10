const LOGICAL_WORLD_WIDTH = 900;
const LOGICAL_WORLD_HEIGHT = 700;

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

function viewToWorld(x, y, transform) {
  const { scale, offsetX, offsetY, worldWidth, worldHeight } = transform;
  if (!(scale > 0)) return null;

  const wx = (x - offsetX) / scale;
  const wy = (y - offsetY) / scale;
  if (wx < 0 || wy < 0 || wx > worldWidth || wy > worldHeight) return null;
  return { x: wx, y: wy };
}

export {
  LOGICAL_WORLD_WIDTH,
  LOGICAL_WORLD_HEIGHT,
  computeViewTransform,
  worldToView,
  viewToWorld,
};
