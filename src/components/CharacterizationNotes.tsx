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
import type { CharacterizationNote } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface CharacterizationNotesProps {
  notes: CharacterizationNote[];
  onAdd: (date: number, text: string) => void;
  onUpdate: (
    noteId: string,
    note: Pick<CharacterizationNote, 'date' | 'text'>,
  ) => void;
}

export function CharacterizationNotes({
  notes,
  onAdd,
  onUpdate,
}: CharacterizationNotesProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { dateFormat, formatDate, t } = useLocale();
  const [draft, setDraft] = useState('');
  const [draftDate, setDraftDate] = useState<Dayjs>(dayjs());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<Dayjs | null>(null);
  const [editingText, setEditingText] = useState('');

  const sortedNotes = [...notes].sort(
    (a, b) => b.date - a.date || b.createdAt - a.createdAt,
  );

  const saveDraft = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(draftDate.startOf('day').valueOf(), text);
    setDraft('');
    setDraftDate(dayjs());
  };

  const startEdit = (note: CharacterizationNote) => {
    setEditingId(note.id);
    setEditingDate(dayjs(note.date));
    setEditingText(note.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDate(null);
    setEditingText('');
  };

  const saveEdit = () => {
    if (!editingId || !editingDate) return;
    const text = editingText.trim();
    if (!text) return;
    onUpdate(editingId, {
      date: editingDate.startOf('day').valueOf(),
      text,
    });
    cancelEdit();
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
          {t('profiles.comment')}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          {t('profiles.commentHint')}
        </Typography.Text>
        <Input.TextArea
          rows={4}
          placeholder={t('profiles.commentPlaceholder')}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'flex-end',
            gap: 12,
            marginTop: 12,
          }}
        >
          <div>
            <Typography.Text
              type="secondary"
              style={{ display: 'block', marginBottom: 6 }}
            >
              {t('profiles.commentDate')}
            </Typography.Text>
            <DatePicker
              value={draftDate}
              onChange={(date) => date && setDraftDate(date)}
              format={dateFormat}
              allowClear={false}
              style={{ width: isMobile ? '100%' : 180 }}
              aria-label={t('profiles.commentDate')}
            />
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={saveDraft}
            disabled={!draft.trim()}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('profiles.saveComment')}
          </Button>
        </div>
      </div>

      <Collapse
        items={[
          {
            key: 'comments',
            label: t('profiles.archiveTitle', { count: notes.length }),
            children:
              sortedNotes.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('profiles.archiveEmpty')}
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
                              format={dateFormat}
                              allowClear={false}
                              style={{ width: isMobile ? '100%' : 180 }}
                            />
                            <Input.TextArea
                              rows={4}
                              value={editingText}
                              onChange={(event) => setEditingText(event.target.value)}
                              placeholder={t('profiles.commentPlaceholder')}
                            />
                            <Space
                              direction={isMobile ? 'vertical' : 'horizontal'}
                              style={{ width: isMobile ? '100%' : undefined }}
                            >
                              <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={saveEdit}
                                disabled={
                                  !editingDate || !editingText.trim()
                                }
                                block={isMobile}
                              >
                                {t('common.save')}
                              </Button>
                              <Button onClick={cancelEdit} block={isMobile}>
                                {t('common.cancel')}
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
                                marginBottom: 8,
                              }}
                            >
                              <Typography.Text strong>
                                {t('profiles.commentSaved', {
                                  date: formatDate(note.date),
                                })}
                              </Typography.Text>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => startEdit(note)}
                                aria-label={t('profiles.editAria')}
                                size={isMobile ? 'middle' : 'small'}
                              >
                                {!isMobile && t('common.edit')}
                              </Button>
                            </div>
                            <Typography.Paragraph
                              style={{ margin: 0, whiteSpace: 'pre-wrap' }}
                            >
                              {note.text}
                            </Typography.Paragraph>
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
    </Space>
  );
}
