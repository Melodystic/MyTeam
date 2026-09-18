import { useState } from 'react';
import { Button, Empty, Input, List, Space, Typography, theme } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import type { SavedNote } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface SavedNotesBlockProps {
  notes: SavedNote[];
  placeholder?: string;
  hideComposer?: boolean;
  onAdd: (text: string) => void;
  onUpdate: (noteId: string, text: string) => void;
}

export function SavedNotesBlock({
  notes,
  placeholder,
  hideComposer = false,
  onAdd,
  onUpdate,
}: SavedNotesBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { formatDate, t } = useLocale();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  const handleSave = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft('');
  };

  const startEdit = (note: SavedNote) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) return;
    onUpdate(editingId, text);
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {!hideComposer && (
        <div>
          <Input.TextArea
            rows={isMobile ? 4 : 5}
            placeholder={placeholder ?? t('notes.defaultPlaceholder')}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!draft.trim()}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
            style={{ marginTop: 12 }}
          >
            {t('notes.save')}
          </Button>
        </div>
      )}

      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          {t('notes.savedTitle')}
        </Typography.Title>

        {sortedNotes.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('notes.empty')}
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: 8,
                      marginBottom: 8,
                      flexDirection: isMobile ? 'column' : 'row',
                    }}
                  >
                    <Typography.Text type="secondary" style={{ fontSize: isMobile ? 12 : undefined }}>
                      {formatDate(note.createdAt, true)}
                      {note.updatedAt !== note.createdAt &&
                        t('notes.updated', {
                          date: formatDate(note.updatedAt, true),
                        })}
                    </Typography.Text>
                    {!isEditing && (
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => startEdit(note)}
                        aria-label={t('notes.editAria')}
                        size={isMobile ? 'middle' : 'small'}
                        style={isMobile ? { paddingInline: 0 } : undefined}
                      >
                        {t('common.edit')}
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Input.TextArea
                        rows={4}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                      />
                      <Space
                        direction={isMobile ? 'vertical' : 'horizontal'}
                        style={{ width: isMobile ? '100%' : undefined }}
                      >
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={saveEdit}
                          disabled={!editingText.trim()}
                          block={isMobile}
                          size={isMobile ? 'large' : 'middle'}
                        >
                          {t('common.save')}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          block={isMobile}
                          size={isMobile ? 'large' : 'middle'}
                        >
                          {t('common.cancel')}
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                      {note.text}
                    </Typography.Paragraph>
                  )}
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </Space>
  );
}
