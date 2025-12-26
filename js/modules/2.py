import os
from datetime import datetime

def main():
    path = os.path.join("js", "TagSystem.js")
    if not os.path.isfile(path):
        print(f"[ERROR] Файл {path} не найден")
        return

    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    old_block = '''  if (sec === "artifacts") {
    // weapons.json: class_power, subtype, small_card.*
    push(entity.class_power || entity.powerClass);
    push(entity.subtype || entity.artifactType);

    if (entity.small_card && typeof entity.small_card === "object") {
      push(entity.small_card.type || entity.small_card["тип"]);
      push(entity.small_card.usage || entity.small_card["назначение"]);
      push(entity.small_card.aspect || entity.small_card["аспект"]);
    }
  } else if (sec === "locations") {'''

    if old_block not in text:
        print("[ERROR] Ожидаемый блок для artifacts/locations в TagSystem.js не найден")
        return

    new_block = '''  if (sec === "creatures") {
    // Унифицированные теги для существ (beasts, aberrations и т.п.)

    // Базовый тип и класс
    push(entity.kind);
    push(entity.type);

    // Опасность
    if (entity.danger) {
      push(`Опасность ${String(entity.danger).toUpperCase()}`);
    }

    // Среда, происхождение, элементы
    push(entity.element);
    push(entity.origin);
    push(entity.habitat);
    push(entity.biome);

    // Интеллект, темперамент, размер, скорость
    push(entity.intellect);
    push(entity.temperament);
    push(entity.size);
    push(entity.speed);

    // Роль, редкость, поведение, уровень магии
    push(entity.role);
    push(entity.rarity);
    push(entity.behavior);
    push(entity.magicLevel);
  } else if (sec === "artifacts") {
    // weapons.json: class_power, subtype, small_card.*
    push(entity.class_power || entity.powerClass);
    push(entity.subtype || entity.artifactType);

    if (entity.small_card && typeof entity.small_card === "object") {
      push(entity.small_card.type || entity.small_card["тип"]);
      push(entity.small_card.usage || entity.small_card["назначение"]);
      push(entity.small_card.aspect || entity.small_card["аспект"]);
    }
  } else if (sec === "locations") {'''

    backup_name = f"js/TagSystem.js.bak_creatures_tags_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    with open(backup_name, "w", encoding="utf-8") as bf:
        bf.write(text)

    text = text.replace(old_block, new_block)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

    print("[OK] Ветка sec === \"creatures\" добавлена, TagSystem.js обновлен.")
    print(f"[OK] Бэкап: {backup_name}")

if __name__ == "__main__":
    main()
