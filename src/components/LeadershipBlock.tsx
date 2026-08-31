import { Alert, Select, Space, Typography, theme } from 'antd';
import {
  LEADERSHIP_GUIDELINES,
  LEADERSHIP_OPTIONS,
  LEADERSHIP_REMEMBER,
  type LeadershipStyle,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

interface LeadershipBlockProps {
  value: LeadershipStyle;
  onChange: (style: LeadershipStyle) => void;
}

export function LeadershipBlock({ value, onChange }: LeadershipBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const selected = LEADERSHIP_OPTIONS.find((option) => option.value === value);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Select
          allowClear
          placeholder="Выберите стиль руководства"
          style={{ width: '100%', maxWidth: isMobile ? '100%' : 420 }}
          size={isMobile ? 'large' : 'middle'}
          value={value ?? undefined}
          options={LEADERSHIP_OPTIONS.map(({ value: optionValue, label }) => ({
            value: optionValue,
            label,
          }))}
          onChange={(next) => onChange(next ?? null)}
        />

        {selected && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 12 }}
            message={`${selected.label} стиль`}
            description={
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>Описание: </Typography.Text>
                  {selected.description}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>Особенности: </Typography.Text>
                  {selected.features}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>Стиль общения: </Typography.Text>
                  {selected.communication}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>Когда применять: </Typography.Text>
                  {selected.whenToUse}
                </Typography.Paragraph>
              </Space>
            }
          />
        )}
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
          Как выбрать стиль
        </Typography.Title>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {LEADERSHIP_GUIDELINES.map((item) => (
            <li key={item} style={{ marginBottom: 8 }}>
              <Typography.Text type="secondary">{item}</Typography.Text>
            </li>
          ))}
        </ol>
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
          Что важно помнить
        </Typography.Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {LEADERSHIP_REMEMBER.map((item) => (
            <Typography.Paragraph key={item} type="secondary" style={{ marginBottom: 0 }}>
              {item}
            </Typography.Paragraph>
          ))}
        </Space>
      </div>
    </Space>
  );
}
