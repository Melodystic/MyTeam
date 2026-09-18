import { Collapse, Space, Typography, theme } from 'antd';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

function MethodSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <Typography.Text strong style={{ display: 'block', marginBottom: 6 }}>
        {title}
      </Typography.Text>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: 6 }}>
            <Typography.Text type="secondary">{item}</Typography.Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TaskSettingBlock() {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { domain, t } = useLocale();

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div
        style={{
          padding: isMobile ? 12 : 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
          {t('tasks.smartTitle')}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          {t('tasks.smartIntro')}
        </Typography.Paragraph>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {domain.SMART_CRITERIA.map((item) => (
            <div key={item.letter} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: token.borderRadiusLG,
                  background: token.colorPrimaryBg,
                  color: token.colorPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {item.letter}
              </div>
              <div>
                <Typography.Text strong>
                  {item.letter} — {item.label}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  {item.word}
                </Typography.Text>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {item.description}
                </Typography.Paragraph>
              </div>
            </div>
          ))}
        </Space>
      </div>

      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          {t('tasks.methodsTitle')}
        </Typography.Title>
        <Collapse
          accordion
          items={domain.TASK_SETTING_METHODS.map((method) => ({
            key: method.key,
            label: <Typography.Text strong>{method.title}</Typography.Text>,
            children: (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {method.intro}
                </Typography.Paragraph>
                <MethodSection title={t('tasks.howTo')} items={method.howTo} />
                <MethodSection
                  title={t('tasks.whenToUse')}
                  items={method.whenToUse}
                />
                <MethodSection title={t('tasks.pros')} items={method.pros} />
                <MethodSection title={t('tasks.cons')} items={method.cons} />
              </Space>
            ),
          }))}
        />
      </div>
    </Space>
  );
}
