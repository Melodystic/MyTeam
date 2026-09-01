import { useState, type CSSProperties, type FormEvent } from 'react';
import { Button, Empty, Input, Space, Typography, theme } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import type { OneToOneQuestion, SavedNote } from '../types/employee';
import { SavedNotesBlock } from './SavedNotesBlock';
import { useIsMobile } from '../hooks/useBreakpoint';

interface OneToOneBlockProps {
  prep: string;
  after: string;
  questions: OneToOneQuestion[];
  notes: SavedNote[];
  onChangePrep: (prep: string) => void;
  onChangeAfter: (notes: string) => void;
  onAddQuestion: (text: string) => void;
  onUpdateQuestion: (questionId: string, text: string) => void;
  onChangeAnswer: (questionId: string, answer: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  onAddNote: (text: string) => void;
  onUpdateNote: (noteId: string, text: string) => void;
}

export function OneToOneBlock({
  prep,
  after,
  questions,
  notes,
  onChangePrep,
  onChangeAfter,
  onAddQuestion,
  onUpdateQuestion,
  onChangeAnswer,
  onRemoveQuestion,
  onAddNote,
  onUpdateNote,
}: OneToOneBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const panelStyle: CSSProperties = {
    padding: isMobile ? 12 : 16,
    borderRadius: token.borderRadiusLG,
    background: token.colorFillAlter,
    border: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAddQuestion(text);
    setDraft('');
  };

  const startEdit = (question: OneToOneQuestion) => {
    setEditingId(question.id);
    setEditingText(question.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const text = editingText.trim();
    if (!text) return;
    onUpdateQuestion(editingId, text);
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        <div style={panelStyle}>
          <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
            Вопросы и подготовка
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Темы и что учесть до встречи
          </Typography.Text>
          <Input.TextArea
            placeholder="Темы и что подготовить..."
            value={prep}
            onChange={(e) => onChangePrep(e.target.value)}
            style={{ minHeight: 150, height: 150, resize: 'vertical' }}
          />
        </div>

        <div style={panelStyle}>
          <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
            Заметки после встречи
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Итоги и договорённости
          </Typography.Text>
          <Input.TextArea
            placeholder="Итоги, договорённости и что зафиксировать..."
            value={after}
            onChange={(e) => onChangeAfter(e.target.value)}
            style={{ minHeight: 150, height: 150, resize: 'vertical' }}
          />
        </div>
      </div>

      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Вопросы
        </Typography.Title>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Добавить вопрос к встрече..."
            size={isMobile ? 'large' : 'middle'}
            aria-label="Текст вопроса"
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            disabled={!draft.trim()}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
          >
            Добавить вопрос
          </Button>
        </form>

        {questions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Пока нет вопросов — добавьте первый"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map((question, index) => {
              const isEditing = editingId === question.id;

              return (
              <div
                key={question.id}
                style={{
                  padding: isMobile ? 12 : 16,
                  borderRadius: token.borderRadiusLG,
                  background: token.colorFillAlter,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {isEditing ? (
                    <Input.TextArea
                      rows={2}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      autoFocus
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <>
                      <Typography.Text strong style={{ whiteSpace: 'pre-wrap', flex: 1 }}>
                        {index + 1}. {question.text}
                      </Typography.Text>
                      <Space size={4}>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => startEdit(question)}
                          aria-label="Редактировать вопрос"
                          size={isMobile ? 'middle' : 'small'}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => onRemoveQuestion(question.id)}
                          aria-label="Удалить вопрос"
                          size={isMobile ? 'middle' : 'small'}
                        />
                      </Space>
                    </>
                  )}
                </div>
                {isEditing && (
                  <Space
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    style={{ width: isMobile ? '100%' : undefined, marginBottom: 12 }}
                  >
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={saveEdit}
                      disabled={!editingText.trim()}
                      block={isMobile}
                      size={isMobile ? 'large' : 'middle'}
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      block={isMobile}
                      size={isMobile ? 'large' : 'middle'}
                    >
                      Отмена
                    </Button>
                  </Space>
                )}
                <Input.TextArea
                  rows={2}
                  placeholder="Ответ на вопрос..."
                  value={question.answer}
                  onChange={(e) => onChangeAnswer(question.id, e.target.value)}
                />
              </div>
              );
            })}
          </div>
        )}
      </div>

      {notes.length > 0 && (
        <SavedNotesBlock
          notes={notes}
          hideComposer
          onAdd={onAddNote}
          onUpdate={onUpdateNote}
        />
      )}
    </div>
  );
}
