#!/usr/bin/env python3
"""
Generates the PHINIX globe textures from Natural Earth 110m land polygons.

Outputs (public/textures):
  - earth-landmap.png  : equirectangular 4096x2048 land mask (RGBA, transparent water)
                           R = land/coast glow intensity (0..255)
  - earth-dots.png     : 1024x512 halftone dot sprite tiled over the sphere
  Outputs (src/data):
  - atlas.json         : 1024-vertex normalized land cloud for the particle layer

Design language: "atelier cartography" — graphite ocean, warm porcelain land,
generated deterministically so the globe never depends on third-party assets.
"""
import json, math, os, random
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = os.path.join(ROOT, "tools", "land.geojson")
OUT_TEX = os.path.join(ROOT, "public", "textures")
OUT_DATA = os.path.join(ROOT, "src", "data")
os.makedirs(OUT_TEX, exist_ok=True)
os.makedirs(OUT_DATA, exist_ok=True)

W, H = 4096, 2048
S = 2  # supersampling factor for the mask pass

def project(lon, lat, w, h):
    return ((lon + 180.0) / 360.0 * w, (90.0 - lat) / 180.0 * h)

with open(GEO) as f:
    gj = json.load(f)

def rings_of(geom):
    t = geom["type"]
    if t == "Polygon":
        for r in geom["coordinates"]:
            yield r
    elif t == "MultiPolygon":
        for poly in geom["coordinates"]:
            for r in poly:
                yield r

# ---------------- land mask (supersampled, antialiased via downscale) ----------
mask = Image.new("L", (W * S, H * S), 0)
d = ImageDraw.Draw(mask)
for feat in gj["features"]:
    for ring in rings_of(feat["geometry"]):
        pts = [project(lon, lat, W * S, H * S) for lon, lat in ring]
        if len(pts) >= 3:
            d.polygon(pts, fill=255)
mask = mask.resize((W, H), Image.LANCZOS)

# ---------------- colour design -------------------------------------------------
# palette
OCEAN   = (17, 24, 39)      # deep graphite
LAND    = (238, 233, 221)   # warm porcelain
COAST   = (255, 122, 69)    # ember orange
SHADOW  = (32, 41, 58)      # land shadow edge

img = Image.new("RGB", (W, H), OCEAN)

# subtle latitudinal shading on the ocean so the sphere reads as 3D even unlit
ocean_px = img.load()
for y in range(0, H, 2):
    t = y / H
    shade = 0.82 + 0.30 * math.sin(math.pi * t) ** 2  # brighter equator band
    for x in range(0, W, 16):
        for yy in range(y, min(y + 2, H)):
            r, g, b = ocean_px[x, yy]
            ocean_px[x, yy] = (int(r * shade), int(g * shade), int(b * shade))
# soften the striping
img = img.filter(ImageFilter.GaussianBlur(6))

land_layer = Image.new("RGB", (W, H), LAND)
img.paste(land_layer, (0, 0), mask)

# coast: warm ember outline + soft glow just outside the coastline
mask_small = mask.resize((W // 2, H // 2), Image.LANCZOS)
edge = mask_small.filter(ImageFilter.FIND_EDGES).point(lambda v: min(255, int(v * 2.2)))
glow = edge.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.55))
glow = glow.resize((W, H), Image.LANCZOS)
edge_big = edge.resize((W, H), Image.LANCZOS)

ember = Image.new("RGB", (W, H), COAST)
img = Image.composite(Image.blend(img, ember, 0.55), img, edge_big.point(lambda v: int(v * 0.9)))
img = Image.composite(Image.blend(img, ember, 0.42), img, glow)

# gentle inner vignette on the land so it doesn't look flat
inner = mask.resize((W // 4, H // 4), Image.LANCZOS).filter(ImageFilter.GaussianBlur(10)).resize((W, H), Image.LANCZOS)
shade_layer = Image.new("RGB", (W, H), SHADOW)
img = Image.composite(Image.blend(img, shade_layer, 0.10), img, inner.point(lambda v: 255 - v).point(lambda v: int(v * 0.5)))

# ---------------- R channel mask (for shader glow) ------------------------------
r_channel = Image.new("L", (W, H), 0)
r_channel.paste(mask, (0, 0))
r_channel = Image.composite(Image.new("L", (W, H), 255), r_channel, edge_big.point(lambda v: min(255, v * 2)))

out = img.convert("RGBA")
out.putalpha(r_channel)
out.save(os.path.join(OUT_TEX, "earth-landmap.png"), optimize=True)

# ---------------- dot sprite ----------------------------------------------------
random.seed(7)
DW, DH = 512, 512
dots = Image.new("RGBA", (DW, DH), (0, 0, 0, 0))
dd = ImageDraw.Draw(dots)
step = 32
for gy in range(0, DH, step):
    for gx in range(0, DW, step):
        ox = gx + (step // 2 if (gy // step) % 2 else 0)
        r = random.uniform(1.6, 2.6)
        a = random.randint(70, 130)
        dd.ellipse([ox - r, gy - r, ox + r, gy + r], fill=(255, 255, 255, a))
dots.save(os.path.join(OUT_TEX, "earth-dots.png"), optimize=True)

# ---------------- atlas point cloud --------------------------------------------
mask_small = mask.resize((1024, 512), Image.LANCZOS)
px = mask_small.load()
pts = []
random.seed(11)
tries = 0
while len(pts) < 1100 and tries < 200000:
    tries += 1
    x = random.randrange(1024)
    y = random.randrange(512)
    if px[x, y] > 180:
        lon = x / 1024 * 360 - 180
        lat = 90 - y / 512 * 180
        phi = math.radians(90 - lat)
        theta = math.radians(lon + 180)
        pts.append([
            round(-math.cos(phi) * math.cos(theta), 4),
            round(math.sin(phi), 4),
            round(math.cos(phi) * math.sin(theta), 4),
        ])
with open(os.path.join(OUT_DATA, "atlas.json"), "w") as f:
    json.dump({"points": pts}, f, separators=(",", ":"))

print("landmap:", os.path.getsize(os.path.join(OUT_TEX, "earth-landmap.png")), "bytes")
print("atlas points:", len(pts))
