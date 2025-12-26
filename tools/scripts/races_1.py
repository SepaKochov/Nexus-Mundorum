import os
import json
import shutil
from typing import Any, Dict, Optional


def backup_file(path: str) -> str:
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Файл не найден: {path}")
    base = path + ".bak"
    if not os.path.exists(base):
        shutil.copy2(path, base)
        print(f"Сделан бэкап: {base}")
        return base
    i = 1
    while True:
        candidate = f"{base}.{i}"
        if not os.path.exists(candidate):
            shutil.copy2(path, candidate)
            print(f"Сделан бэкап: {candidate}")
            return candidate
        i += 1


def first_non_empty(*values: Any) -> Optional[Any]:
    for v in values:
        if v is None:
            continue
        if isinstance(v, str) and not v.strip():
            continue
        return v
    return None


def normalize_race_record(rec: Dict[str, Any]) -> bool:
    """
    Поднимает ключевые поля из base/extended на верхний уровень.
    Возвращает True, если запись была изменена.
    """
    changed = False

    base = rec.get("base") or {}
    ext = rec.get("extended") or {}

    def ensure_field(key: str, value: Any):
        nonlocal changed
        if value is None:
            return
        if key in rec and rec[key] not in (None, ""):
            return
        rec[key] = value
        changed = True

    # Из base
    ensure_field("raceType", first_non_empty(rec.get("raceType"), base.get("race_type")))
    ensure_field("originType", first_non_empty(rec.get("originType"), base.get("origin")))
    ensure_field("habitat", first_non_empty(rec.get("habitat"), base.get("habitat")))
    ensure_field("temperament", first_non_empty(rec.get("temperament"), base.get("character")))
    ensure_field("heightRange", first_non_empty(rec.get("heightRange"), base.get("height")))
    ensure_field("skin", first_non_empty(rec.get("skin"), base.get("skin_color")))
    ensure_field("lifespan", first_non_empty(rec.get("lifespan"), base.get("longevity")))
    ensure_field("aspect", first_non_empty(rec.get("aspect"), base.get("aspect"), ext.get("racial_aspect")))

    # Из extended
    ensure_field("magicAffinity", first_non_empty(rec.get("magicAffinity"), ext.get("magic_tendency")))
    ensure_field("societyType", first_non_empty(rec.get("societyType"), ext.get("society")))
    ensure_field("polityType", first_non_empty(rec.get("polityType"), ext.get("politics")))
    ensure_field("religiosity", first_non_empty(rec.get("religiosity"), ext.get("religion")))
    ensure_field("language", first_non_empty(rec.get("language"), ext.get("language")))
    ensure_field("innerProblems", first_non_empty(rec.get("innerProblems"), ext.get("issues")))

    factions = ext.get("factions")
    if factions is not None and "factions" not in rec:
        rec["factions"] = factions
        changed = True

    return changed


def process_file(filename: str) -> None:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, filename)

    if not os.path.isfile(path):
        print(f"Пропуск: файл не найден {path}")
        return

    print(f"Обработка файла: {path}")
    backup_file(path)

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError(f"Ожидался список записей в {path}")

    changed_count = 0
    for rec in data:
        if not isinstance(rec, dict):
            continue
        if normalize_race_record(rec):
            changed_count += 1

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Готово: изменено записей {changed_count} в {path}")


def main():
    process_file("main.json")
    process_file("sub.json")


if __name__ == "__main__":
    main()
