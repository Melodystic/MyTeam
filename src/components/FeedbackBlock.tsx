import { Alert, Collapse, Select, Space, Typography, theme } from 'antd';
import { NotesBlock } from './NotesBlock';
import {
  CRITICISM_RULES,
  FEEDBACK_HOW_TO,
  FEEDBACK_MODELS,
  FEEDBACK_OPTIONS,
  FEEDBACK_REMEMBER,
  FEEDBACK_RULES,
  type FeedbackType,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

interface FeedbackBlockProps {
  feedbackType: FeedbackType;
  feedbackNotes: string;
  onChangeType: (type: FeedbackType) => void;
  onChangeNotes: (notes: string) => void;
}

export function FeedbackBlock({
  feedbackType,
  feedbackNotes,
  onChangeType,
  onChangeNotes,
}: FeedbackBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const selected = FEEDBACK_OPTIONS.find((option) => option.value === feedbackType);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Тип обратной связи
        </Typography.Text>
        <Select
          allowClear
          placeholder="Выберите тип"
          style={{ width: '100%', maxWidth: isMobile ? '100%' : 420 }}
          size={isMobile ? 'large' : 'middle'}
          value={feedbackType ?? undefined}
          options={FEEDBACK_OPTIONS.map(({ value, label }) => ({ value, label }))}
          onChange={(next) => onChangeType(next ?? null)}
        />
        {selected && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 12 }}
            message={selected.label}
            description={selected.description}
          />
        )}
      </div>

      <Collapse
        accordion
        items={[
          {
            key: 'feedback-models',
            label: 'Типы обратной связи',
            children: (
              <Collapse
                accordion
                bordered={false}
                style={{ background: 'transparent' }}
                items={FEEDBACK_MODELS.map((model) => ({
                  key: model.key,
                  label: <Typography.Text strong>{model.title}</Typography.Text>,
                  children: (
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      {model.sections.map((section) => (
                        <div key={`${model.key}-${section.heading ?? 'intro'}`}>
                          {section.heading && (
                            <Typography.Text strong style={{ display: 'block', marginBottom: 4 }}>
                              {section.heading}
                            </Typography.Text>
                          )}
                          {section.paragraphs.map((paragraph) => (
                            <Typography.Paragraph
                              key={paragraph}
                              type="secondary"
                              style={{ marginBottom: 6 }}
                            >
                              {paragraph}
                            </Typography.Paragraph>
                          ))}
                        </div>
                      ))}
                    </Space>
                  ),
                }))}
              />
            ),
          },
        ]}
      />

      <div>
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Заметки
        </Typography.Text>
        <NotesBlock
          value={feedbackNotes}
          placeholder="Заметки по обратной связи..."
          onChange={onChangeNotes}
        />
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Как давать обратную связь
        </Typography.Title>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {FEEDBACK_RULES.map((rule, index) => (
            <div key={rule.title}>
              <Typography.Text strong>
                {index + 1}. {rule.title}
              </Typography.Text>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 4 }}>
                {rule.example}
              </Typography.Paragraph>
            </div>
          ))}
        </Space>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Как давать фидбек
        </Typography.Title>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {FEEDBACK_HOW_TO.map((item) => (
            <li key={item} style={{ marginBottom: 8 }}>
              <Typography.Text type="secondary">{item}</Typography.Text>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Что важно помнить!
        </Typography.Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {FEEDBACK_REMEMBER.map((item) => (
            <Typography.Paragraph key={item} type="secondary" style={{ marginBottom: 0 }}>
              {item}
            </Typography.Paragraph>
          ))}
        </Space>
      </div>

      <Collapse
        items={[
          {
            key: 'criticism-rules',
            label: 'Десять правил искусной критики',
            children: (
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {CRITICISM_RULES.map((rule) => (
                  <li key={rule} style={{ marginBottom: 8 }}>
                    <Typography.Text type="secondary">{rule}</Typography.Text>
                  </li>
                ))}
              </ol>
            ),
          },
        ]}
      />
    </Space>
  );
}
