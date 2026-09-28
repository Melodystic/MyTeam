import { useState } from 'react';
import { Button, DatePicker, Input, Typography, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { OneToOneMeetingNote } from '../types/employee';
import { useLocale } from '../context/LocaleContext';
import { useIsMobile } from '../hooks/useBreakpoint';
import { OneToOneNotesArchive } from './OneToOneNotesArchive';

interface GroupCallNotesBlockProps {
  draft: string;
  notes: OneToOneMeetingNote[];
  onChangeDraft: (draft: string) => void;
  onSave: (meetingDate: number, draft: string) => void;
  onUpdate: (
    noteId: string,
    note: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
  ) => void;
}

export function GroupCallNotesBlock({
  draft,
  notes,
  onChangeDraft,
  onSave,
  onUpdate,
}: GroupCallNotesBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { dateFormat, t } = useLocale();
  const [meetingDate, setMeetingDate] = useState<Dayjs>(dayjs());

  const handleSave = () => {
    const text = draft.trim();
    if (!text) return;
    onSave(meetingDate.startOf('day').valueOf(), text);
    setMeetingDate(dayjs());
  };

  return (
    <div
      style={{
        padding: isMobile ? 12 : 16,
        marginBottom: 16,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
        {t('groupNotes.title')}
      </Typography.Title>
      <Typography.Text
        type="secondary"
        style={{ display: 'block', marginBottom: 12 }}
      >
        {t('groupNotes.subtitle')}
      </Typography.Text>

      <Typography.Text
        type="secondary"
        style={{ display: 'block', marginBottom: 6 }}
      >
        {t('groupNotes.noteLabel')}
      </Typography.Text>
      <Input.TextArea
        rows={4}
        value={draft}
        onChange={(event) => onChangeDraft(event.target.value)}
        placeholder={t('groupNotes.placeholder')}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'flex-end',
          gap: 12,
          margin: '12px 0 16px',
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
          onClick={handleSave}
          disabled={!draft.trim()}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t('groupNotes.save')}
        </Button>
      </div>

      <OneToOneNotesArchive
        notes={notes}
        showPrep={false}
        afterLabel={t('groupNotes.noteLabel')}
        afterPlaceholder={t('groupNotes.placeholder')}
        onUpdate={onUpdate}
      />
    </div>
  );
}
