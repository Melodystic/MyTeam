import { Alert, Select, Space, Typography, theme } from 'antd';
import { type LeadershipStyle } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface LeadershipBlockProps {
  value: LeadershipStyle;
  onChange: (style: LeadershipStyle) => void;
}

export function LeadershipBlock({ value, onChange }: LeadershipBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { domain, t } = useLocale();
  const selected = domain.LEADERSHIP_OPTIONS.find(
    (option) => option.value === value,
  );

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Select
          allowClear
          placeholder={t('leadership.placeholder')}
          style={{ width: '100%', maxWidth: isMobile ? '100%' : 420 }}
          size={isMobile ? 'large' : 'middle'}
          value={value ?? undefined}
          options={domain.LEADERSHIP_OPTIONS.map(
            ({ value: optionValue, label }) => ({
              value: optionValue,
              label,
            }),
          )}
          onChange={(next) => onChange(next ?? null)}
        />

        {selected && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 12 }}
            message={t('leadership.styleSuffix', {
              name: selected.label,
            })}
            description={
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>
                    {t('leadership.description')}
                  </Typography.Text>
                  {selected.description}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>
                    {t('leadership.features')}
                  </Typography.Text>
                  {selected.features}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>
                    {t('leadership.communication')}
                  </Typography.Text>
                  {selected.communication}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  <Typography.Text strong>
                    {t('leadership.whenToUse')}
                  </Typography.Text>
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
          {t('leadership.chooseTitle')}
        </Typography.Title>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {domain.LEADERSHIP_GUIDELINES.map((item) => (
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
          {t('leadership.rememberTitle')}
        </Typography.Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {domain.LEADERSHIP_REMEMBER.map((item) => (
            <Typography.Paragraph key={item} type="secondary" style={{ marginBottom: 0 }}>
              {item}
            </Typography.Paragraph>
          ))}
        </Space>
      </div>
    </Space>
  );
}
