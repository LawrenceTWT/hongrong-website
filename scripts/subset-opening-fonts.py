"""Create tiny opening-only subsets from the existing licensed Caslon fonts.

Requires fonttools[woff2]. No font is downloaded or redrawn.
"""
import hashlib
import json
from pathlib import Path
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
characters = "HongRong®"
manifest = {"text": characters, "faces": []}
for style in ("regular", "italic"):
    source = root / f"assets/fonts/libre-caslon-condensed-{style}.woff2"
    font = TTFont(source, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=characters)
    subsetter.subset(font)
    font.flavor = "woff2"
    target = root / f"assets/fonts/opening-caslon-{style}.woff2"
    font.save(target)
    # Preserve the exact source outlines and advances, including the registered mark.
    original, emitted = TTFont(source), TTFont(target)
    original_map, emitted_map = original.getBestCmap(), emitted.getBestCmap()
    for character in characters:
        code = ord(character)
        assert original["hmtx"].metrics[original_map[code]] == emitted["hmtx"].metrics[emitted_map[code]]
        drawings = []
        for face, mapping in ((original, original_map), (emitted, emitted_map)):
            glyphs = face.getGlyphSet()
            pen = DecomposingRecordingPen(glyphs)
            glyphs[mapping[code]].draw(pen)
            drawings.append(pen.value)
        assert drawings[0] == drawings[1], f"Changed glyph outline: {character} / {style}"
    manifest["faces"].append({
        "style": style,
        "file": target.name,
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "characters": sorted(emitted_map),
        "source_file": source.name,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    })
    print(f"{target.name}: {target.stat().st_size:,} bytes")
(root / "assets/fonts/opening-coverage.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
