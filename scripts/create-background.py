"""Coffee shop background — real sage marble photo + real bean crops."""

from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/images/coffee-shop-bg.jpg"
MARBLE = ROOT / "public/images/marble-bg.png"
REF = ROOT / "public/images/reference-flatlay.png"
FLATLAY = ROOT / "public/images/hero-coffee-flatlay.png"
CUP = ROOT / "public/images/hero-coffee-cup.png"

W, H = 1920, 1080
BOX_FILL = (233, 240, 246)
BOX_BORDER = (206, 220, 232)

# Bean crop regions in reference flatlay (x1, y1, x2, y2)
BEAN_CROPS = [
    (118, 318, 158, 342),
    (176, 356, 212, 378),
    (228, 402, 262, 424),
    (812, 468, 848, 492),
    (868, 512, 902, 534),
    (912, 558, 948, 580),
    (780, 598, 816, 620),
]


def pick_ref() -> Path:
    for p in (REF, FLATLAY):
        if p.exists():
            return p
    return MARBLE


def sage_marble_base(ref: Image.Image) -> Image.Image:
    """Real sage green marble photo, full canvas."""
    marble = Image.open(MARBLE).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    if ref.size[0] > 800:
        overlay = ref.crop((0, int(ref.height * 0.42), ref.width, ref.height)).convert("RGB")
        overlay = overlay.resize((W, H), Image.Resampling.LANCZOS)
        marble = Image.blend(marble, overlay, 0.72)
    return marble.convert("RGBA")


def isolate_bean(crop: Image.Image) -> Image.Image:
    """Keep roasted bean pixels; drop marble/white background."""
    crop = crop.convert("RGBA")
    px = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = px[x, y]
            # marble / cream / white → transparent
            if r > 195 and g > 190 and b > 185:
                px[x, y] = (r, g, b, 0)
            elif g > r and g > 105 and r > 90:  # sage green marble
                px[x, y] = (r, g, b, 0)
            elif r > 170 and g > 160 and b > 150:
                px[x, y] = (r, g, b, 0)
            elif r < 115 and g < 95 and b < 80:
                px[x, y] = (r, g, b, 255)
            else:
                px[x, y] = (r, g, b, 0)
    return crop


def load_cup() -> Image.Image:
    cup = Image.open(CUP).convert("RGBA")
    px = cup.load()
    for y in range(cup.height):
        for x in range(cup.width):
            r, g, b, a = px[x, y]
            if a < 25 or (abs(r - g) < 14 and abs(g - b) < 14 and 155 < r < 215):
                px[x, y] = (0, 0, 0, 0)
    return cup


def paste_real_bean(
    canvas: Image.Image,
    ref: Image.Image,
    crop_box: tuple[int, int, int, int],
    x: int,
    y: int,
    size: int,
    angle: float,
) -> None:
    bean = isolate_bean(ref.crop(crop_box))
    bean = bean.resize((size, max(8, int(size * 0.62))), Image.Resampling.LANCZOS)
    bean = bean.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.alpha_composite(bean, (x - bean.width // 2, y - bean.height // 2))


def main() -> None:
    random.seed(31)
    ref = Image.open(pick_ref())
    base = sage_marble_base(ref)

    box_x, box_y = 500, 96
    box_w, box_h = 680, 380
    box_r = 38

    shadow = Image.new("RGBA", (box_w + 20, box_h + 20), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (0, 0, box_w + 12, box_h + 12), radius=box_r + 6, fill=(0, 0, 0, 50)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(shadow, (box_x + 10, box_y + 12))

    panel = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle((0, 0, box_w - 1, box_h - 1), radius=box_r, fill=(*BOX_FILL, 255))
    pd.rounded_rectangle((0, 0, box_w - 1, box_h - 1), radius=box_r, outline=(*BOX_BORDER, 255), width=2)
    base.alpha_composite(panel, (box_x, box_y))

    cup = load_cup()
    cup_h = 275
    cup_w = int(cup.width * (cup_h / cup.height))
    cup = cup.resize((cup_w, cup_h), Image.Resampling.LANCZOS)
    base.alpha_composite(cup, (box_x + box_w - int(cup_w * 0.36), box_y - int(cup_h * 0.30)))

    bean_spots = [
        (200, 280), (340, 520), (260, 760), (480, 900), (720, 700),
        (920, 840), (1120, 600), (1320, 920), (1520, 740), (1700, 880),
        (1600, 520), (980, 460), (640, 1000), (300, 960), (180, 440),
        (1450, 980), (1180, 380), (820, 360),
    ]
    for i, (x, y) in enumerate(bean_spots):
        if box_x - 40 < x < box_x + box_w + 140 and box_y - 50 < y < box_y + box_h + 70:
            continue
        crop = BEAN_CROPS[i % len(BEAN_CROPS)]
        paste_real_bean(base, ref, crop, x, y, size=26 + (i % 3) * 5, angle=5 + i * 17)

    base.convert("RGB").save(OUT, "JPEG", quality=95, optimize=True)
    print(f"Saved {OUT} — real marble + real beans")


if __name__ == "__main__":
    main()
