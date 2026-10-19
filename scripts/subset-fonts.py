"""Rebuild the local Chinese webfonts after changing copy.

Requires fonttools. Supply original GenSen Rounded 2 TW Regular/Bold OTFs.
Source: https://github.com/ButTaiwan/gensen-font at d347d3fffcb45e08857052433a0b432ed4f7ace8
The full originals are intentionally not shipped to visitors.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--regular", required=True, type=Path)
parser.add_argument("--bold", required=True, type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
sources = list(root.glob("*.html")) + [path for path in (root / "js").glob("*.js") if path.name not in ("copy-ja.js", "languages.js")] + list((root / "partials").glob("*.html"))
text = "".join(path.read_text(encoding="utf-8") for path in sources)
text += subprocess.check_output(["node", "--input-type=module", "-e", "import {languageSettings} from './js/languages.js'; const zh=languageSettings.zh; console.log(JSON.stringify([zh,zh.photo(12345,12345),zh.photoChoice(12345)]))"], cwd=root, text=True)
expected = {ord(char) for char in text if 0x3400 <= ord(char) <= 0x9FFF}
manifest = {"source": "ButTaiwan/gensen-font@d347d3fffcb45e08857052433a0b432ed4f7ace8", "fonts": {}}
for weight, original, expected_blob in [
    ("regular", args.regular, "186c5cc15a45676c9c6024db3189e3e413e16151"),
    ("bold", args.bold, "76404630bc313190aaa85b09d8d7a41abdf000de"),
]:
    data = original.read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    if blob != expected_blob:
        raise SystemExit(f"{original}: source font differs from the documented upstream version")
    font = TTFont(original)
    if expected - set(font.getBestCmap()):
        raise SystemExit("The upstream font does not cover all Chinese copy")
    options = subset.Options()
    options.flavor = "woff"
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff"
    output = root / f"assets/fonts/gensen-rounded-tw-{weight}.woff"
    font.save(output)
    # Read the emitted font, rather than merely recording requested characters.
    emitted = TTFont(output)
    manifest["fonts"][weight] = {
        "file": output.name,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "characters": sorted(emitted.getBestCmap()),
    }
    print(f"{output.name}: {output.stat().st_size:,} bytes, no missing Chinese glyphs")
(root / "assets/fonts/gensen-coverage.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
