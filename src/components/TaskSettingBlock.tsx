import { Collapse, Space, Typography, theme } from 'antd';
import { SMART_CRITERIA, TASK_SETTING_METHODS } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

function MethodSection({ title, items }: { title: string; items: string[] }) {
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
          Постановка задач по SMART
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          SMART помогает сформулировать задачу так, чтобы сотрудник понимал, что делать,
          как понять успех и к какому сроку нужно успеть.
        </Typography.Paragraph>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {SMART_CRITERIA.map((item) => (
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
          Три способа постановки задачи
        </Typography.Title>
        <Collapse
          accordion
          items={TASK_SETTING_METHODS.map((method) => ({
            key: method.key,
            label: <Typography.Text strong>{method.title}</Typography.Text>,
            children: (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {method.intro}
                </Typography.Paragraph>
                <MethodSection title="Как формулировать" items={method.howTo} />
                <MethodSection title="Когда использовать" items={method.whenToUse} />
                <MethodSection title="Плюсы" items={method.pros} />
                <MethodSection title="Минусы" items={method.cons} />
              </Space>
            ),
          }))}
        />
      </div>
    </Space>
  );
}
