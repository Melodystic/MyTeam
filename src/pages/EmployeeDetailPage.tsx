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

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    getById,
    updateNeedPercent,
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
    addOneToOneNote,
    updateOneToOneNote,
    addDelegationNote,
    updateDelegationNote,
    updateFeedbackType,
    updateFeedbackNotes,
  } = useEmployees();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

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
      <Empty description="Сотрудник не найден" style={{ marginTop: 48 }}>
        <Link to="/">Вернуться к списку</Link>
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
          <ArrowLeftOutlined />К команде
        </Link>
      ) : (
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link to="/">Команда</Link> },
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
        {(employee.projects.length > 0 || employee.projectManagers.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {employee.projects.length > 0 && (
              <Typography.Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>
                Проекты: {employee.projects.join(', ')}
              </Typography.Text>
            )}
            {employee.projectManagers.length > 0 && (
              <Typography.Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>
                РП: {employee.projectManagers.join(', ')}
              </Typography.Text>
            )}
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
              label: isMobile ? 'Потребности' : 'Базовые потребности',
              children: (
                <NeedsBlock
                  employee={employee}
                  onChangePercent={(need, delta) =>
                    void updateNeedPercent(employee.id, need, delta)
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
              label: 'Метрики',
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
              label: isMobile ? 'Стиль' : 'Предпочтительный стиль руководства',
              children: (
                <LeadershipBlock
                  value={employee.leadershipStyle}
                  onChange={(style) => void updateLeadershipStyle(employee.id, style)}
                />
              ),
            },
            {
              key: 'tasks',
              label: isMobile ? 'Задачи' : 'Постановка задач',
              children: <TaskSettingBlock />,
            },
            {
              key: 'notes',
              label: 'One to one',
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
                  onAddNote={(text) => addOneToOneNote(employee.id, text)}
                  onUpdateNote={(noteId, text) =>
                    updateOneToOneNote(employee.id, noteId, text)
                  }
                />
              ),
            },
            {
              key: 'delegation',
              label: 'Делегирование',
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
              label: isMobile ? 'Фидбек' : 'Обратная связь',
              children: (
                <FeedbackBlock
                  feedbackType={employee.feedbackType}
                  feedbackNotes={employee.feedbackNotes}
                  onChangeType={(type) => void updateFeedbackType(employee.id, type)}
                  onChangeNotes={(notes) => void updateFeedbackNotes(employee.id, notes)}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
