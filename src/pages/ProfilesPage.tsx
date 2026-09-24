import { Link } from 'react-router-dom';
import { Empty, List, Typography, theme } from 'antd';
import { ArrowLeftOutlined, RightOutlined, SolutionOutlined } from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import { getFullName } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

export function ProfilesPage() {
  const { employees, loading } = useEmployees();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { locale, t } = useLocale();

  const sorted = [...employees].sort((a, b) =>
    getFullName(a).localeCompare(getFullName(b), locale === 'ru' ? 'ru' : 'en'),
  );

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
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          <Link to="/">{t('detail.team')}</Link>
          {' / '}
          {t('profiles.title')}
        </Typography.Text>
      )}

      <div style={{ marginBottom: 16 }}>
        <Typography.Title
          level={isMobile ? 4 : 3}
          style={{ marginTop: 0, marginBottom: 4 }}
        >
          {t('profiles.title')}
        </Typography.Title>
        <Typography.Text type="secondary">{t('profiles.subtitle')}</Typography.Text>
      </div>

      <List
        loading={loading}
        bordered
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('profiles.empty')}
            />
          ),
        }}
        dataSource={sorted}
        renderItem={(employee) => (
          <List.Item style={{ padding: isMobile ? '12px 12px' : undefined }}>
            <Link
              to={`/profiles/${employee.id}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                flex: 1,
                minWidth: 0,
                color: token.colorText,
                textDecoration: 'none',
              }}
            >
              <SolutionOutlined
                style={{
                  fontSize: 18,
                  color: token.colorPrimary,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography.Text strong ellipsis style={{ display: 'block' }}>
                  {getFullName(employee)}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
                  {t('profiles.leadPrefix')}
                  {employee.leadName || t('profiles.leadMissing')}
                </Typography.Text>
                {employee.projectAssignments.length === 0 ? (
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {t('profiles.projectsMissing')}
                  </Typography.Text>
                ) : (
                  employee.projectAssignments.map((assignment, index) => (
                    <Typography.Text
                      key={`${assignment.project}-${assignment.projectManager}-${index}`}
                      type="secondary"
                      style={{ fontSize: 13, display: 'block' }}
                    >
                      <Typography.Text strong>
                        {assignment.project || t('employees.projectMissing')}
                      </Typography.Text>
                      {t('employees.managerPrefix')}
                      {assignment.projectManager || t('employees.notSpecified')}
                    </Typography.Text>
                  ))
                )}
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {t('profiles.commentCount', {
                    count: employee.characterizations.length,
                  })}
                </Typography.Text>
              </div>
              <RightOutlined
                style={{
                  color: token.colorTextQuaternary,
                  fontSize: 12,
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}
