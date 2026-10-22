"""Draws the dermatome map figures and writes them into dermatome-map.tsx.

Each figure is authored as its viewer's-right half: silhouette parts (trunk,
arm, leg, head) and dermatome bands. Limb bands use (t, s) coordinates, where
t counts stations along the limb (arm: 2 elbow, 4 wrist, 6 fingertips; leg:
3 knee, 5 ankle, 7 toes) and s runs from the lateral (0) to the medial (1)
edge. Bands may overshoot; they are clipped to their part.

  python3 -m pip install -r scripts/requirements.txt
  python3 scripts/dermatome-map.py registry/base-nova/dermatome-map/dermatome-map.tsx
  bunx prettier --write registry/base-nova/dermatome-map/dermatome-map.tsx
"""
import json, math, sys
from shapely.geometry import Polygon, Point, MultiPolygon
from shapely.ops import unary_union, polylabel
from shapely import affinity

CX = 110

def catmull(points, closed=True, steps=8):
    pts = list(points)
    n = len(pts)
    out = []
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = pts[(i - 1) % n] if closed or i > 0 else pts[i]
        p1 = pts[i]; p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if closed or i + 2 < n else p2
        for k in range(steps):
            u = k / steps
            u2, u3 = u * u, u * u * u
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3) for j in (0, 1)))
    if not closed: out.append(pts[-1])
    return out

def lerp(a, b, u): return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)

class Limb:
    def __init__(self, lateral, medial):
        self.L, self.M = lateral, medial
    def station(self, line, t):
        n = len(line) - 1
        if t <= 0: i = 0
        elif t >= n: i = n - 1
        else: i = min(int(t), n - 1)
        return lerp(line[i], line[i + 1], t - i)
    def at(self, t, s):
        return lerp(self.station(self.L, t), self.station(self.M, t), s)
    def poly(self, pts):
        # densify straight edges in (t,s) so they follow the limb
        out = []
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            for k in range(12):
                u = k / 12
                out.append(self.at(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u))
        return Polygon(out).buffer(0)
    def silhouette(self):
        L = catmull(self.L, closed=False)
        M = catmull(self.M, closed=False)
        return Polygon(L + M[::-1]).buffer(0)

def band(top_med, top_lat, bot_med, bot_lat, x0=CX - 2, x1=200):
    # trunk band between two lines given at the midline and at x=150
    def y(med, lat, x): return med + (lat - med) * (x - CX) / 40
    return Polygon([(x0, y(top_med, top_lat, x0)), (x1, y(top_med, top_lat, x1)), (x1, y(bot_med, bot_lat, x1)), (x0, y(bot_med, bot_lat, x0))])

def head():
    return affinity.scale(Point(CX, 34).buffer(1, 64), 18, 23)

def half(shape):
    return shape.intersection(Polygon([(CX, -10), (240, -10), (240, 500), (CX, 500)]))

# ---- silhouette parts (viewer's right half; the other half is mirrored) ----
def trunk_part(view):
    pts = [(CX, 48), (118, 50), (120, 64), (124, 72), (138, 77), (150, 82), (156, 92), (153, 104), (146, 114), (145, 140), (141, 168), (139, 190), (143, 212), (148, 232), (149, 244)]
    pts += [(132, 258), (118, 264), (CX, 266)] if view == "front" else [(146, 256), (134, 266), (120, 268), (CX, 264)]
    full = pts + [(2 * CX - x, y) for x, y in reversed(pts)]
    return half(Polygon(catmull(full)).buffer(0))

arm = Limb(
    [(153, 87), (165, 116), (173, 156), (181, 194), (190, 230), (199, 254), (194, 283)],
    [(145, 113), (148, 134), (155, 158), (166, 194), (175, 232), (175, 257), (181, 284)],
)
legs = {
    "front": Limb(
        [(149, 236), (151, 270), (148, 302), (143, 340), (144, 380), (136, 432), (141, 455), (137, 470)],
        [(CX + 1, 262), (113, 276), (115, 302), (116, 340), (117, 380), (119, 432), (115, 455), (119, 470)],
    ),
    "back": Limb(
        [(149, 238), (151, 270), (148, 302), (143, 340), (145, 380), (136, 432), (135, 452), (131, 468)],
        [(CX + 1, 262), (113, 276), (115, 302), (116, 340), (117, 380), (119, 432), (119, 452), (124, 468)],
    ),
}

# ---- dermatomes ----
LEVELS = ["C2","C3","C4","C5","C6","C7","C8","T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12","L1","L2","L3","L4","L5","S1","S2","S3","S4-5"]

def front():
    head_s = half(head())
    trunk = trunk_part("front")
    leg = legs["front"]
    r = {}
    # trunk boundaries: (medial y, lateral y at x=150)
    tb = [("C2", 46, 46), ("C3", 62, 62), ("C4", 80, 76), ("T2", 96, 93), ("T3", 108, 106), ("T4", 119, 117), ("T5", 130, 128), ("T6", 140, 138), ("T7", 150, 148), ("T8", 160, 158), ("T9", 170, 168), ("T10", 180, 177), ("T11", 194, 189), ("T12", 208, 200), ("L1", 228, 214), (None, 300, 300)]
    for (lv, m, l), (_, m2, l2) in zip(tb, tb[1:]):
        r.setdefault(lv, []).append(("trunk", band(m, l, m2, l2).intersection(trunk)))
    A = arm
    armp = {
        "C4": [(-1, -1), (-1, 2), (0.05, 2), (0.4, -1)],
        "C5": [(0.4, -1), (0.15, 0.55), (2.2, 0.55), (2.2, -1)],
        "T2": [(0.15, 0.55), (-0.2, 2), (1.6, 2), (1.6, 0.55)],
        "T1": [(1.6, 0.5), (1.6, 2), (3.4, 2), (3.4, 0.5)],
        "C6": [(2.2, -1), (2.2, 0.55), (4, 0.5), (4, 0.36), (7, 0.36), (7, -1)],
        "C8": [(3.4, 0.5), (3.4, 2), (7, 2), (7, 0.68), (4, 0.68), (4, 0.5)],
        "C7": [(4, 0.36), (4, 0.68), (7, 0.68), (7, 0.36)],
    }
    asil = A.silhouette()
    for lv, p in armp.items():
        r.setdefault(lv, []).append(("arm", A.poly(p).intersection(asil)))
    legp = {
        "L1": [(-1, -0.3), (-1, 1.3), (1.1, 1.3), (0.055, -0.3)],
        "L2": [(0.055, -0.3), (1.1, 1.3), (2.64, 1.3), (1.36, -0.3)],
        "L3": [(1.36, -0.3), (2.64, 1.3), (3.48, 1.3), (2.52, -0.3)],
        "L4": [(2.88, 0.3), (3.48, 1.3), (8, 1.3), (8, 0.8), (5.2, 0.8), (5, 0.62)],
        "L5": [(2.52, -0.3), (2.88, 0.3), (5, 0.62), (5.2, 0.8), (8, 0.8), (8, 0.2), (5.2, 0.2), (5, -0.3)],
        "S1": [(5, -0.3), (5.2, 0.2), (8, 0.2), (8, -0.3)],
    }
    lsil = leg.silhouette()
    for lv, p in legp.items():
        r.setdefault(lv, []).append(("leg", leg.poly(p).intersection(lsil)))
    points = {
        "C3": (128, 76), "C4": (148, 84), "C5": A.at(1.85, 0.15), "T1": A.at(1.85, 0.85),
        "T2": A.at(0.1, 0.9), "T3": (130, 113), "T4": (130, 124), "T5": (130, 135),
        "T6": (130, 145), "T7": (130, 155), "T8": (130, 165), "T9": (130, 175),
        "T10": (130, 186), "T11": (130, 196), "T12": (131, 211), "L1": (130, 224),
        "L2": leg.at(1.55, 0.6), "L3": leg.at(3.05, 0.88), "L4": leg.at(5, 0.93),
        "L5": leg.at(6.4, 0.5), "C6": None,
    }
    neutral = head_s
    parts = [("leg", lsil), ("trunk", trunk), ("arm", asil), ("head", head_s)]
    return r, points, neutral, parts

def back():
    head_s = half(head())
    trunk = trunk_part("back")
    leg = legs["back"]
    r = {}
    r["C2"] = [("head", head_s.intersection(Polygon([(CX, 15), (200, 15), (200, 80), (CX, 80)])))]
    tb = [("C2", 40, 40), ("C3", 58, 58), ("C4", 68, 68), ("T1", 88, 94), ("T2", 96, 102), ("T3", 104, 110), ("T4", 112, 118), ("T5", 120, 126), ("T6", 128, 134), ("T7", 136, 142), ("T8", 144, 150), ("T9", 152, 158), ("T10", 160, 166), ("T11", 168, 174), ("T12", 176, 182), ("L1", 184, 192), ("L2", 192, 204), ("L3", 200, 218), ("S1", 208, 232), ("S2", 218, 250), (None, 320, 320)]
    for (lv, m, l), (_, m2, l2) in zip(tb, tb[1:]):
        r.setdefault(lv, []).append(("trunk", band(m, l, m2, l2).intersection(trunk)))
    s3 = affinity.scale(Point(CX, 255).buffer(1, 48), 17, 15)
    s45 = affinity.scale(Point(CX, 259).buffer(1, 48), 6, 7)
    for lv, shapes in r.items():
        r[lv] = [(k, g.difference(s3)) if k == "trunk" else (k, g) for k, g in shapes]
    r["S3"] = [("trunk", half(s3.difference(s45)).intersection(trunk))]
    r["S4-5"] = [("trunk", half(s45).intersection(trunk))]
    A = arm
    armp = {
        "C4": [(-1, -1), (-1, 2), (0.05, 2), (0.4, -1)],
        "C5": [(0.4, -1), (0.15, 0.55), (2.4, 0.55), (2.4, -1)],
        "T2": [(0.15, 0.55), (-0.2, 2), (1.6, 2), (1.6, 0.55)],
        "T1": [(1.6, 0.55), (1.6, 2), (3.3, 2), (3.3, 0.62), (2.4, 0.62), (2.4, 0.55)],
        "C6": [(2.4, -1), (2.4, 0.38), (4, 0.38), (4, 0.36), (7, 0.36), (7, -1)],
        "C7": [(2.4, 0.38), (2.4, 0.62), (4, 0.62), (4, 0.68), (7, 0.68), (7, 0.36), (4, 0.36), (4, 0.38)],
        "C8": [(3.3, 0.62), (3.3, 2), (7, 2), (7, 0.68), (4, 0.68), (4, 0.62)],
    }
    asil = A.silhouette()
    for lv, p in armp.items():
        r.setdefault(lv, []).append(("arm", A.poly(p).intersection(asil)))
    legp = {
        "L2": [(-1, -0.3), (-1, 0.3), (1.5, 0.3), (1.5, -0.3)],
        "L3": [(1.5, -0.3), (1.5, 0.3), (3, 0.3), (3, 0.7), (-1, 0.7), (-1, 1.3), (3, 1.3), (3, -0.3)],
        "S2": [(-1, 0.3), (-1, 0.7), (4.2, 0.7), (4.2, 0.3)],
        "L5": [(3, -0.3), (3, 0.3), (4.4, 0.3), (4.4, -0.3)],
        "L4": [(3, 0.7), (3, 1.3), (6, 1.3), (6, 0.7)],
        "S1": [(4.4, -0.3), (4.4, 0.3), (4.2, 0.3), (4.2, 0.7), (6, 0.7), (6, 1.3), (8, 1.3), (8, -0.3)],
    }
    lsil = leg.silhouette()
    for lv, p in legp.items():
        r.setdefault(lv, []).append(("leg", leg.poly(p).intersection(lsil)))
    points = {
        "C2": (124, 22), "C6": A.at(5.3, 0.12), "C7": A.at(5.6, 0.52), "C8": A.at(5.6, 0.86),
        "S1": leg.at(6.9, 0.45), "S2": leg.at(3, 0.5), "S3": (123, 258), "S4-5": (114, 259),
    }
    neutral = head_s.difference(r["C2"][0][1])
    parts = [("leg", lsil), ("trunk", trunk), ("arm", asil), ("head", head_s)]
    return r, points, neutral, parts

ORDER = {"leg": 0, "trunk": 1, "arm": 2, "head": 3}

def fmt(g, nd=1):
    g = g.simplify(0.25)
    polys = [g] if isinstance(g, Polygon) else [p for p in getattr(g, "geoms", []) if isinstance(p, Polygon)]
    out = []
    for p in polys:
        if p.area < 0.5: continue
        for ring in [p.exterior, *p.interiors]:
            cs = list(ring.coords)[:-1]
            out.append("M" + " ".join(f"{round(x, nd):g} {round(y, nd):g}" for x, y in cs) + "Z")
    return "".join(out)

def build(fn):
    r, points, neutral, parts = fn()
    # paint order: higher parts win, so subtract later parts from earlier ones
    final = {}
    for lv, shapes in r.items():
        geoms = []
        for k, g in shapes:
            for k2, s2 in parts:
                if ORDER[k2] > ORDER[k]: g = g.difference(s2)
            geoms.append(g)
        final[lv] = unary_union(geoms)
    # each area belongs to one level: where shapes overlap, the one listed later wins
    claimed = None
    for lv in reversed(list(final)):
        g = final[lv]
        if claimed is not None: g = g.difference(claimed)
        claimed = g if claimed is None else claimed.union(g)
        final[lv] = g
    body = unary_union([s for _, s in parts])
    uncovered = body.difference(unary_union(list(final.values()) + [neutral]))
    full_body = body.union(affinity.scale(body, -1, 1, origin=(CX, 0)))
    data = {"outline": fmt(full_body.buffer(0.01)), "neutral": fmt(neutral), "regions": {}}
    for lv in LEVELS:
        if lv not in final or final[lv].is_empty: continue
        g = final[lv]
        big = max(g.geoms, key=lambda p: p.area) if hasattr(g, "geoms") else g
        lab = polylabel(big, 0.2)
        entry = {"d": fmt(g), "label": [round(lab.x, 1), round(lab.y, 1)], "room": big.exterior.distance(lab)}
        if points.get(lv):
            p = points[lv]
            entry["point"] = [round(p[0], 1), round(p[1], 1)]
            if not g.buffer(0.6).contains(Point(p)):
                print("point outside", fn.__name__, lv, p, file=sys.stderr)
        data["regions"][lv] = entry
        poly_area.setdefault(fn.__name__, {})[lv] = g.area
    print(fn.__name__, "uncovered area", round(uncovered.area, 1), file=sys.stderr)
    return data

poly_area = {}
out = {"front": build(front), "back": build(back)}


def ts():
    lines = ["const shapes: Record<DermatomeView, ViewShapes> = {"]
    for v in ("front", "back"):
        s = out[v]
        lines.append(f"  {v}: {{")
        lines.append(f"    outline: {json.dumps(s['outline'])},")
        lines.append(f"    unassigned: {json.dumps(s['neutral'])},")
        lines.append("    regions: {")
        # roomiest labels first; skip any that would crowd one already placed
        placed = []
        for lv, e in sorted(s["regions"].items(), key=lambda item: -item[1]["room"]):
            x, y = e["label"]
            if e["room"] >= 3.2 and all(math.hypot(x - a, (y - b) * 1.6) > 9 for a, b in placed):
                placed.append((x, y))
        for lv, e in s["regions"].items():
            key = json.dumps(lv) if "-" in lv else lv
            parts = [f"d: {json.dumps(e['d'])}"]
            area = poly_area[v][lv]
            if tuple(e['label']) in placed: parts.append(f"label: [{e['label'][0]:g}, {e['label'][1]:g}]")
            if "point" in e: parts.append(f"point: [{e['point'][0]:g}, {e['point'][1]:g}]")
            lines.append(f"      {key}: {{ {', '.join(parts)} }},")
        lines.append("    },")
        lines.append("  },")
    lines.append("}")
    return "\n".join(lines)

component = sys.argv[1]
source = open(component).read()
start = source.index("const shapes: Record<DermatomeView, ViewShapes> = {")
end = source.index("\n}\n", start) + 3
open(component, "w").write(source[:start] + ts() + "\n" + source[end:])
