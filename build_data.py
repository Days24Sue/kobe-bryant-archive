#!/usr/bin/env python3
"""Create the static site's searchable index from the existing archive CSVs."""

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "database"
OUTPUT = ROOT / "archive-data.js"
COLLECTIONS = (
    ("timeline", "时间线"),
    ("interviews", "访谈"),
    ("writings", "写作"),
    ("creations", "创作"),
    ("media_articles", "报道"),
    ("quotes", "引言"),
)


def main() -> None:
    records = []
    for filename, label in COLLECTIONS:
        with (DATABASE / f"{filename}.csv").open(newline="", encoding="utf-8-sig") as source:
            for row in csv.DictReader(source):
                records.append(
                    {
                        "id": row["id"],
                        "category": filename,
                        "categoryLabel": label,
                        "title": row.get("title") or row.get("quote_text", ""),
                        "date": row["date"],
                        "source": row["source"],
                        "url": row["url"],
                        "format": row.get("format", "original quote"),
                        "description": row.get("why_it_matters", ""),
                    }
                )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(f"window.ARCHIVE_RECORDS = {payload};\n", encoding="utf-8")
    print(f"Built {len(records)} searchable records in {OUTPUT}")


if __name__ == "__main__":
    main()
