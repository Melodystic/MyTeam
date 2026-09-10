import { useState, type FormEvent } from 'react';
import { Button, Collapse, Empty, Input, List, Space, Typography, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColleagueFeedback } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

interface ColleagueFeedbackBlockProps {
  feedback: ColleagueFeedback[];
  onAdd: (colleagueName: string, position: string, comment: string) => void;
}

export function ColleagueFeedbackBlock({
  feedback,
  onAdd,
}: ColleagueFeedbackBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const [colleagueName, setColleagueName] = useState('');
  const [position, setPosition] = useState('');
  const [comment, setComment] = useState('');

  const canSave =
    Boolean(colleagueName.trim()) &&
    Boolean(position.trim()) &&
    Boolean(comment.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    onAdd(colleagueName, position, comment);
    setColleagueName('');
    setPosition('');
    setComment('');
  };

  const sortedFeedback = [...feedback].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <Collapse
      items={[
        {
          key: 'colleague-feedback',
          label: `Обратная связь от коллег (${feedback.length})`,
          children: (
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <Typography.Text
                      type="secondary"
                      style={{ display: 'block', marginBottom: 6 }}
                    >
                      Имя коллеги
                    </Typography.Text>
                    <Input
                      value={colleagueName}
                      onChange={(event) => setColleagueName(event.target.value)}
                      placeholder="Введите имя"
                      size={isMobile ? 'large' : 'middle'}
                    />
                  </div>
                  <div>
                    <Typography.Text
                      type="secondary"
                      style={{ display: 'block', marginBottom: 6 }}
                    >
                      Должность
                    </Typography.Text>
                    <Input
                      value={position}
                      onChange={(event) => setPosition(event.target.value)}
                      placeholder="Введите должность"
                      size={isMobile ? 'large' : 'middle'}
                    />
                  </div>
                </div>

                <Typography.Text
                  type="secondary"
                  style={{ display: 'block', marginBottom: 6 }}
                >
                  Комментарий
                </Typography.Text>
                <Input.TextArea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Введите комментарий коллеги..."
                  rows={4}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  disabled={!canSave}
                  block={isMobile}
                  size={isMobile ? 'large' : 'middle'}
                  style={{ marginTop: 12 }}
                >
                  Сохранить
                </Button>
              </form>

              <div>
                <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
                  Сохранённые комментарии
                </Typography.Title>
                {sortedFeedback.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Пока нет обратной связи от коллег"
                  />
                ) : (
                  <List
                    dataSource={sortedFeedback}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          display: 'block',
                          padding: isMobile ? 12 : 16,
                          marginBottom: 12,
                          borderRadius: token.borderRadiusLG,
                          background: token.colorFillAlter,
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Typography.Text strong style={{ display: 'block' }}>
                          {item.colleagueName}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ display: 'block' }}>
                          {item.position} · {dayjs(item.createdAt).format('DD.MM.YYYY HH:mm')}
                        </Typography.Text>
                        <Typography.Paragraph
                          style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap' }}
                        >
                          {item.comment}
                        </Typography.Paragraph>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </Space>
          ),
        },
      ]}
    />
  );
}
