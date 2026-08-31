export const NEED_KEYS = [
  'material',
  'security',
  'social',
  'respect',
  'development',
  'selfRealization',
  'physicalComfort',
] as const;

export type NeedKey = (typeof NEED_KEYS)[number];

export type NeedMark = 'K' | 'OT';

export const NEED_LABELS: Record<NeedKey, string> = {
  material: 'Материальные',
  security: 'Потребность в безопасности',
  social: 'Социальные',
  respect: 'Потребность в уважении',
  development: 'Потребность в развитии',
  selfRealization: 'Потребность в самореализации',
  physicalComfort: 'Потребность в физическом удобстве',
};

export const NEED_TOOLTIPS: Record<NeedKey, string> = {
  material: 'Достойная зарплата, бонусы, предсказуемость дохода.',
  security: 'Стабильность, понятные правила, отсутствие хаоса.',
  social: 'Принадлежность к команде, нормальные отношения, поддержка.',
  respect: 'Признание, статус, доверие, влияние.',
  development: 'Обучение, рост, новые задачи.',
  selfRealization: 'Смысл, интерес, возможность реализовать сильные стороны.',
  physicalComfort:
    'График/режим работы, гигиенические условия труда, удалённость рабочего места от дома и т.д.',
};

export type LeadershipStyle =
  | 'instructing'
  | 'supporting'
  | 'directing'
  | 'trusting'
  | null;

export const LEADERSHIP_OPTIONS: {
  value: Exclude<LeadershipStyle, null>;
  label: string;
  description: string;
  features: string;
  communication: string;
  whenToUse: string;
}[] = [
  {
    value: 'instructing',
    label: 'Инструктирующий',
    description:
      'Руководитель четко ставит задачу, объясняет шаги, контролирует выполнение.',
    features:
      'Высокая конкретика, минимум свободы, сильный акцент на инструкции и сроках.',
    communication: 'Коротко, ясно, по шагам, без лишней абстракции.',
    whenToUse:
      'С новичками, в критичных задачах, при низкой мотивации и низкой компетентности.',
  },
  {
    value: 'directing',
    label: 'Направляющий',
    description:
      'Руководитель задает цель и рамки, но уже вовлекает сотрудника в обсуждение способов решения.',
    features:
      'Больше объяснений, контроль сохраняется, но появляется пространство для инициативы.',
    communication:
      '«Вот цель, вот ограничения, давай обсудим лучший способ сделать это».',
    whenToUse:
      'Со специалистами, у которых есть база, но нужна структурность и поддержка в принятии решений.',
  },
  {
    value: 'supporting',
    label: 'Поддерживающий',
    description:
      'Руководитель меньше директивен, больше помогает, снимает барьеры, поддерживает уверенность сотрудника.',
    features:
      'Фокус на мотивации, доверии, обратной связи и развитии самостоятельности.',
    communication:
      '«Ты уже умеешь это делать, что тебе сейчас нужно от меня, чтобы двинуться дальше?»',
    whenToUse:
      'С мотивированными сотрудниками среднего/высокого уровня, если нужна поддержка, адаптация или рост.',
  },
  {
    value: 'trusting',
    label: 'Доверяющий',
    description:
      'Руководитель передает ответственность, почти не вмешивается в способ выполнения, контролирует по результату.',
    features:
      'Максимум автономии, минимум микроменеджмента, высокая ответственность сотрудника за итог.',
    communication:
      '«Зона ответственности за тобой, договоримся о контрольных точках и результате».',
    whenToUse:
      'С сильными, самостоятельными и мотивированными сотрудниками, которым важно доверие и свобода.',
  },
];

export const LEADERSHIP_GUIDELINES = [
  'Оценить задачу: насколько она новая, рискованная и срочная.',
  'Оценить сотрудника по двум шкалам: мотивация и компетентность.',
  'Выбрать стиль, который соответствует текущей готовности, а не «любимому» стилю руководителя.',
  'Согласовать формат общения, контроль и частоту обратной связи.',
  'Пересматривать стиль по мере роста сотрудника и изменения ситуации.',
];

export const LEADERSHIP_REMEMBER = [
  'Эффективный стиль руководства — это не фиксированная манера, а управленческий выбор под ситуацию и уровень сотрудника.',
  'Чем точнее руководитель соотносит стиль с мотивацией и компетентностью, тем выше шанс на результат без лишнего давления и потерь вовлеченности.',
];

export type FeedbackType = 'supporting' | 'correcting' | 'developing' | null;

export const FEEDBACK_OPTIONS: {
  value: Exclude<FeedbackType, null>;
  label: string;
  description: string;
}[] = [
  {
    value: 'supporting',
    label: 'Поддерживающая',
    description:
      'Фокусируется на успехах: что получилось, какие действия привели к хорошему результату, что стоит повторять дальше. Такой фидбек повышает уверенность и мотивацию.',
  },
  {
    value: 'correcting',
    label: 'Корректирующая',
    description:
      'Нужна, когда поведение или результат не соответствуют ожиданиям. Здесь важно говорить спокойно и конкретно: что произошло, какой был эффект, что нужно изменить.',
  },
  {
    value: 'developing',
    label: 'Развивающая',
    description:
      'Помогает сотруднику расти в навыках и самостоятельности. Руководитель не только указывает на текущий результат, но и подсказывает, как выйти на следующий уровень.',
  },
];

export const FEEDBACK_RULES = [
  {
    title: 'Говорите о конкретных действиях, а не о личности.',
    example:
      '«Ты плохо подготовил отчет» – плохо. «В отчете не хватает данных по продажам за прошлый месяц» – хорошо.',
  },
  {
    title: 'Говорите о последствиях.',
    example: 'Что произошло из-за этих действий? «Из-за этого мы не смогли вовремя согласовать бюджет».',
  },
  {
    title: 'Предлагайте решение или спрашивайте идеи.',
    example: '«Давай подумаем, как сделать так, чтобы данные подтягивались автоматически?»',
  },
  {
    title: 'Заканчивайте на позитиве.',
    example: '«В остальном отчет отличный, спасибо за работу».',
  },
];

export const FEEDBACK_HOW_TO = [
  'Говорить конкретно, с примерами, а не общими фразами.',
  'Опираться на факты, а не на эмоции и ярлыки.',
  'Критиковать действия, а не человека.',
  'Давать обратную связь как можно ближе к событию, пока контекст ещё свежий.',
  'Заканчивать фидбек ясным ожиданием: что сотрудник должен сделать дальше.',
];

export const FEEDBACK_REMEMBER = [
  'Обратная связь должна помогать сотруднику действовать лучше, а не защищаться.',
  'Если она слишком размытая, поздняя или агрессивная, она теряет ценность и ухудшает отношения в команде.',
];

export const CRITICISM_RULES = [
  'Выслушайте объяснение.',
  'Сохраняйте ровный тон.',
  'Сначала похвала, потом критика.',
  'Критикуйте поступки и действия, а не человека.',
  'Не ищите «крайнего», на которого можно скинуть всю ответственность.',
  'Ищем решение вместе, а не обвиняем.',
  'Критика one-on-one. Никакой прилюдной порки!',
  'Ничто так не разоружает, как условия почётной капитуляции.',
  'Выкладывайте претензии по мере обнаружения, не копите их.',
  'Оцените ситуацию: нет ли здесь вашей вины.',
];

export interface FeedbackModelSection {
  heading?: string;
  paragraphs: string[];
}

export interface FeedbackModel {
  key: string;
  title: string;
  sections: FeedbackModelSection[];
}

export const FEEDBACK_MODELS: FeedbackModel[] = [
  {
    key: 'sbi',
    title: 'SBI',
    sections: [
      {
        paragraphs: [
          'SBI — это модель обратной связи Situation – Behavior – Impact: ситуация — поведение — влияние.',
          'Её используют, чтобы давать фидбек конкретно и без оценок личности.',
          'Модель SBI помогает не скатываться в фразы вроде «ты всегда…» или «ты безответственный», а говорить о фактах и последствиях. Это делает обратную связь понятнее и снижает защитную реакцию сотрудника.',
        ],
      },
      {
        heading: 'Где полезна',
        paragraphs: [
          'SBI подходит и для корректирующей, и для позитивной обратной связи. Если нужно похвалить сотрудника, структура та же: ситуация, поведение, эффект.',
        ],
      },
      {
        heading: 'Как работает',
        paragraphs: [
          'Situation — в какой ситуации это произошло, когда и где.',
          'Behavior — какое конкретно поведение ты заметил.',
          'Impact — к чему это привело для тебя, команды или результата.',
        ],
      },
      {
        heading: 'Пример',
        paragraphs: [
          '«На вчерашнем созвоне с заказчиком ты не предупредил заранее, что задача не готова. В результате мы не смогли сразу согласовать следующие шаги и потеряли время на встрече»',
        ],
      },
    ],
  },
  {
    key: 'sandwich',
    title: 'Бутерброд',
    sections: [
      {
        paragraphs: [
          'Бутерброд — это способ обратной связи, где сначала дают похвалу, потом замечание, а в конце снова поддержку. Идея в том, чтобы смягчить неприятный разговор и не демотивировать сотрудника.',
        ],
      },
      {
        heading: 'Как устроен',
        paragraphs: [
          'Первый слой — что получилось хорошо.',
          'Начинка — что нужно исправить.',
          'Второй слой — чем завершить разговор, чтобы сохранить рабочий настрой.',
        ],
      },
      {
        heading: 'Зачем используют',
        paragraphs: [
          'Такой формат помогает руководителю донести критику мягче и сохранить отношения. В ИТ-командах его часто применяют, когда нужно указать на ошибку, но не обесценить вклад человека.',
        ],
      },
      {
        heading: 'Важный нюанс',
        paragraphs: [
          'Метод работает не всегда: если «похвала» выглядит формально, сотрудник сразу понимает, что дальше будет критика, и фраза теряет силу. Поэтому лучше, когда поддержка и замечание звучат естественно и по делу.',
        ],
      },
      {
        heading: 'Пример',
        paragraphs: [
          '«Ты хорошо подготовил демо и уверенно отвечал на вопросы. Но в отчете были неточности по срокам. В целом ты хорошо держишь контекст, давай в следующий раз отдельно проверим цифры перед отправкой».',
        ],
      },
    ],
  },
  {
    key: 'pops',
    title: 'ПОПС',
    sections: [
      {
        paragraphs: [
          'ПОПС — это формула для краткого аргументированного ответа: Позиция — Обоснование — Пример — Следствие. Её используют, чтобы быстро и логично сформулировать мнение по теме.',
        ],
      },
      {
        heading: 'Как расшифровывается',
        paragraphs: [
          'П — позиция: «Я считаю, что…»',
          'О — обоснование: «Потому что…»',
          'П — пример: «Например…»',
          'С — следствие: «Из этого следует…»',
        ],
      },
      {
        heading: 'Где применяется',
        paragraphs: [
          'ПОПС часто используют в обучении, на обсуждениях и в письменных ответах, когда нужно не просто высказать мнение, а сразу его аргументировать.',
        ],
      },
      {
        heading: 'Пример',
        paragraphs: [
          '«Я считаю, что обратная связь должна быть своевременной, потому что иначе сотрудник не понимает, что именно нужно изменить. Например, если замечание дать через месяц, контекст уже потеряется. Из этого следует, что фидбек лучше давать сразу после события»',
        ],
      },
    ],
  },
  {
    key: 'care',
    title: 'CARE',
    sections: [
      {
        paragraphs: [
          'CARE — это модель обратной связи, где обычно каждая буква означает отдельный шаг: Context, Action, Result, Expectation или близкий по смыслу вариант в разных компаниях и методиках. В управленческом контексте её используют, чтобы давать фидбек структурно: описать контекст, назвать действие, показать результат и обозначить ожидание на будущее.',
        ],
      },
      {
        heading: 'Как понимать CARE',
        paragraphs: [
          'C — Context: в какой ситуации это произошло.',
          'A — Action: какое действие или поведение было.',
          'R — Result: к чему это привело.',
          'E — Expectation: что ожидается дальше.',
        ],
      },
      {
        heading: 'Зачем она нужна',
        paragraphs: [
          'Эта схема помогает говорить не общими фразами, а по делу: что именно произошло, почему это важно и как сотруднику скорректировать поведение. Она удобна для тимлидов, потому что делает обратную связь спокойной, ясной и не персонально-оценочной.',
        ],
      },
      {
        heading: 'Пример',
        paragraphs: [
          '«На вчерашнем созвоне с заказчиком ты не предупредил о риске сдвига сроков. Из-за этого у команды не было времени подготовить план. В следующий раз важно сообщать о блокерах заранее».',
        ],
      },
    ],
  },
];

export interface NeedState {
  percent: number;
  mark: NeedMark;
  comment: string;
}

export type NeedsMap = Record<NeedKey, NeedState>;

export const METRIC_MAX = 10;

export interface MetricPreset {
  key: string;
  name: string;
  shortName: string;
  description: string;
}

/** Базовый набор метрик для оценки сотрудника */
export const METRIC_PRESETS: MetricPreset[] = [
  {
    key: 'quality',
    name: 'Качество работы',
    shortName: 'Качество',
    description: 'Насколько результат соответствует ожиданиям и стандартам.',
  },
  {
    key: 'speed',
    name: 'Скорость выполнения',
    shortName: 'Скорость',
    description: 'Темп работы и соблюдение сроков.',
  },
  {
    key: 'reliability',
    name: 'Надёжность',
    shortName: 'Надёжность',
    description: 'Предсказуемость, ответственность, выполнение договорённостей.',
  },
  {
    key: 'communication',
    name: 'Коммуникация',
    shortName: 'Коммуникация',
    description: 'Ясность общения, обратная связь, эскалация проблем.',
  },
  {
    key: 'initiative',
    name: 'Инициатива',
    shortName: 'Инициатива',
    description: 'Предложения улучшений, проактивность без напоминаний.',
  },
  {
    key: 'teamwork',
    name: 'Командная работа',
    shortName: 'Команда',
    description: 'Сотрудничество, помощь коллегам, вклад в общий результат.',
  },
  {
    key: 'expertise',
    name: 'Экспертиза',
    shortName: 'Экспертиза',
    description: 'Глубина профессиональных знаний и навыков.',
  },
  {
    key: 'independence',
    name: 'Самостоятельность',
    shortName: 'Автономия',
    description: 'Способность решать задачи без постоянного контроля.',
  },
  {
    key: 'learning',
    name: 'Обучаемость',
    shortName: 'Обучаемость',
    description: 'Скорость освоения нового и применение на практике.',
  },
  {
    key: 'decisions',
    name: 'Принятие решений',
    shortName: 'Решения',
    description: 'Качество и своевременность решений в зоне ответственности.',
  },
];

export interface EmployeeMetric {
  id: string;
  name: string;
  shortName: string;
  value: number;
  comment: string;
  /** Ключ пресета, если метрика из базового набора */
  presetKey?: string;
}

export interface SavedNote {
  id: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  needs: NeedsMap;
  metrics: EmployeeMetric[];
  leadershipStyle: LeadershipStyle;
  oneToOneNotes: SavedNote[];
  delegationNotes: SavedNote[];
  feedbackType: FeedbackType;
  feedbackNotes: string;
  createdAt: number;
}

export function createEmptyNeeds(): NeedsMap {
  return NEED_KEYS.reduce((acc, key) => {
    acc[key] = { percent: 0, mark: 'K', comment: '' };
    return acc;
  }, {} as NeedsMap);
}

export function createEmployee(firstName: string, lastName: string): Employee {
  return {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    needs: createEmptyNeeds(),
    metrics: [],
    leadershipStyle: null,
    oneToOneNotes: [],
    delegationNotes: [],
    feedbackType: null,
    feedbackNotes: '',
    createdAt: Date.now(),
  };
}

export function normalizeSavedNotes(value: unknown): SavedNote[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (note): note is SavedNote =>
          !!note &&
          typeof note === 'object' &&
          typeof note.id === 'string' &&
          typeof note.text === 'string' &&
          typeof note.createdAt === 'number',
      )
      .map((note) => ({
        ...note,
        updatedAt: typeof note.updatedAt === 'number' ? note.updatedAt : note.createdAt,
      }));
  }

  if (typeof value === 'string' && value.trim()) {
    const now = Date.now();
    return [
      {
        id: crypto.randomUUID(),
        text: value,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  return [];
}

export function normalizeMetrics(value: unknown): EmployeeMetric[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (metric): metric is EmployeeMetric =>
        !!metric &&
        typeof metric === 'object' &&
        typeof metric.id === 'string' &&
        typeof metric.name === 'string' &&
        typeof metric.value === 'number',
    )
    .map((metric) => ({
      id: metric.id,
      name: metric.name,
      shortName:
        typeof metric.shortName === 'string' && metric.shortName.trim()
          ? metric.shortName
          : metric.name,
      value: Math.min(METRIC_MAX, Math.max(0, Math.round(metric.value))),
      comment: typeof metric.comment === 'string' ? metric.comment : '',
      presetKey: typeof metric.presetKey === 'string' ? metric.presetKey : undefined,
    }));
}

export function createMetricFromPreset(preset: MetricPreset): EmployeeMetric {
  return {
    id: crypto.randomUUID(),
    name: preset.name,
    shortName: preset.shortName,
    value: 0,
    comment: '',
    presetKey: preset.key,
  };
}

export function createCustomMetric(name: string): EmployeeMetric {
  const trimmed = name.trim();
  return {
    id: crypto.randomUUID(),
    name: trimmed,
    shortName: trimmed.length > 14 ? `${trimmed.slice(0, 13)}…` : trimmed,
    value: 0,
    comment: '',
  };
}

export function normalizeEmployee(employee: Employee): Employee {
  return {
    ...employee,
    metrics: normalizeMetrics(employee.metrics),
    oneToOneNotes: normalizeSavedNotes(employee.oneToOneNotes),
    delegationNotes: normalizeSavedNotes(employee.delegationNotes),
    feedbackType: employee.feedbackType ?? null,
    feedbackNotes: employee.feedbackNotes ?? '',
  };
}

export function getUnusedPercent(needs: NeedsMap): number {
  const used = NEED_KEYS.reduce((sum, key) => sum + needs[key].percent, 0);
  return 100 - used;
}

export function getFullName(employee: Employee): string {
  return `${employee.lastName} ${employee.firstName}`.trim();
}
