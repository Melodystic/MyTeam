import type {
  FeedbackType,
  LeadershipStyle,
  NeedKey,
} from '../types/employee';
import type { AppLocale } from './ui';

interface LeadershipOptionCopy {
  readonly value: Exclude<LeadershipStyle, null>;
  readonly label: string;
  readonly description: string;
  readonly features: string;
  readonly communication: string;
  readonly whenToUse: string;
}

interface OneToOneAgendaItemCopy {
  readonly stage: string;
  readonly time: string;
  readonly manager: string;
  readonly employee: string;
}

interface SmartCriterionCopy {
  readonly letter: 'S' | 'M' | 'A' | 'R' | 'T';
  readonly word:
    | 'Specific'
    | 'Measurable'
    | 'Achievable'
    | 'Relevant'
    | 'Time-bound';
  readonly label: string;
  readonly description: string;
}

interface TaskSettingMethodCopy {
  readonly key: 'algorithm' | 'result' | 'problem';
  readonly title: string;
  readonly intro: string;
  readonly howTo: readonly string[];
  readonly whenToUse: readonly string[];
  readonly pros: readonly string[];
  readonly cons: readonly string[];
}

interface FeedbackOptionCopy {
  readonly value: Exclude<FeedbackType, null>;
  readonly label: string;
  readonly description: string;
}

interface FeedbackRuleCopy {
  readonly title: string;
  readonly example: string;
}

interface FeedbackModelSectionCopy {
  readonly heading?: string;
  readonly paragraphs: readonly string[];
}

interface FeedbackModelCopy {
  readonly key: 'sbi' | 'sandwich' | 'pops' | 'care';
  readonly title: string;
  readonly sections: readonly FeedbackModelSectionCopy[];
}

interface MetricPresetCopy {
  readonly key:
    | 'quality'
    | 'speed'
    | 'reliability'
    | 'communication'
    | 'initiative'
    | 'teamwork'
    | 'expertise'
    | 'independence'
    | 'learning'
    | 'decisions';
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
}

export interface DomainCopy {
  readonly NEED_LABELS: Readonly<Record<NeedKey, string>>;
  readonly NEED_TOOLTIPS: Readonly<Record<NeedKey, string>>;
  readonly LEADERSHIP_OPTIONS: readonly LeadershipOptionCopy[];
  readonly LEADERSHIP_GUIDELINES: readonly string[];
  readonly LEADERSHIP_REMEMBER: readonly string[];
  readonly ONE_TO_ONE_GOAL: string;
  readonly ONE_TO_ONE_FREQUENCY: readonly string[];
  readonly ONE_TO_ONE_AGENDA: readonly OneToOneAgendaItemCopy[];
  readonly SMART_CRITERIA: readonly SmartCriterionCopy[];
  readonly TASK_SETTING_METHODS: readonly TaskSettingMethodCopy[];
  readonly DELEGATION_DO: readonly string[];
  readonly DELEGATION_DONT: readonly string[];
  readonly FEEDBACK_OPTIONS: readonly FeedbackOptionCopy[];
  readonly FEEDBACK_RULES: readonly FeedbackRuleCopy[];
  readonly FEEDBACK_HOW_TO: readonly string[];
  readonly FEEDBACK_REMEMBER: readonly string[];
  readonly CRITICISM_RULES: readonly string[];
  readonly FEEDBACK_MODELS: readonly FeedbackModelCopy[];
  readonly METRIC_PRESETS: readonly MetricPresetCopy[];
}

export const DOMAIN_COPY = {
  ru: {
    NEED_LABELS: {
      material: 'Материальные',
      security: 'Потребность в безопасности',
      social: 'Социальные',
      respect: 'Потребность в уважении',
      development: 'Потребность в развитии',
      selfRealization: 'Потребность в самореализации',
      physicalComfort: 'Потребность в физическом удобстве',
    },
    NEED_TOOLTIPS: {
      material: 'Достойная зарплата, бонусы, предсказуемость дохода.',
      security: 'Стабильность, понятные правила, отсутствие хаоса.',
      social: 'Принадлежность к команде, нормальные отношения, поддержка.',
      respect: 'Признание, статус, доверие, влияние.',
      development: 'Обучение, рост, новые задачи.',
      selfRealization: 'Смысл, интерес, возможность реализовать сильные стороны.',
      physicalComfort:
        'График/режим работы, гигиенические условия труда, удалённость рабочего места от дома и т.д.',
    },
    LEADERSHIP_OPTIONS: [
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
    ],
    LEADERSHIP_GUIDELINES: [
      'Оценить задачу: насколько она новая, рискованная и срочная.',
      'Оценить сотрудника по двум шкалам: мотивация и компетентность.',
      'Выбрать стиль, который соответствует текущей готовности, а не «любимому» стилю руководителя.',
      'Согласовать формат общения, контроль и частоту обратной связи.',
      'Пересматривать стиль по мере роста сотрудника и изменения ситуации.',
    ],
    LEADERSHIP_REMEMBER: [
      'Эффективный стиль руководства — это не фиксированная манера, а управленческий выбор под ситуацию и уровень сотрудника.',
      'Чем точнее руководитель соотносит стиль с мотивацией и компетентностью, тем выше шанс на результат без лишнего давления и потерь вовлеченности.',
    ],
    ONE_TO_ONE_GOAL:
      'Построение доверия, развитие сотрудника, раннее выявление проблем.',
    ONE_TO_ONE_FREQUENCY: [
      'еженедельно 30 мин (новичок или адаптация к новой должности)',
      'не реже 2 раз/мес (стабильные)',
    ],
    ONE_TO_ONE_AGENDA: [
      {
        stage: 'Разминка',
        time: '2 мин',
        manager: 'Настраивает на диалог, задает неформальный вопрос',
        employee: 'Делится настроением',
      },
      {
        stage: 'Общие вопросы',
        time: '5 мин',
        manager: 'Спрашивает: «Как дела?», «Что радует/беспокоит?»',
        employee: 'Рассказывает о текущем состоянии',
      },
      {
        stage: 'Достижения и задачи',
        time: '10 мин',
        manager: 'Слушает, задает уточняющие вопросы по прогрессу',
        employee: 'Рассказывает о сделанном, подсвечивает успехи',
      },
      {
        stage: 'Трудности и блоки',
        time: '5 мин',
        manager: 'Помогает найти решение, убирает препятствия',
        employee: 'Озвучивает проблемы, просит помощи',
      },
      {
        stage: 'Обратная связь',
        time: '5 мин',
        manager: 'Дает конструктивный фидбек, отмечает рост',
        employee: 'Слушает, задает вопросы, принимает фидбек',
      },
      {
        stage: 'План действий',
        time: '3 мин',
        manager: 'Фиксирует договоренности',
        employee: 'Договаривается о следующих шагах',
      },
      {
        stage: 'Завершение',
        time: '0 мин',
        manager: 'Благодарит за встречу',
        employee: 'Благодарит, резюмирует встречу',
      },
    ],
    SMART_CRITERIA: [
      {
        letter: 'S',
        word: 'Specific',
        label: 'Конкретная',
        description:
          'Задача сформулирована однозначно: что нужно сделать, в каком объёме и в каких рамках. Не «улучшить отчёт», а «добавить в отчёт данные по продажам за март и отправить заказчику».',
      },
      {
        letter: 'M',
        word: 'Measurable',
        label: 'Измеримая',
        description:
          'Есть критерий, по которому видно, что задача выполнена: число, факт, качество или другой наблюдаемый результат.',
      },
      {
        letter: 'A',
        word: 'Achievable',
        label: 'Достижимая',
        description:
          'Задача реалистична для этого человека в этих условиях: хватает навыков, времени и ресурсов. Иначе это не постановка, а демотивация.',
      },
      {
        letter: 'R',
        word: 'Relevant',
        label: 'Значимая',
        description:
          'Задача связана с целью команды, проекта или развитием сотрудника. Человек понимает, зачем это нужно, а не делает работу «ради галочки».',
      },
      {
        letter: 'T',
        word: 'Time-bound',
        label: 'Ограниченная по времени',
        description:
          'Есть срок или контрольные точки. Без дедлайна задача растворяется среди текучки и её сложно довести до результата.',
      },
    ],
    TASK_SETTING_METHODS: [
      {
        key: 'algorithm',
        title: 'По алгоритму',
        intro:
          'Подходит для новичков, новых сотрудников и команд с низкой зрелостью, где важны точность и предсказуемость.',
        howTo: [
          'Сделай шаг 1, затем шаг 2, затем шаг 3.',
          'Вот шаблон, по которому нужно действовать.',
          'Отклоняться от процесса не нужно.',
        ],
        whenToUse: [
          'Человек только входит в роль.',
          'Задача рутинная или регламентная.',
          'Ошибка дорого стоит.',
        ],
        pros: [
          'Максимальная ясность.',
          'Легко контролировать выполнение.',
          'Меньше риска ошибок.',
        ],
        cons: [
          'Почти нет пространства для инициативы.',
          'Сотрудник меньше учится принимать решения.',
        ],
      },
      {
        key: 'result',
        title: 'По результату',
        intro:
          'Подходит для уверенных специалистов и команд со средней или высокой зрелостью, которые умеют сами выбирать способ работы.',
        howTo: [
          'Вот цель.',
          'Вот ожидаемый результат.',
          'Вот срок и критерии успеха.',
          'Способ выполнения выбираешь сам.',
        ],
        whenToUse: [
          'Специалист опытный и самостоятельный.',
          'Важен не процесс, а итог.',
          'Нужна ответственность за результат, а не за набор действий.',
        ],
        pros: [
          'Развивает самостоятельность.',
          'Экономит время руководителя.',
          'Повышает чувство ответственности.',
        ],
        cons: [
          'Нужны четкие критерии результата.',
          'Слабому сотруднику может не хватить опоры.',
        ],
      },
      {
        key: 'problem',
        title: 'По проблеме',
        intro:
          'Подходит для зрелых команд и сильных специалистов, которым можно давать не задачу, а направление.',
        howTo: [
          'У нас есть проблема.',
          'Вот контекст и ограничения.',
          'Предложите решение и план действий.',
        ],
        whenToUse: [
          'Команда сильная и мотивированная.',
          'Нужны нестандартные решения.',
          'Важны креативность и вовлеченность.',
        ],
        pros: [
          'Включает мышление команды.',
          'Дает максимум инициативы.',
          'Хорошо работает для сложных и неоднозначных задач.',
        ],
        cons: [
          'Требует высокой зрелости.',
          'Без рамок может уйти в хаос.',
        ],
      },
    ],
    DELEGATION_DO: [
      'Задачи, которые развивают сотрудника, но не несут чрезмерного риска.',
      'Уже отработанные проекты с понятными критериями оценки.',
      'Ответственность и задачи в полном объеме.',
      'Рутинные, повторяющиеся и хорошо формализуемые задачи.',
    ],
    DELEGATION_DONT: [
      'Прерогативы управления, ключевые задачи (цели отдела, пересмотр зарплаты, задачи личного характера) и критические решения, где нужна личная ответственность лидера.',
      'Частные задачи без полной ответственности: предоставление только части работы не позволит почувствовать значимость достигнутого результата.',
      'Ситуации с высоким риском, где команде пока не хватает контекста или опыта.',
    ],
    FEEDBACK_OPTIONS: [
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
    ],
    FEEDBACK_RULES: [
      {
        title: 'Говорите о конкретных действиях, а не о личности.',
        example:
          '«Ты плохо подготовил отчет» – плохо. «В отчете не хватает данных по продажам за прошлый месяц» – хорошо.',
      },
      {
        title: 'Говорите о последствиях.',
        example:
          'Что произошло из-за этих действий? «Из-за этого мы не смогли вовремя согласовать бюджет».',
      },
      {
        title: 'Предлагайте решение или спрашивайте идеи.',
        example:
          '«Давай подумаем, как сделать так, чтобы данные подтягивались автоматически?»',
      },
      {
        title: 'Заканчивайте на позитиве.',
        example: '«В остальном отчет отличный, спасибо за работу».',
      },
    ],
    FEEDBACK_HOW_TO: [
      'Говорить конкретно, с примерами, а не общими фразами.',
      'Опираться на факты, а не на эмоции и ярлыки.',
      'Критиковать действия, а не человека.',
      'Давать обратную связь как можно ближе к событию, пока контекст ещё свежий.',
      'Заканчивать фидбек ясным ожиданием: что сотрудник должен сделать дальше.',
    ],
    FEEDBACK_REMEMBER: [
      'Обратная связь должна помогать сотруднику действовать лучше, а не защищаться.',
      'Если она слишком размытая, поздняя или агрессивная, она теряет ценность и ухудшает отношения в команде.',
    ],
    CRITICISM_RULES: [
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
    ],
    FEEDBACK_MODELS: [
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
    ],
    METRIC_PRESETS: [
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
        description:
          'Предсказуемость, ответственность, выполнение договорённостей.',
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
        description:
          'Сотрудничество, помощь коллегам, вклад в общий результат.',
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
        description:
          'Качество и своевременность решений в зоне ответственности.',
      },
    ],
  },
  en: {
    NEED_LABELS: {
      material: 'Financial needs',
      security: 'Need for security',
      social: 'Social needs',
      respect: 'Need for respect',
      development: 'Need for development',
      selfRealization: 'Need for self-actualization',
      physicalComfort: 'Need for physical comfort',
    },
    NEED_TOOLTIPS: {
      material: 'Fair pay, bonuses, and predictable income.',
      security: 'Stability, clear rules, and an orderly environment.',
      social: 'A sense of belonging, healthy relationships, and support.',
      respect: 'Recognition, status, trust, and influence.',
      development: 'Learning, growth, and new challenges.',
      selfRealization:
        'Meaningful and engaging work that makes use of personal strengths.',
      physicalComfort:
        'Working hours and arrangements, suitable workplace conditions, commute distance, and so on.',
    },
    LEADERSHIP_OPTIONS: [
      {
        value: 'instructing',
        label: 'Instructing',
        description:
          'The manager sets a clear task, explains each step, and monitors execution.',
        features:
          'Highly specific direction, little freedom, and a strong focus on instructions and deadlines.',
        communication: 'Brief, clear, step by step, and without needless abstraction.',
        whenToUse:
          'With newcomers, on critical tasks, or when both motivation and competence are low.',
      },
      {
        value: 'directing',
        label: 'Directing',
        description:
          'The manager sets the goal and boundaries while involving the employee in discussing how to solve the task.',
        features:
          'More explanation and continued oversight, with some room for initiative.',
        communication:
          '“Here is the goal and here are the constraints. Let’s discuss the best way to achieve it.”',
        whenToUse:
          'With professionals who have foundational skills but need structure and support in decision-making.',
      },
      {
        value: 'supporting',
        label: 'Supporting',
        description:
          'The manager gives fewer directives, offers more help, removes obstacles, and strengthens the employee’s confidence.',
        features:
          'A focus on motivation, trust, feedback, and developing independence.',
        communication:
          '“You already know how to do this. What do you need from me right now to move forward?”',
        whenToUse:
          'With motivated mid-level or senior employees who need support, help adapting, or room to grow.',
      },
      {
        value: 'trusting',
        label: 'Trusting',
        description:
          'The manager delegates responsibility, rarely intervenes in how the work is done, and monitors outcomes.',
        features:
          'Maximum autonomy, minimal micromanagement, and strong employee accountability for the outcome.',
        communication:
          '“You own this area. Let’s agree on checkpoints and the expected outcome.”',
        whenToUse:
          'With strong, independent, motivated employees who value trust and freedom.',
      },
    ],
    LEADERSHIP_GUIDELINES: [
      'Assess the task: how new, risky, and urgent is it?',
      'Assess the employee on two dimensions: motivation and competence.',
      'Choose the style that matches the employee’s current readiness, not the manager’s preferred style.',
      'Agree on communication, oversight, and feedback frequency.',
      'Revisit the style as the employee develops and the situation changes.',
    ],
    LEADERSHIP_REMEMBER: [
      'Effective leadership is not a fixed manner; it is a management choice tailored to the situation and the employee’s level.',
      'The more closely a manager matches their style to motivation and competence, the greater the chance of results without unnecessary pressure or loss of engagement.',
    ],
    ONE_TO_ONE_GOAL:
      'Build trust, support employee development, and identify problems early.',
    ONE_TO_ONE_FREQUENCY: [
      '30 minutes weekly (for a newcomer or someone transitioning to a new role)',
      'at least twice a month (for established employees)',
    ],
    ONE_TO_ONE_AGENDA: [
      {
        stage: 'Warm-up',
        time: '2 min',
        manager: 'Sets the tone for a conversation and asks an informal question',
        employee: 'Shares how they are feeling',
      },
      {
        stage: 'General check-in',
        time: '5 min',
        manager: 'Asks, “How are things?” and “What is going well or worrying you?”',
        employee: 'Describes their current situation',
      },
      {
        stage: 'Achievements and tasks',
        time: '10 min',
        manager: 'Listens and asks follow-up questions about progress',
        employee: 'Reviews completed work and highlights successes',
      },
      {
        stage: 'Challenges and blockers',
        time: '5 min',
        manager: 'Helps find solutions and removes obstacles',
        employee: 'Raises problems and asks for help',
      },
      {
        stage: 'Feedback',
        time: '5 min',
        manager: 'Gives constructive feedback and recognizes growth',
        employee: 'Listens, asks questions, and takes in the feedback',
      },
      {
        stage: 'Action plan',
        time: '3 min',
        manager: 'Records the agreements',
        employee: 'Agrees on the next steps',
      },
      {
        stage: 'Wrap-up',
        time: '0 min',
        manager: 'Thanks the employee for the meeting',
        employee: 'Expresses thanks and summarizes the meeting',
      },
    ],
    SMART_CRITERIA: [
      {
        letter: 'S',
        word: 'Specific',
        label: 'Specific',
        description:
          'The task is unambiguous about what must be done, to what extent, and within what boundaries. Instead of “improve the report,” say “add March sales data to the report and send it to the client.”',
      },
      {
        letter: 'M',
        word: 'Measurable',
        label: 'Measurable',
        description:
          'There is a criterion that shows the task is complete: a number, a fact, a quality standard, or another observable result.',
      },
      {
        letter: 'A',
        word: 'Achievable',
        label: 'Achievable',
        description:
          'The task is realistic for this person under the circumstances: they have enough skill, time, and resources. Otherwise, it is demotivation rather than task-setting.',
      },
      {
        letter: 'R',
        word: 'Relevant',
        label: 'Relevant',
        description:
          'The task supports a team or project goal, or the employee’s development. The person understands why it matters instead of doing busywork just to tick a box.',
      },
      {
        letter: 'T',
        word: 'Time-bound',
        label: 'Time-bound',
        description:
          'There is a deadline or a set of checkpoints. Without a deadline, a task gets lost in day-to-day work and is difficult to complete.',
      },
    ],
    TASK_SETTING_METHODS: [
      {
        key: 'algorithm',
        title: 'By procedure',
        intro:
          'Suitable for beginners, new employees, and less mature teams where accuracy and predictability matter.',
        howTo: [
          'Complete step 1, then step 2, then step 3.',
          'Follow this template.',
          'There is no need to deviate from the process.',
        ],
        whenToUse: [
          'The person is just starting in the role.',
          'The task is routine or governed by a standard procedure.',
          'Mistakes are costly.',
        ],
        pros: [
          'Maximum clarity.',
          'Easy to monitor execution.',
          'Lower risk of mistakes.',
        ],
        cons: [
          'Almost no room for initiative.',
          'The employee gets less practice making decisions.',
        ],
      },
      {
        key: 'result',
        title: 'By outcome',
        intro:
          'Suitable for confident professionals and mid- or high-maturity teams that can choose their own way of working.',
        howTo: [
          'Here is the goal.',
          'Here is the expected outcome.',
          'Here are the deadline and success criteria.',
          'You choose how to deliver it.',
        ],
        whenToUse: [
          'The professional is experienced and independent.',
          'The outcome matters more than the process.',
          'You need accountability for results rather than a list of actions.',
        ],
        pros: [
          'Develops independence.',
          'Saves the manager’s time.',
          'Strengthens ownership.',
        ],
        cons: [
          'Requires clear outcome criteria.',
          'A less capable employee may not have enough support.',
        ],
      },
      {
        key: 'problem',
        title: 'By problem',
        intro:
          'Suitable for mature teams and strong professionals who can be given a direction rather than a predefined task.',
        howTo: [
          'We have a problem.',
          'Here is the context and these are the constraints.',
          'Propose a solution and an action plan.',
        ],
        whenToUse: [
          'The team is strong and motivated.',
          'A nonstandard solution is needed.',
          'Creativity and engagement matter.',
        ],
        pros: [
          'Engages the team’s thinking.',
          'Provides maximum room for initiative.',
          'Works well for complex and ambiguous tasks.',
        ],
        cons: [
          'Requires a high level of maturity.',
          'Without boundaries, it can descend into chaos.',
        ],
      },
    ],
    DELEGATION_DO: [
      'Tasks that develop the employee without creating excessive risk.',
      'Well-established projects with clear evaluation criteria.',
      'Complete areas of responsibility and whole tasks.',
      'Routine, recurring, and easily standardized tasks.',
    ],
    DELEGATION_DONT: [
      'Management prerogatives, key responsibilities (department goals, salary reviews, personal matters), and critical decisions that require the leader’s personal accountability.',
      'Fragments of work without full responsibility: assigning only part of a task prevents the employee from feeling the significance of the result they achieved.',
      'High-risk situations where the team does not yet have enough context or experience.',
    ],
    FEEDBACK_OPTIONS: [
      {
        value: 'supporting',
        label: 'Supporting',
        description:
          'Focuses on success: what went well, which actions produced a good result, and what should be repeated. This feedback builds confidence and motivation.',
      },
      {
        value: 'correcting',
        label: 'Corrective',
        description:
          'Needed when behavior or results do not meet expectations. It is important to be calm and specific: explain what happened, what effect it had, and what must change.',
      },
      {
        value: 'developing',
        label: 'Developmental',
        description:
          'Helps the employee build skills and independence. The manager addresses the current result and suggests how to reach the next level.',
      },
    ],
    FEEDBACK_RULES: [
      {
        title: 'Discuss specific actions, not the person.',
        example:
          '“You prepared the report badly” is poor feedback. “The report is missing last month’s sales data” is good feedback.',
      },
      {
        title: 'Explain the consequences.',
        example:
          'What happened because of these actions? “Because of this, we could not approve the budget on time.”',
      },
      {
        title: 'Suggest a solution or ask for ideas.',
        example:
          '“Let’s think about how we could import the data automatically.”',
      },
      {
        title: 'End on a positive note.',
        example: '“The rest of the report is excellent. Thank you for your work.”',
      },
    ],
    FEEDBACK_HOW_TO: [
      'Be specific and use examples instead of general statements.',
      'Rely on facts rather than emotions or labels.',
      'Critique actions, not the person.',
      'Give feedback as close to the event as possible, while the context is still fresh.',
      'End with a clear expectation of what the employee should do next.',
    ],
    FEEDBACK_REMEMBER: [
      'Feedback should help an employee perform better, not make them defensive.',
      'If feedback is too vague, late, or aggressive, it loses its value and damages team relationships.',
    ],
    CRITICISM_RULES: [
      'Listen to the explanation.',
      'Keep your tone even.',
      'Start with praise, then move to criticism.',
      'Critique behavior and actions, not the person.',
      'Do not look for a scapegoat on whom to place all the responsibility.',
      'Look for a solution together instead of assigning blame.',
      'Give criticism one-on-one. Never reprimand someone in public.',
      'Nothing is as disarming as the terms of an honorable surrender.',
      'Raise concerns as you notice them; do not let them accumulate.',
      'Assess the situation and consider whether you share any responsibility.',
    ],
    FEEDBACK_MODELS: [
      {
        key: 'sbi',
        title: 'SBI',
        sections: [
          {
            paragraphs: [
              'SBI is the Situation–Behavior–Impact feedback model.',
              'It is used to make feedback specific and avoid judging someone’s personality.',
              'The SBI model helps you avoid statements such as “you always…” or “you are irresponsible” and focus on facts and consequences instead. This makes feedback clearer and reduces the employee’s defensive reaction.',
            ],
          },
          {
            heading: 'When it is useful',
            paragraphs: [
              'SBI works for both corrective and positive feedback. When praising an employee, the structure is the same: situation, behavior, and impact.',
            ],
          },
          {
            heading: 'How it works',
            paragraphs: [
              'Situation — when and where it happened.',
              'Behavior — the specific behavior you observed.',
              'Impact — the effect it had on you, the team, or the outcome.',
            ],
          },
          {
            heading: 'Example',
            paragraphs: [
              '“During yesterday’s client call, you did not let us know in advance that the task was not ready. As a result, we could not agree on the next steps right away and lost time in the meeting.”',
            ],
          },
        ],
      },
      {
        key: 'sandwich',
        title: 'Sandwich',
        sections: [
          {
            paragraphs: [
              'The sandwich is a feedback method that begins with praise, follows with a concern, and ends with support. Its purpose is to soften a difficult conversation without demotivating the employee.',
            ],
          },
          {
            heading: 'How it is structured',
            paragraphs: [
              'The first layer — what went well.',
              'The filling — what needs to be corrected.',
              'The second layer — how to end the conversation while maintaining a productive mindset.',
            ],
          },
          {
            heading: 'Why it is used',
            paragraphs: [
              'This format helps a manager communicate criticism more gently and preserve the relationship. IT teams often use it to point out a mistake without diminishing the person’s contribution.',
            ],
          },
          {
            heading: 'An important nuance',
            paragraphs: [
              'The method does not always work. If the “praise” sounds perfunctory, the employee immediately realizes that criticism is coming and the praise loses its force. Both the support and the concern should therefore sound genuine and relevant.',
            ],
          },
          {
            heading: 'Example',
            paragraphs: [
              '“You prepared the demo well and answered questions confidently. However, the report contained some inaccurate dates. Overall, you have a good command of the context. Next time, let’s check the figures separately before sending it.”',
            ],
          },
        ],
      },
      {
        key: 'pops',
        title: 'POPS',
        sections: [
          {
            paragraphs: [
              'POPS is a formula for a brief, well-reasoned response: Position–Rationale–Example–Consequence. It helps you express an opinion on a topic quickly and logically.',
            ],
          },
          {
            heading: 'What it stands for',
            paragraphs: [
              'P — position: “I believe that…”',
              'O — rationale: “Because…”',
              'P — example: “For example…”',
              'S — consequence: “It follows that…”',
            ],
          },
          {
            heading: 'Where it is used',
            paragraphs: [
              'POPS is often used in training, discussions, and written responses when someone needs not only to state an opinion but also to support it immediately.',
            ],
          },
          {
            heading: 'Example',
            paragraphs: [
              '“I believe feedback should be timely because otherwise the employee does not understand what exactly needs to change. For example, if a concern is raised a month later, the context will already be lost. It follows that feedback is best given immediately after the event.”',
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
              'CARE is a feedback model in which each letter usually represents a separate step: Context, Action, Result, and Expectation, or a similar variant depending on the organization or method. In management, it structures feedback by describing the context, naming the action, showing the result, and setting a future expectation.',
            ],
          },
          {
            heading: 'Understanding CARE',
            paragraphs: [
              'C — Context: the situation in which it happened.',
              'A — Action: the action taken or behavior displayed.',
              'R — Result: what it led to.',
              'E — Expectation: what is expected next.',
            ],
          },
          {
            heading: 'Why it is useful',
            paragraphs: [
              'This framework keeps the conversation focused: what happened, why it matters, and how the employee should adjust their behavior. It is useful for team leads because it makes feedback calm, clear, and free of personal judgment.',
            ],
          },
          {
            heading: 'Example',
            paragraphs: [
              '“During yesterday’s client call, you did not warn us that the timeline might slip. As a result, the team had no time to prepare a plan. Next time, it is important to report blockers in advance.”',
            ],
          },
        ],
      },
    ],
    METRIC_PRESETS: [
      {
        key: 'quality',
        name: 'Work quality',
        shortName: 'Quality',
        description: 'How well the result meets expectations and standards.',
      },
      {
        key: 'speed',
        name: 'Execution speed',
        shortName: 'Speed',
        description: 'Pace of work and ability to meet deadlines.',
      },
      {
        key: 'reliability',
        name: 'Reliability',
        shortName: 'Reliability',
        description:
          'Predictability, accountability, and fulfillment of commitments.',
      },
      {
        key: 'communication',
        name: 'Communication',
        shortName: 'Communication',
        description:
          'Clarity in communication, feedback, and escalation of problems.',
      },
      {
        key: 'initiative',
        name: 'Initiative',
        shortName: 'Initiative',
        description:
          'Suggestions for improvement and proactive action without reminders.',
      },
      {
        key: 'teamwork',
        name: 'Teamwork',
        shortName: 'Teamwork',
        description:
          'Collaboration, support for colleagues, and contribution to shared results.',
      },
      {
        key: 'expertise',
        name: 'Expertise',
        shortName: 'Expertise',
        description: 'Depth of professional knowledge and skills.',
      },
      {
        key: 'independence',
        name: 'Independence',
        shortName: 'Autonomy',
        description: 'Ability to solve tasks without constant supervision.',
      },
      {
        key: 'learning',
        name: 'Learning agility',
        shortName: 'Learning',
        description:
          'Speed of learning new things and applying them in practice.',
      },
      {
        key: 'decisions',
        name: 'Decision-making',
        shortName: 'Decisions',
        description:
          'Quality and timeliness of decisions within the employee’s area of responsibility.',
      },
    ],
  },
} as const satisfies Record<AppLocale, DomainCopy>;

export function getDomainCopy(locale: AppLocale): DomainCopy {
  return DOMAIN_COPY[locale];
}
