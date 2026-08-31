import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, Empty, Spin, Tabs, Typography, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import { NeedsBlock } from '../components/NeedsBlock';
import { MetricsBlock } from '../components/MetricsBlock';
import { LeadershipBlock } from '../components/LeadershipBlock';
import { SavedNotesBlock } from '../components/SavedNotesBlock';
import { FeedbackBlock } from '../components/FeedbackBlock';
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

      <Typography.Title
        level={isMobile ? 4 : 3}
        style={{ marginTop: 0, marginBottom: 16 }}
        ellipsis
      >
        {fullName}
      </Typography.Title>

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
              key: 'notes',
              label: isMobile ? 'One-to-one' : 'Заметки после One-to-one',
              children: (
                <SavedNotesBlock
                  notes={employee.oneToOneNotes}
                  placeholder="Запишите итоги и договорённости после one-to-one..."
                  onAdd={(text) => addOneToOneNote(employee.id, text)}
                  onUpdate={(noteId, text) =>
                    updateOneToOneNote(employee.id, noteId, text)
                  }
                />
              ),
            },
            {
              key: 'delegation',
              label: 'Делегирование',
              children: (
                <SavedNotesBlock
                  notes={employee.delegationNotes}
                  placeholder="Заметки по делегированию..."
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
