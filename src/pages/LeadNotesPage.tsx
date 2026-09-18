import { Link } from 'react-router-dom';
import { Breadcrumb, Tabs, Typography, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { DatedMeetingNotesBlock } from '../components/DatedMeetingNotesBlock';
import { useWorkspace } from '../context/WorkspaceContext';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';
import type { LeadNoteKind } from '../types/workspace';

export function LeadNotesPage() {
  const {
    notes,
    updateLeadNotesPrep,
    updateLeadNotesAfter,
    saveLeadMeeting,
    updateLeadMeetingNote,
  } = useWorkspace();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { t } = useLocale();

  const renderSection = (kind: LeadNoteKind) => {
    const section = notes[kind];

    return (
      <DatedMeetingNotesBlock
        prep={section.prep}
        after={section.after}
        notes={section.notes}
        onChangePrep={(prep) => updateLeadNotesPrep(kind, prep)}
        onChangeAfter={(after) => updateLeadNotesAfter(kind, after)}
        onSaveMeeting={(meetingDate, prep, after) =>
          saveLeadMeeting(kind, meetingDate, prep, after)
        }
        onUpdateNote={(noteId, note) =>
          updateLeadMeetingNote(kind, noteId, note)
        }
      />
    );
  };

  return (
    <div>
      {isMobile ? (
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12,
            color: token.colorPrimary,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          <ArrowLeftOutlined />
          {t('detail.backToTeam')}
        </Link>
      ) : (
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link to="/">{t('detail.team')}</Link> },
            { title: t('leadNotes.title') },
          ]}
        />
      )}

      <div style={{ marginBottom: 16 }}>
        <Typography.Title
          level={isMobile ? 4 : 3}
          style={{ marginTop: 0, marginBottom: 4 }}
        >
          {t('leadNotes.title')}
        </Typography.Title>
        <Typography.Text type="secondary">
          {t('leadNotes.subtitle')}
        </Typography.Text>
      </div>

      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: isMobile ? '4px 12px 16px' : '8px 20px 20px',
        }}
      >
        <Tabs
          size={isMobile ? 'small' : 'middle'}
          tabBarGutter={isMobile ? 12 : 24}
          items={[
            {
              key: 'directorate',
              label: isMobile
                ? t('leadNotes.directorateMobile')
                : t('leadNotes.directorate'),
              children: renderSection('directorate'),
            },
            {
              key: 'leads',
              label: isMobile
                ? t('leadNotes.leadsMobile')
                : t('leadNotes.leads'),
              children: renderSection('leads'),
            },
            {
              key: 'managerOneToOne',
              label: isMobile
                ? t('leadNotes.managerMobile')
                : t('leadNotes.manager'),
              children: renderSection('managerOneToOne'),
            },
          ]}
        />
      </div>
    </div>
  );
}
