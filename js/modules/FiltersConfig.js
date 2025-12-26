// FiltersConfig.js

export const FiltersConfig = {
  creatures: [
    { key: 'creature_class', label: 'Класс существа', dictKey: 'creature_class' },
    { key: 'creature_type', label: 'Тип / вид', dictKey: 'creature_type' },
    { key: 'danger_rank', label: 'Опасность', dictKey: 'danger_rank' },
    { key: 'habitat', label: 'Среда обитания', dictKey: 'habitat', multi: true },
    { key: 'intellect', label: 'Интеллект', dictKey: 'intellect' },
    { key: 'status', label: 'Статус', dictKey: 'creature_status' },
    { key: 'size_category', label: 'Размер', dictKey: 'size_category' },
    { key: 'origin', label: 'Происхождение', dictKey: 'origin' }
  ],
  artifacts: [
    { key: 'power_class', label: 'Класс силы', dictKey: 'power_class' },
    { key: 'artifact_type', label: 'Тип артефакта', dictKey: 'artifact_type' },
    { key: 'material', label: 'Материал', dictKey: 'material' },
    { key: 'effect_scope', label: 'Эффект', dictKey: 'effect_scope' },
    { key: 'status', label: 'Статус', dictKey: 'artifact_status' },
    { key: 'epoch', label: 'Эпоха', dictKey: 'epoch' },
    { key: 'binding_type', label: 'Тип привязки', dictKey: 'binding_type' }
  ],
  gods: [
    { key: 'deity_rank', label: 'Уровень божества', dictKey: 'deity_rank' },
    { key: 'domain', label: 'Сфера влияния', dictKey: 'domain' },
    { key: 'pantheon', label: 'Пантеон', dictKey: 'pantheon' },
    { key: 'aspect', label: 'Аспект', dictKey: 'aspect' },
    { key: 'worship_type', label: 'Тип поклонения', dictKey: 'worship_type' },
    { key: 'status', label: 'Статус', dictKey: 'god_status' }
  ],
  races: [
    { key: 'race_category', label: 'Категория расы', dictKey: 'race_category' },
    { key: 'cultural_trait', label: 'Культурная черта', dictKey: 'cultural_trait' },
    { key: 'civilization_type', label: 'Тип цивилизации', dictKey: 'civilization_type' },
    { key: 'development_level', label: 'Уровень развития', dictKey: 'development_level' },
    { key: 'habitat', label: 'Среда проживания', dictKey: 'race_habitat', multi: true },
    { key: 'political_system', label: 'Политический строй', dictKey: 'political_system' },
    { key: 'religion_model', label: 'Религиозность', dictKey: 'religion_model' },
    { key: 'language_group', label: 'Языковая группа', dictKey: 'language_group' },
    { key: 'people_issue', label: 'Проблематика', dictKey: 'people_issue' }
  ],
  locations: [
    { key: 'location_type', label: 'Тип локации', dictKey: 'location_type' },
    { key: 'region', label: 'Регион', dictKey: 'region' },
    { key: 'climate', label: 'Климат', dictKey: 'climate' },
    { key: 'danger_rank', label: 'Опасность', dictKey: 'danger_rank' },
    { key: 'status', label: 'Статус', dictKey: 'location_status' },
    { key: 'dominant_power', label: 'Доминирующая сила', dictKey: 'dominant_power' }
  ],
  magic: [
    { key: 'magic_category', label: 'Категория магии', dictKey: 'magic_category' },
    { key: 'magic_nature', label: 'Природа магии', dictKey: 'magic_nature' },
    { key: 'impact_level', label: 'Уровень воздействия', dictKey: 'impact_level' },
    { key: 'stability', label: 'Стабильность', dictKey: 'stability' },
    { key: 'manifestation_form', label: 'Форма проявления', dictKey: 'manifestation_form' },
    { key: 'theme', label: 'Тематика', dictKey: 'theme' },
    { key: 'energy_type', label: 'Тип энергии', dictKey: 'energy_type' }
  ],
  languages: [
    { key: 'language_family', label: 'Языковая семья', dictKey: 'language_family' },
    { key: 'script_type', label: 'Тип письма', dictKey: 'script_type' },
    { key: 'complexity', label: 'Сложность', dictKey: 'complexity' },
    { key: 'status', label: 'Статус', dictKey: 'language_status' },
    { key: 'spread', label: 'Распространенность', dictKey: 'spread' }
  ],
  heroes: [
    { key: 'role', label: 'Роль', dictKey: 'hero_role' },
    { key: 'influence_level', label: 'Уровень влияния', dictKey: 'influence_level' },
    { key: 'affiliation', label: 'Принадлежность', dictKey: 'affiliation' },
    { key: 'power_type', label: 'Тип силы', dictKey: 'power_type' },
    { key: 'history_status', label: 'Статус в истории', dictKey: 'history_status' }
  ]
};
