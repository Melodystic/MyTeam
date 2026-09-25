import { useState, type CSSProperties, type FormEvent } from 'react';
import {
  Button,
  Collapse,
  DatePicker,
  Empty,
  Input,
  Space,
  Table,
  Typography,
  theme,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import {
  type OneToOneMeetingNote,
  type OneToOneQuestion,
} from '../types/employee';
import { OneToOneNotesArchive } from './OneToOneNotesArchive';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface OneToOneBlockProps {
  prep: string;
  after: string;
  questions: OneToOneQuestion[];
  notes: OneToOneMeetingNote[];
  onChangePrep: (prep: string) => void;
  onChangeAfter: (notes: string) => void;
  onAddQuestion: (text: string) => void;
  onUpdateQuestion: (questionId: string, text: string) => void;
  onChangeAnswer: (questionId: string, answer: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  onSaveMeeting: (
    meetingDate: number,
    prep: string,
    after: string,
  ) => void;
  onUpdateNote: (
    noteId: string,
    note: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
  ) => void;
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
  onSaveMeeting,
  onUpdateNote,
}: OneToOneBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { dateFormat, domain, t } = useLocale();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [answerEditingId, setAnswerEditingId] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState<Dayjs>(dayjs());

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

  const orderedQuestions = [...questions].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  const answerDraft = (question: OneToOneQuestion) =>
    answerDrafts[question.id] ?? question.answer;

  const changeAnswerDraft = (questionId: string, value: string) => {
    setAnswerDrafts((current) => ({ ...current, [questionId]: value }));
  };

  const openAnswerEditor = (question: OneToOneQuestion) => {
    setAnswerEditingId(question.id);
    setAnswerDrafts((current) => ({
      ...current,
      [question.id]: question.answer,
    }));
  };

  const closeAnswerEditor = (questionId: string) => {
    setAnswerEditingId((current) => (current === questionId ? null : current));
    setAnswerDrafts((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const saveAnswer = (question: OneToOneQuestion) => {
    onChangeAnswer(question.id, answerDraft(question).trim());
    closeAnswerEditor(question.id);
  };

  const saveMeeting = () => {
    if (!prep.trim() && !after.trim()) return;
    onSaveMeeting(meetingDate.startOf('day').valueOf(), prep, after);
    setMeetingDate(dayjs());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          padding: isMobile ? 12 : 16,
          borderRadius: token.borderRadiusLG,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Paragraph style={{ marginBottom: 8 }}>
          <Typography.Text strong>{t('oneToOne.goal')}</Typography.Text>
          <Typography.Text type="secondary">
            {domain.ONE_TO_ONE_GOAL}
          </Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          <Typography.Text strong>{t('oneToOne.frequency')}</Typography.Text>
          <Typography.Text type="secondary">
            {domain.ONE_TO_ONE_FREQUENCY[0]}
            <br />
            → {domain.ONE_TO_ONE_FREQUENCY[1]}
          </Typography.Text>
        </Typography.Paragraph>
      </div>

      <Collapse
        items={[
          {
            key: 'agenda',
            label: t('oneToOne.agendaTitle'),
            children: (
              <Table
                size="small"
                pagination={false}
                rowKey="stage"
                scroll={isMobile ? { x: 720 } : undefined}
                dataSource={domain.ONE_TO_ONE_AGENDA}
                columns={[
                  {
                    title: t('oneToOne.stage'),
                    dataIndex: 'stage',
                    key: 'stage',
                    width: isMobile ? 120 : 160,
                    render: (value: string) => (
                      <Typography.Text strong>{value}</Typography.Text>
                    ),
                  },
                  {
                    title: t('oneToOne.time'),
                    dataIndex: 'time',
                    key: 'time',
                    width: 80,
                  },
                  {
                    title: t('oneToOne.managerAction'),
                    dataIndex: 'manager',
                    key: 'manager',
                  },
                  {
                    title: t('oneToOne.employeeAction'),
                    dataIndex: 'employee',
                    key: 'employee',
                  },
                ]}
              />
            ),
          },
        ]}
      />

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
            {t('oneToOne.prepTitle')}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            {t('oneToOne.prepHint')}
          </Typography.Text>
          <Input.TextArea
            placeholder={t('oneToOne.prepPlaceholder')}
            value={prep}
            onChange={(e) => onChangePrep(e.target.value)}
            style={{ minHeight: 150, height: 150, resize: 'vertical' }}
          />
        </div>

        <div style={panelStyle}>
          <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
            {t('oneToOne.afterTitle')}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            {t('oneToOne.afterHint')}
          </Typography.Text>
          <Input.TextArea
            placeholder={t('oneToOne.afterPlaceholder')}
            value={after}
            onChange={(e) => onChangeAfter(e.target.value)}
            style={{ minHeight: 150, height: 150, resize: 'vertical' }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'flex-end',
          gap: 12,
        }}
      >
        <div>
          <Typography.Text
            type="secondary"
            style={{ display: 'block', marginBottom: 6 }}
          >
            {t('oneToOne.meetingDate')}
          </Typography.Text>
          <DatePicker
            value={meetingDate}
            onChange={(date) => date && setMeetingDate(date)}
            format={dateFormat}
            allowClear={false}
            style={{ width: isMobile ? '100%' : 180 }}
            aria-label={t('oneToOne.meetingDate')}
          />
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={saveMeeting}
          disabled={!prep.trim() && !after.trim()}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t('oneToOne.saveMeeting')}
        </Button>
      </div>

      <OneToOneNotesArchive notes={notes} onUpdate={onUpdateNote} />

      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          {t('oneToOne.questions')}
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
            placeholder={t('oneToOne.addQuestionPlaceholder')}
            size={isMobile ? 'large' : 'middle'}
            aria-label={t('oneToOne.questionTextAria')}
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            disabled={!draft.trim()}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('oneToOne.addQuestion')}
          </Button>
        </form>

        {questions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('oneToOne.noQuestions')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orderedQuestions.map((question, index) => {
              const isEditing = editingId === question.id;
              const isAnswerOpen =
                !question.answered || answerEditingId === question.id;

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
                      marginBottom: isEditing || isAnswerOpen ? 12 : 8,
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
                            aria-label={t('oneToOne.editQuestionAria')}
                            size={isMobile ? 'middle' : 'small'}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveQuestion(question.id)}
                            aria-label={t('oneToOne.deleteQuestionAria')}
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
                  )}
                  {isAnswerOpen ? (
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Input.TextArea
                        rows={2}
                        placeholder={t('oneToOne.answerPlaceholder')}
                        value={answerDraft(question)}
                        onChange={(e) =>
                          changeAnswerDraft(question.id, e.target.value)
                        }
                      />
                      <Space
                        direction={isMobile ? 'vertical' : 'horizontal'}
                        style={{ width: isMobile ? '100%' : undefined }}
                      >
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={() => saveAnswer(question)}
                          aria-label={t('oneToOne.saveAnswerAria')}
                          block={isMobile}
                          size={isMobile ? 'large' : 'middle'}
                        >
                          {t('common.save')}
                        </Button>
                        {question.answered && (
                          <Button
                            onClick={() => closeAnswerEditor(question.id)}
                            block={isMobile}
                            size={isMobile ? 'large' : 'middle'}
                          >
                            {t('common.cancel')}
                          </Button>
                        )}
                      </Space>
                    </Space>
                  ) : (
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Typography.Paragraph
                        type={question.answer ? undefined : 'secondary'}
                        style={{ margin: 0, whiteSpace: 'pre-wrap' }}
                      >
                        {question.answer || t('oneToOne.answerEmpty')}
                      </Typography.Paragraph>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => openAnswerEditor(question)}
                        aria-label={t('oneToOne.editAnswerAria')}
                        block={isMobile}
                        size={isMobile ? 'large' : 'middle'}
                      >
                        {t('common.edit')}
                      </Button>
                    </Space>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
