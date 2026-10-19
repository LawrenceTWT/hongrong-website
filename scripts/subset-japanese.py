"""Build the self-hosted Japanese font from the pinned upstream Noto Sans JP.

Requires fonttools[woff] and Node. The full source stays outside the repository.
Usage: python scripts/subset-japanese.py --source /path/to/NotoSansJP-VF.ttf
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--source", required=True, type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
data = args.source.read_bytes()
blob = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
if blob != "12bd91340893f5b28ca26b99528a19f5f2fd7e89":
    raise SystemExit("Source differs from notofonts/noto-cjk@f8d157532fbfaeda587e826d4cd5b21a49186f7c")
text = subprocess.check_output([
    "node", "--input-type=module", "-e",
    "import {japaneseCopy,japanesePageMetadata} from './js/copy-ja.js'; import {languageSettings} from './js/languages.js'; console.log(JSON.stringify([japaneseCopy,japanesePageMetadata,languageSettings.ja,languageSettings.ja.photo(12345,12345),languageSettings.ja.photoChoice(12345)]))",
], cwd=root, text=True)
# Include the complete kana, Japanese punctuation, and Latin sets for controls
# and user-entered names; future new kanji are checked by validate.mjs.
characters = {ord(char) for char in text} | set(range(0x20, 0x7F)) | set(range(0x3000, 0x3100))
font = TTFont(args.source)
cmap = font.getBestCmap()
required = {ord(char) for char in text if ord(char) >= 0x3000}
if required - set(cmap):
    raise SystemExit("Upstream font is missing Japanese copy characters")
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=characters & set(cmap))
subsetter.subset(font)
font.flavor = "woff2"
output = root / "assets/fonts/noto-sans-jp.woff2"
font.save(output)
emitted = TTFont(output)
manifest = {
    "source": "notofonts/noto-cjk@f8d157532fbfaeda587e826d4cd5b21a49186f7c",
    "sourceFile": "Sans/Variable/TTF/Subset/NotoSansJP-VF.ttf",
    "sourceBlob": blob,
    "file": output.name,
    "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "weights": [100, 900],
    "characters": sorted(emitted.getBestCmap()),
}
(root / "assets/fonts/noto-jp-coverage.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{output.name}: {output.stat().st_size:,} bytes; Japanese copy covered, variable weight retained")
