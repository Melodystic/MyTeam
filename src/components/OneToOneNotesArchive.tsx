import { useState } from 'react';
import {
  Button,
  Collapse,
  DatePicker,
  Empty,
  Input,
  List,
  Space,
  Typography,
  theme,
} from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { OneToOneMeetingNote } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

interface OneToOneNotesArchiveProps {
  notes: OneToOneMeetingNote[];
  onUpdate: (
    noteId: string,
    note: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
  ) => void;
}

export function OneToOneNotesArchive({
  notes,
  onUpdate,
}: OneToOneNotesArchiveProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<Dayjs | null>(null);
  const [editingPrep, setEditingPrep] = useState('');
  const [editingAfter, setEditingAfter] = useState('');

  const sortedNotes = [...notes].sort(
    (a, b) => b.meetingDate - a.meetingDate || b.createdAt - a.createdAt,
  );

  const startEdit = (note: OneToOneMeetingNote) => {
    setEditingId(note.id);
    setEditingDate(dayjs(note.meetingDate));
    setEditingPrep(note.prep);
    setEditingAfter(note.after);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDate(null);
    setEditingPrep('');
    setEditingAfter('');
  };

  const saveEdit = () => {
    if (!editingId || !editingDate) return;
    const prep = editingPrep.trim();
    const after = editingAfter.trim();
    if (!prep && !after) return;

    onUpdate(editingId, {
      meetingDate: editingDate.startOf('day').valueOf(),
      prep,
      after,
    });
    cancelEdit();
  };

  return (
    <Collapse
      items={[
        {
          key: 'saved-notes',
          label: `Сохранённые заметки (${notes.length})`,
          children:
            sortedNotes.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Пока нет сохранённых встреч"
              />
            ) : (
              <List
                dataSource={sortedNotes}
                renderItem={(note) => {
                  const isEditing = editingId === note.id;

                  return (
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
                      {isEditing ? (
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          <DatePicker
                            value={editingDate}
                            onChange={setEditingDate}
                            format="DD.MM.YYYY"
                            allowClear={false}
                            style={{ width: isMobile ? '100%' : 180 }}
                          />
                          <div>
                            <Typography.Text strong>Вопросы и подготовка</Typography.Text>
                            <Input.TextArea
                              rows={3}
                              value={editingPrep}
                              onChange={(event) => setEditingPrep(event.target.value)}
                              placeholder="Темы и что подготовить..."
                              style={{ marginTop: 8 }}
                            />
                          </div>
                          <div>
                            <Typography.Text strong>Заметки после встречи</Typography.Text>
                            <Input.TextArea
                              rows={3}
                              value={editingAfter}
                              onChange={(event) => setEditingAfter(event.target.value)}
                              placeholder="Итоги и договорённости..."
                              style={{ marginTop: 8 }}
                            />
                          </div>
                          <Space
                            direction={isMobile ? 'vertical' : 'horizontal'}
                            style={{ width: isMobile ? '100%' : undefined }}
                          >
                            <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={saveEdit}
                              disabled={
                                !editingDate ||
                                (!editingPrep.trim() && !editingAfter.trim())
                              }
                              block={isMobile}
                            >
                              Сохранить
                            </Button>
                            <Button onClick={cancelEdit} block={isMobile}>
                              Отмена
                            </Button>
                          </Space>
                        </Space>
                      ) : (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <Typography.Text strong>
                              Встреча {dayjs(note.meetingDate).format('DD.MM.YYYY')}
                            </Typography.Text>
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => startEdit(note)}
                              aria-label="Редактировать заметки встречи"
                              size={isMobile ? 'middle' : 'small'}
                            >
                              {!isMobile && 'Редактировать'}
                            </Button>
                          </div>

                          {note.prep && (
                            <div style={{ marginBottom: note.after ? 12 : 0 }}>
                              <Typography.Text type="secondary">
                                Вопросы и подготовка
                              </Typography.Text>
                              <Typography.Paragraph
                                style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}
                              >
                                {note.prep}
                              </Typography.Paragraph>
                            </div>
                          )}
                          {note.after && (
                            <div>
                              <Typography.Text type="secondary">
                                Заметки после встречи
                              </Typography.Text>
                              <Typography.Paragraph
                                style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}
                              >
                                {note.after}
                              </Typography.Paragraph>
                            </div>
                          )}
                        </>
                      )}
                    </List.Item>
                  );
                }}
              />
            ),
        },
      ]}
    />
  );
}
