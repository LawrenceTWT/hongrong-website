"""Conservative font-metric probes, not browser visual or layout tests.

Requires fonttools[woff]. Run after rebuilding fonts. The probes cover the two
intentional one-line CJK About titles and the narrowest supported header.
"""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
fonts = {
    name: TTFont(root / "assets/fonts" / path)
    for name, path in [
        ("ja", "noto-sans-jp.woff2"),
        ("zh", "gensen-rounded-tw-regular.woff"),
        ("serif", "libre-caslon-condensed-regular.woff2"),
        ("en", "geist-medium.woff2"),
    ]
}

def units(font, text):
    cmap = font.getBestCmap()
    return sum(font["hmtx"].metrics[cmap[ord(char)]][0] for char in text) / font["head"].unitsPerEm

for code, text in [("zh", "像水一樣，流向未知"), ("ja", "水のように、未知へ")]:
    # .about-story-hero-copy h1 em: 10.3cqi max, .035em tracking.
    share = (units(fonts[code], text) + len(text) * .035) * .103
    assert share < 1, (code, share)
    print(f"{code} one-line About title: {share:.1%} of its text column")

# Deliberately ignore the brand's negative tracking and reserve 6px for ®.
# 320px viewport - two 10px edges - two 1px borders - two 18px paddings.
brand = units(fonts["serif"], "HongRong") * 26 + 6
inner = 320 - 20 - 2 - 36
for code, label in [("zh", "中文"), ("en", "English"), ("ja", "日本語")]:
    label_width = units(fonts[code], label) * 12
    # 92px selector, 12px/24px padding, 1px borders; 8px gap, 44px menu.
    assert label_width + 12 + 24 + 2 <= 92, (code, label_width)
    assert brand + 92 + 8 + 44 < inner, (code, brand)
    print(f"{code} selector: {label_width:.1f}px / 54px; header {brand + 144:.1f}px / {inner}px")

print("Font-metric probes passed. Browser layout, glyph shaping and visual QA remain separate.")
