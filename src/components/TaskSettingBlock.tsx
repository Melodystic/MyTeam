import { useState } from 'react';
import {
  Button,
  Collapse,
  Input,
  Select,
  Space,
  Typography,
  theme,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useLocale } from '../context/LocaleContext';
import type { SavedNote } from '../types/employee';
import { SavedNotesBlock } from './SavedNotesBlock';
import { useIsMobile } from '../hooks/useBreakpoint';

interface TaskSettingBlockProps {
  notes: SavedNote[];
  projects: string[];
  onAddNote: (text: string, project: string) => void;
  onUpdateNote: (noteId: string, text: string) => void;
}

function MethodSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
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

export function TaskSettingBlock({
  notes,
  projects,
  onAddNote,
  onUpdateNote,
}: TaskSettingBlockProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { domain, t } = useLocale();
  const [draft, setDraft] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const uniqueProjects = Array.from(
    new Set(projects.map((project) => project.trim()).filter(Boolean)),
  );
  const hasMultipleProjects = uniqueProjects.length > 1;
  const projectIsSelected = uniqueProjects.includes(selectedProject);

  const saveComment = () => {
    const text = draft.trim();
    const project =
      uniqueProjects.length === 1
        ? uniqueProjects[0]
        : projectIsSelected
          ? selectedProject
          : '';

    if (!text || (hasMultipleProjects && !project)) return;
    onAddNote(text, project);
    setDraft('');
    setSelectedProject('');
  };

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
          {t('tasks.commentsTitle')}
        </Typography.Title>
        {hasMultipleProjects && (
          <div style={{ marginBottom: 12 }}>
            <Typography.Text
              type="secondary"
              style={{ display: 'block', marginBottom: 6 }}
            >
              {t('tasks.projectSelectLabel')}
            </Typography.Text>
            <Select
              value={projectIsSelected ? selectedProject : undefined}
              onChange={setSelectedProject}
              placeholder={t('tasks.projectSelectPlaceholder')}
              options={uniqueProjects.map((project) => ({
                value: project,
                label: project,
              }))}
              style={{ width: '100%', maxWidth: 420 }}
              size={isMobile ? 'large' : 'middle'}
            />
          </div>
        )}
        <Input.TextArea
          rows={isMobile ? 4 : 5}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('tasks.commentsPlaceholder')}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={saveComment}
          disabled={!draft.trim() || (hasMultipleProjects && !projectIsSelected)}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
          style={{ marginTop: 12 }}
        >
          {t('tasks.saveComment')}
        </Button>
        <div style={{ marginTop: 20 }}>
          <SavedNotesBlock
            notes={notes}
            savedTitle={t('tasks.savedComments')}
            emptyDescription={t('tasks.commentsEmpty')}
            renderNoteMeta={(note) =>
              note.project ? (
                <Typography.Text strong>
                  {t('tasks.projectMeta', { project: note.project })}
                </Typography.Text>
              ) : null
            }
            hideComposer
            onUpdate={onUpdateNote}
          />
        </div>
      </div>

      <Collapse
        items={[
          {
            key: 'smart',
            label: t('tasks.smartTitle'),
            children: (
              <>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginBottom: 16 }}
                >
                  {t('tasks.smartIntro')}
                </Typography.Paragraph>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {domain.SMART_CRITERIA.map((item) => (
                    <div
                      key={item.letter}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}
                    >
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
                        <Typography.Text
                          type="secondary"
                          style={{ display: 'block', marginBottom: 4 }}
                        >
                          {item.word}
                        </Typography.Text>
                        <Typography.Paragraph
                          type="secondary"
                          style={{ marginBottom: 0 }}
                        >
                          {item.description}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  ))}
                </Space>
              </>
            ),
          },
        ]}
      />

      <div>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          {t('tasks.methodsTitle')}
        </Typography.Title>
        <Collapse
          accordion
          items={domain.TASK_SETTING_METHODS.map((method) => ({
            key: method.key,
            label: <Typography.Text strong>{method.title}</Typography.Text>,
            children: (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {method.intro}
                </Typography.Paragraph>
                <MethodSection title={t('tasks.howTo')} items={method.howTo} />
                <MethodSection
                  title={t('tasks.whenToUse')}
                  items={method.whenToUse}
                />
                <MethodSection title={t('tasks.pros')} items={method.pros} />
                <MethodSection title={t('tasks.cons')} items={method.cons} />
              </Space>
            ),
          }))}
        />
      </div>
    </Space>
  );
}
