import json
import shutil
import os

# Укажи нужный путь к файлу
FILE_PATH = "undead.json"  # например: "data/creatures/undead.json"

def fix_json_syntax(raw: str) -> str:
    # Исправляем случаи типа "}  {" и "}\n  {"
    fixed = raw.replace("}  {", "},  {")
    fixed = fixed.replace("}\n  {", "},\n  {")
    return fixed

def normalize_keys(data):
    for obj in data:
        # Если нет корректного поля характера, но есть одна из опечаток — переносим
        if "temperament" not in obj:
            for wrong_key in ("temperatism", "temperмент"):
                if wrong_key in obj:
                    obj["temperament"] = obj[wrong_key]
                    del obj[wrong_key]
        else:
            # Чистим возможные мусорные дубли, если они остались
            for wrong_key in ("temperatism", "temperмент"):
                if wrong_key in obj:
                    del obj[wrong_key]
    return data

def main():
    path = FILE_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Файл не найден: {path}")

    backup_path = path + ".bak"
    # Резервная копия
    shutil.copy2(path, backup_path)

    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()

    # 1. Минимальная правка синтаксиса
    raw_fixed = fix_json_syntax(raw)

    # 2. Парсим JSON
    data = json.loads(raw_fixed)

    # 3. Нормализуем ключи
    data = normalize_keys(data)

    # 4. Перезаписываем файл аккуратно отформатированным JSON
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Готово: файл исправлен, резервная копия сохранена как", backup_path)

if __name__ == "__main__":
    main()
