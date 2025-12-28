# tools/scripts/patch_beasts_scalor_v2.py
# Запуск:
#   cd "E:\OneDrive\Рабочий стол\bestiary_A_fresh"
#   python tools\scripts\patch_beasts_scalor_v2.py
#
# Делает Скалора эталонным: добавляет canonical-архитектуру в поле "v2",
# не ломая текущую схему, которую читает фронт.

from __future__ import annotations

import json
import re
from pathlib import Path
from datetime import datetime
import shutil


ROOT = Path(__file__).resolve().parents[2]
BEASTS_PATH = ROOT / "data" / "creatures" / "beasts.json"


def backup_file(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    bak = path.with_suffix(path.suffix + f".bak_{ts}")
    shutil.copy2(path, bak)
    return bak


def split_csv(text: str) -> list[str]:
    if not text:
        return []
    return [s.strip() for s in re.split(r",", text) if s.strip()]


def main() -> None:
    if not BEASTS_PATH.exists():
        raise SystemExit(f"Не найден файл: {BEASTS_PATH}")

    data = json.loads(BEASTS_PATH.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise SystemExit("beasts.json должен быть массивом объектов")

    idx = None
    scalor = None
    for i, obj in enumerate(data):
        if isinstance(obj, dict) and obj.get("id") == 12 and obj.get("name") == "Скалор":
            idx = i
            scalor = obj
            break

    if scalor is None:
        raise SystemExit("Не найден объект Скалора (id=12, name=Скалор)")

    # --- canonical v2 ---
    v2 = {
        "id": scalor.get("id"),
        "slug": "skalor",
        "name": scalor.get("name"),
        "category": "creatures",
        "subcategory": "beasts",
        "sources": [
            {
                "universe": "Авторское",
                "type": "author",
                "specificSource": "Nexus Mundorum"
            }
        ],
        "lore": {
            "summary": scalor.get("description", "").strip(),
            "epithets": ["Хозяин уступов"],
            "culturalNotes": [
                "Опасный засадный хищник горных регионов",
                "Символ охотников-скалолазов"
            ]
        },
        "classification": {
            "dangerRank": scalor.get("danger", "").strip(),
            "rarity": scalor.get("rarity", "").strip(),
            "habitat": split_csv(scalor.get("habitat", "")),
            "diet": ["хищник"],
            "originType": "естественное"
        },
        "biology": {
            "appearanceText": (
                "Серо-каменная шерсть и базальтовые когти позволяют Скалору сливаться со скалами; "
                "хвост с костяным утолщением служит противовесом и оружием."
            ),
            "size": {
                "lengthM": "1.3–1.6",
                "heightM": None,
                "weightKg": "более 100"
            },
            "lifespan": {
                "text": scalor.get("age", "").strip(),
                "maxYears": 18
            },
            "physiology": [
                "каменно-сухожильная структура скелета",
                "широкие лапы с базальтовыми когтями",
                "хвост с костяным утолщением"
            ]
        },
        "mind": {
            "intellectLevel": scalor.get("intellect", "").strip(),
            "temperament": [t.strip().lower() for t in re.split(r",", scalor.get("temperament", "")) if t.strip()],
            "psychologyText": (
                "Терпеливый и скрытный засадный хищник; долго выжидает идеальный момент атаки "
                "и избегает ненадежных уступов."
            )
        },
        "behavior": {
            "traits": ["одиночка", "территориальный", "засадный хищник", "скалолаз"],
            "patterns": scalor.get("behavior", []) if isinstance(scalor.get("behavior"), list) else [],
            "sociality": "одиночка",
            "behaviorDescription": (
                "Охотится преимущественно сверху, используя массу тела и эффект внезапности; "
                "способен подолгу оставаться неподвижным, сливаясь со скалой."
            )
        },
        "capabilities": {
            "physicalStrength": {
                "liftTons": None,
                "note": f"Общая оценка силы (старое поле power): {scalor.get('power', '').strip()}"
            },
            "magicLevel": scalor.get("magicLevel", "").strip(),
            "endurance": {
                "survivability": scalor.get("resilience", "").strip(),
                "regeneration": "нет"
            },
            "mobility": ["скалолазание", "прыжок с высоты"],
            "combatStyle": [a.get("name") for a in scalor.get("abilities", []) if isinstance(a, dict) and a.get("name")],
            "ranges": [
                {
                    "type": "атака сверху",
                    "distanceM": None,
                    "note": "Дистанция зависит от высоты уступа; требуется прямая траектория падения."
                }
            ]
        },
        "interactions": {
            "threats": ["мокрые скалы", "громкие звуки", "эхо"],
            "weaknesses": scalor.get("weaknesses", []) if isinstance(scalor.get("weaknesses"), list) else [],
            "resistances": [scalor.get("resilience", "").strip()] if scalor.get("resilience") else [],
            "predatorsOrRivals": [],
            "prey": []
        },
        "tags": {
            "aspects": [scalor.get("element", "").strip()] if scalor.get("element") else [],
            "biomes": ["горы"],
            "roles": ["хищник"],
            "status": ["живой"]
        },
        "media": {
            "gallery": [
                {
                    "src": scalor.get("image", "").strip(),
                    "caption": "Скалор",
                    "credit": "author"
                }
            ]
        },
        "ui": {
            "cardAccent": "beast",
            "featuredTags": ["dangerRank", "habitat", "diet", "rarity"]
        }
    }

    # Важно: не ломаем старую схему, добавляем v2
    scalor["v2"] = v2
    data[idx] = scalor

    backup_file(BEASTS_PATH)
    BEASTS_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    print("OK: Скалор обновлен. Добавлен блок v2 (canonical).")
    print(f"Файл: {BEASTS_PATH}")


if __name__ == "__main__":
    main()
