import { useState, type CSSProperties } from 'react';
import { Button, DatePicker, Input, Typography, theme } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { OneToOneMeetingNote } from '../types/employee';
import { OneToOneNotesArchive } from './OneToOneNotesArchive';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface DatedMeetingNotesBlockProps {
  prep: string;
  after: string;
  notes: OneToOneMeetingNote[];
  onChangePrep: (prep: string) => void;
  onChangeAfter: (after: string) => void;
  onSaveMeeting: (meetingDate: number, prep: string, after: string) => void;
  onUpdateNote: (
    noteId: string,
    note: Pick<OneToOneMeetingNote, 'meetingDate' | 'prep' | 'after'>,
  ) => void;
}

export function DatedMeetingNotesBlock({
  prep,
  after,
  notes,
  onChangePrep,
  onChangeAfter,
  onSaveMeeting,
  onUpdateNote,
}: DatedMeetingNotesBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { dateFormat, t } = useLocale();
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

  const saveMeeting = () => {
    if (!prep.trim() && !after.trim()) return;
    onSaveMeeting(meetingDate.startOf('day').valueOf(), prep, after);
    setMeetingDate(dayjs());
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
            {t('oneToOne.prepTitle')}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            {t('oneToOne.prepHint')}
          </Typography.Text>
          <Input.TextArea
            placeholder={t('oneToOne.prepPlaceholder')}
            value={prep}
            onChange={(event) => onChangePrep(event.target.value)}
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
            onChange={(event) => onChangeAfter(event.target.value)}
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
    </div>
  );
}
