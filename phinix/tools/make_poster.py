#!/usr/bin/env python3
"""
Static globe poster — built by inverse-mapping a sphere, NOT by cropping a flat map.

Why this file exists: the first poster simply cropped the equirectangular texture
with `object-fit: cover` inside a circular mask, so continents were magnified past
the horizon and the thing read as a "red planet", not as the 3D globe it replaces.

Here every output pixel is cast back onto a unit sphere, textured from the same
land mask the WebGL globe uses, then lit with a lambert term + ember rim, so the
poster is a true orthographic render of the same object. WebGL fades in on top of
it and the swap is invisible; reduced-motion visitors keep a correct globe.

    python3 tools/make_poster.py
"""
from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANDMAP = ROOT / "public/textures/earth-landmap.webp"
OUT_WEBP = ROOT / "public/textures/globe-poster.webp"
OUT_PNG = ROOT / "public/textures/globe-poster.png"

SIZE = 640           # 2x the widest CSS size (320 px) — retina-crisp, still tiny
# The poster must be a pixel-exact stand-in for the WebGL render:
#   PerspectiveCamera(fov 38) at z = 3.15  →  sphere silhouette = 1 / tan(19°) / 3.15
#   globeGroup.rotation.z = -0.18 rad      →  same roll on the map
SILHOUETTE = 1.0 / (3.70 * np.tan(np.deg2rad(19.0)))
ROLL = -0.18
LON0 = 16.0          # centre meridian (Europe/Africa in view, like the live globe)
TILT = 12.0          # slight north-up tilt, matches camera.position.y = 0.12
AMBIENT = 0.20
LIGHT = np.array([-0.42, 0.52, 0.74])
LIGHT = LIGHT / np.linalg.norm(LIGHT)


def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def main() -> None:
    land = Image.open(LANDMAP).convert("L")
    lw, lh = land.size
    land_np = np.asarray(land, dtype=np.float32)

    # --- pixel grid in view space (-1..1, y up) -----------------------------
    coords = (np.arange(SIZE) + 0.5) / SIZE * 2.0 - 1.0
    px, py = np.meshgrid(coords, coords)
    # normalise the box so the globe's limb lands where the 3D one does
    x_view = px / SILHOUETTE
    y_view = -py / SILHOUETTE
    # roll (globeGroup.rotation.z) — rotate the view ray the other way
    cr, sr = np.cos(-ROLL), np.sin(-ROLL)
    x_view, y_view = cr * x_view - sr * y_view, sr * x_view + cr * y_view
    r2 = x_view**2 + y_view**2
    inside = r2 <= 1.0
    z_view = np.sqrt(np.clip(1.0 - r2, 0.0, 1.0))

    # --- rotate the view ray into the globe's own frame ---------------------
    tilt = np.deg2rad(TILT)
    ct, st = np.cos(tilt), np.sin(tilt)
    # inverse of a rotation about X (tilt the north pole towards the viewer)
    y_g = ct * y_view - st * z_view
    z_g = st * y_view + ct * z_view
    x_g = x_view

    lat = np.arcsin(np.clip(y_g, -1.0, 1.0))
    lon = np.arctan2(x_g, z_g)

    u = (np.rad2deg(lon) + LON0 + 180.0) / 360.0
    u = np.mod(u, 1.0)
    v = 0.5 - lat / np.pi
    uu = np.clip((u * lw).astype(np.int32), 0, lw - 1)
    vv = np.clip((v * lh).astype(np.int32), 0, lh - 1)
    land_mask = land_np[vv, uu] / 255.0
    land_mask = smoothstep(0.25, 0.75, land_mask)

    # --- shading ------------------------------------------------------------
    n = np.stack([x_view, y_view, z_view], axis=-1)
    lambert = np.clip(n @ LIGHT, 0.0, 1.0) ** 1.15
    shade = np.clip(AMBIENT + lambert * 0.68, 0.0, 1.0)

    # spherical limb darkening — the planet sits inside a black frame
    r = np.sqrt(r2)
    limb = np.clip(1.0 - smoothstep(0.55, 1.0, r) * 0.55, 0.0, 1.0)

    ocean = np.array([0x0C, 0x12, 0x20], dtype=np.float32) / 255.0
    ocean_hi = np.array([0x1B, 0x2A, 0x46], dtype=np.float32) / 255.0
    land_lo = np.array([0x8E, 0x86, 0x76], dtype=np.float32) / 255.0
    land_hi = np.array([0xD8, 0xCF, 0xBC], dtype=np.float32) / 255.0

    ocean_col = ocean + (ocean_hi - ocean) * (lambert[..., None] ** 1.6)
    land_col = land_lo + (land_hi - land_lo) * lambert[..., None]
    col = ocean_col * (1.0 - land_mask[..., None]) + land_col * land_mask[..., None]

    col = col * (shade[..., None] * limb[..., None])

    # --- atmosphere: ember rim + thin bright ring ---------------------------
    ember = np.array([0xFF, 0x6A, 0x2B], dtype=np.float32) / 255.0
    rim = smoothstep(0.88, 1.0, r)[..., None]
    col = col * (1.0 - rim * 0.42) + ember * rim * 0.16

    # hair-thin lit edge, like the WebGL globe's fresnel ring
    ring = (smoothstep(0.965, 0.992, r) * (1.0 - smoothstep(0.992, 1.0, r)))[..., None]
    col = col + np.array([1.0, 0.62, 0.42]) * ring * 0.32

    # --- specular gloss, upper-left -----------------------------------------
    half = LIGHT + np.array([0.0, 0.0, 1.0])
    half /= np.linalg.norm(half)
    spec = np.clip((n @ half), 0.0, 1.0)[..., None] ** 42 * 0.35
    col = col + spec

    # --- faint 30° graticule, the same idea as the live globe's grid --------
    lat_deg, lon_deg = np.rad2deg(lat), np.rad2deg(lon)
    grid = np.zeros_like(r)
    for step_deg in (30,):
        d1 = np.abs((lat_deg + step_deg / 2) % step_deg - step_deg / 2)
        d2 = np.abs((lon_deg + step_deg / 2) % step_deg - step_deg / 2)
        grid = np.maximum(grid, np.minimum(smoothstep(0.55, 0.0, d1), 1.0) * 0.0)
        line_lat = np.exp(-(d1 / 0.35) ** 2)
        line_lon = np.exp(-(d2 / 0.35) ** 2)
        grid = np.maximum(grid, np.maximum(line_lat, line_lon))
    grid *= (land_mask * 0.0 + 0.16) * smoothstep(1.0, 0.55, r)
    col = col * (1.0 - grid[..., None]) + np.array([0.85, 0.88, 0.95]) * grid[..., None] * 0.55

    # --- compose (premultiplied antialiasing at the limb) -------------------
    alpha = smoothstep(1.0, 0.995, r)
    rgba = np.zeros((SIZE, SIZE, 4), dtype=np.float32)
    rgba[..., :3] = np.clip(col, 0.0, 1.0)
    rgba[..., 3] = alpha
    out = (rgba * 255.0 + 0.5).astype(np.uint8)

    img = Image.fromarray(out, mode="RGBA")
    img.save(OUT_PNG, optimize=True)
    img.save(OUT_WEBP, quality=86, method=6)
    kb = OUT_WEBP.stat().st_size / 1024
    print(f"{OUT_WEBP.relative_to(ROOT)} — {SIZE}px, {kb:.1f} kB")


if __name__ == "__main__":
    main()
