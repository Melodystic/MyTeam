import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, Empty, Spin, Tabs, Typography, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import { NeedsBlock } from '../components/NeedsBlock';
import { MetricsBlock } from '../components/MetricsBlock';
import { LeadershipBlock } from '../components/LeadershipBlock';
import { DelegationBlock } from '../components/DelegationBlock';
import { OneToOneBlock } from '../components/OneToOneBlock';
import { FeedbackBlock } from '../components/FeedbackBlock';
import { TaskSettingBlock } from '../components/TaskSettingBlock';
import { getFullName } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    getById,
    updateNeedScore,
    updateNeedMark,
    updateNeedComment,
    addMetrics,
    removeMetric,
    updateMetricValue,
    updateMetricComment,
    updateLeadershipStyle,
    updateOneToOnePrep,
    updateOneToOneAfter,
    addOneToOneQuestion,
    updateOneToOneQuestion,
    updateOneToOneQuestionAnswer,
    removeOneToOneQuestion,
    saveOneToOneMeeting,
    updateOneToOneNote,
    addDelegationNote,
    updateDelegationNote,
    updateFeedbackType,
    updateFeedbackNotes,
    addColleagueFeedback,
  } = useEmployees();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { t } = useLocale();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const employee = id ? getById(id) : undefined;

  if (!employee) {
    return (
      <Empty description={t('detail.notFound')} style={{ marginTop: 48 }}>
        <Link to="/">{t('detail.returnToList')}</Link>
      </Empty>
    );
  }

  const fullName = getFullName(employee);

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
            { title: fullName },
          ]}
        />
      )}

      <div style={{ marginTop: 0, marginBottom: 16 }}>
        <Typography.Title
          level={isMobile ? 4 : 3}
          style={{ marginTop: 0, marginBottom: 4 }}
          ellipsis
        >
          {fullName}
        </Typography.Title>
        {employee.projectAssignments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {employee.projectAssignments.map((assignment, index) => (
              <Typography.Text
                key={`${assignment.project}-${assignment.projectManager}-${index}`}
                type="secondary"
                style={{ fontSize: isMobile ? 13 : 14 }}
              >
                <Typography.Text strong>
                  {assignment.project || t('employees.projectMissing')}
                </Typography.Text>
                {t('employees.managerPrefix')}
                {assignment.projectManager || t('employees.notSpecified')}
              </Typography.Text>
            ))}
          </div>
        )}
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
              key: 'needs',
              label: isMobile ? t('tabs.needsMobile') : t('tabs.needs'),
              children: (
                <NeedsBlock
                  employee={employee}
                  onChangeScore={(need, delta) =>
                    void updateNeedScore(employee.id, need, delta)
                  }
                  onChangeMark={(need, mark) =>
                    void updateNeedMark(employee.id, need, mark)
                  }
                  onChangeComment={(need, comment) =>
                    void updateNeedComment(employee.id, need, comment)
                  }
                />
              ),
            },
            {
              key: 'metrics',
              label: t('tabs.metrics'),
              children: (
                <MetricsBlock
                  employee={employee}
                  onAddMetrics={(metrics) => addMetrics(employee.id, metrics)}
                  onRemoveMetric={(metricId) => removeMetric(employee.id, metricId)}
                  onChangeValue={(metricId, delta) =>
                    updateMetricValue(employee.id, metricId, delta)
                  }
                  onChangeComment={(metricId, comment) =>
                    updateMetricComment(employee.id, metricId, comment)
                  }
                />
              ),
            },
            {
              key: 'leadership',
              label: isMobile
                ? t('tabs.leadershipMobile')
                : t('tabs.leadership'),
              children: (
                <LeadershipBlock
                  value={employee.leadershipStyle}
                  onChange={(style) => void updateLeadershipStyle(employee.id, style)}
                />
              ),
            },
            {
              key: 'tasks',
              label: isMobile ? t('tabs.tasksMobile') : t('tabs.tasks'),
              children: <TaskSettingBlock />,
            },
            {
              key: 'notes',
              label: t('tabs.oneToOne'),
              children: (
                <OneToOneBlock
                  prep={employee.oneToOnePrep}
                  after={employee.oneToOneAfter}
                  questions={employee.oneToOneQuestions ?? []}
                  notes={employee.oneToOneNotes}
                  onChangePrep={(prep) => updateOneToOnePrep(employee.id, prep)}
                  onChangeAfter={(text) => updateOneToOneAfter(employee.id, text)}
                  onAddQuestion={(text) => addOneToOneQuestion(employee.id, text)}
                  onUpdateQuestion={(questionId, text) =>
                    updateOneToOneQuestion(employee.id, questionId, text)
                  }
                  onChangeAnswer={(questionId, answer) =>
                    updateOneToOneQuestionAnswer(employee.id, questionId, answer)
                  }
                  onRemoveQuestion={(questionId) =>
                    removeOneToOneQuestion(employee.id, questionId)
                  }
                  onSaveMeeting={(meetingDate, prep, after) =>
                    saveOneToOneMeeting(employee.id, meetingDate, prep, after)
                  }
                  onUpdateNote={(noteId, note) =>
                    updateOneToOneNote(employee.id, noteId, note)
                  }
                />
              ),
            },
            {
              key: 'delegation',
              label: t('tabs.delegation'),
              children: (
                <DelegationBlock
                  notes={employee.delegationNotes}
                  onAdd={(text) => addDelegationNote(employee.id, text)}
                  onUpdate={(noteId, text) =>
                    updateDelegationNote(employee.id, noteId, text)
                  }
                />
              ),
            },
            {
              key: 'feedback',
              label: isMobile
                ? t('tabs.feedbackMobile')
                : t('tabs.feedback'),
              children: (
                <FeedbackBlock
                  feedbackType={employee.feedbackType}
                  feedbackNotes={employee.feedbackNotes}
                  colleagueFeedback={employee.colleagueFeedback}
                  onChangeType={(type) => void updateFeedbackType(employee.id, type)}
                  onChangeNotes={(notes) => void updateFeedbackNotes(employee.id, notes)}
                  onAddColleagueFeedback={(colleagueName, position, comment) =>
                    addColleagueFeedback(
                      employee.id,
                      colleagueName,
                      position,
                      comment,
                    )
                  }
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
