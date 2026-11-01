"""
PHINIX emblem → clean vector SVG.

The uploaded logo is flat, geometric artwork, so instead of trusting a
third-party autotracer (inconsistent mask polarity), we trace it ourselves:

  1. colour layer masks (gold / navy ink / grey hexagon line) from the source,
  2. connected-component cleanup (drops the paper drawing in the corners),
  3. cv2 contour extraction with holes (RETR_CCOMP),
  4. polygon simplification + Catmull-Rom → cubic bezier fitting for curves,
     sharp corners preserved as straight lines,
  5. one SVG with viewBox, gradients inside the brand palette and fill-rule
     evenodd so holes (gaps between feathers) stay transparent.

Run:  python3 tools/trace_logo.py
"""
import json
import math
import os

import cv2
import numpy as np
from PIL import Image, ImageFilter

SRC = 'tools/logo/source-1200.png'
CROP = (300, 230, 900, 790)          # emblem only — the wordmark sits below this
OUT_SVG = 'tools/logo/emblem-trace.svg'

# ---------------------------------------------------------------- masks -----
big = Image.open(SRC).convert('RGB')
crop = big.crop(CROP)
arr = np.asarray(crop).astype(np.float32)
R, G, B = arr[..., 0], arr[..., 1], arr[..., 2]
lum = 0.299 * R + 0.587 * G + 0.114 * B
sat = arr.max(axis=2) - arr.min(axis=2)

gold = ((sat > 30) & (R > G) & (G > B) & (lum < 228) & (lum > 70)).astype(np.uint8)
navy = ((lum < 120) & (sat < 40)).astype(np.uint8)
# the thin hexagon stroke is a mid grey; keep a wide band and let the
# component filter + contour merging clean it up
line = ((lum >= 100) & (lum < 215) & (sat < 34)).astype(np.uint8)

core = cv2.bitwise_or(gold, navy)
dist = cv2.distanceTransform(1 - core, cv2.DIST_L2, 5)
line = cv2.bitwise_and(line, (dist < 60).astype(np.uint8))

# close small gaps so the hexagon stroke becomes one continuous contour
line = cv2.morphologyEx(line, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=2)
line = cv2.morphologyEx(line, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=1)


def keep_big(mask: np.ndarray, min_area: int) -> np.ndarray:
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    out = np.zeros_like(mask)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            out[lab == i] = 1
    return out


gold = keep_big(gold, 220)
navy = keep_big(navy, 160)
line = keep_big(line, 260)

# ------------------------------------------------------------- geometry -----
def catmull_to_bezier(points: list[tuple[float, float]], is_corner: list[bool]) -> str:
    """Closed polygon → path data, smoothing between non-corner points."""
    n = len(points)
    out = [f'M{points[0][0]:.1f},{points[0][1]:.1f}']
    for i in range(n):
        p0 = points[(i - 1) % n]
        p1 = points[i]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n]
        if is_corner[(i + 1) % n] or is_corner[i]:
            out.append(f'L{p2[0]:.1f},{p2[1]:.1f}')
        else:
            c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
            c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
            out.append(
                f'C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}'
            )
    out.append('Z')
    return ''.join(out)


def corner_flags(points: list[tuple[float, float]], angle_deg: float = 112.0) -> list[bool]:
    n = len(points)
    flags = []
    for i in range(n):
        a = np.array(points[(i - 1) % n])
        b = np.array(points[i])
        c = np.array(points[(i + 1) % n])
        v1, v2 = a - b, c - b
        d = (np.linalg.norm(v1) * np.linalg.norm(v2))
        if d < 1e-6:
            flags.append(True)
            continue
        cos = float(np.clip(np.dot(v1, v2) / d, -1, 1))
        flags.append(math.degrees(math.acos(cos)) < angle_deg)
    return flags


def trace(mask: np.ndarray, eps: float = 1.6, min_len: int = 10) -> str:
    m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
    m = cv2.threshold(np.asarray(m), 128, 255, cv2.THRESH_BINARY)[1]
    # smooth the staircase left by the low-res source before vectorising
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8), iterations=1)
    contours, hierarchy = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    parts = []
    for cnt in contours:
        if cv2.arcLength(cnt, True) < min_len:
            continue
        approx = cv2.approxPolyDP(cnt, eps, True).reshape(-1, 2)
        if len(approx) < 3:
            continue
        pts = [(float(x), float(y)) for x, y in approx]
        parts.append(catmull_to_bezier(pts, corner_flags(pts)))
    return ''.join(parts)


paths = {
    'line': trace(line, eps=1.8, min_len=26),
    'navy': trace(navy, eps=1.7),
    'gold': trace(gold, eps=1.7),
}

union = (gold | navy | line) > 0
ys, xs = np.where(union)
x0, y0 = int(xs.min()), int(ys.min())
w, h = int(xs.max()) - x0 + 1, int(ys.max()) - y0 + 1

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {w} {h}" role="img" aria-label="PHINIX">
  <defs>
    <linearGradient id="phx-gold" x1=".12" y1="0" x2=".88" y2="1">
      <stop offset="0" stop-color="#F1D68C"/><stop offset=".36" stop-color="#DFB45E"/>
      <stop offset=".7" stop-color="#C99C44"/><stop offset="1" stop-color="#A97A2B"/>
    </linearGradient>
    <linearGradient id="phx-navy" x1=".2" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#4A576E"/><stop offset=".5" stop-color="#2D3949"/>
      <stop offset="1" stop-color="#1A2230"/>
    </linearGradient>
    <linearGradient id="phx-line" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B96A5"/><stop offset="1" stop-color="#495465"/>
    </linearGradient>
  </defs>
  <path fill="url(#phx-line)" fill-rule="evenodd" d="{paths['line']}"/>
  <path fill="url(#phx-navy)" fill-rule="evenodd" d="{paths['navy']}"/>
  <path fill="url(#phx-gold)" fill-rule="evenodd" d="{paths['gold']}"/>
</svg>
'''

os.makedirs('tools/logo', exist_ok=True)
with open(OUT_SVG, 'w') as f:
    f.write(svg)

print(f'{OUT_SVG} — {len(svg)/1024:.1f} KB, viewBox={x0} {y0} {w} {h}')
json.dump({'box': [x0, y0, w, h]}, open('tools/logo/trace-box.json', 'w'))
