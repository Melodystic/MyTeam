import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Empty,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  message,
  theme,
} from 'antd';
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { CharacterizationNotes } from '../components/CharacterizationNotes';
import { useEmployees } from '../context/EmployeesContext';
import { getFullName, type ProjectAssignment } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface ProfileFormValues {
  leadName: string;
  projectAssignments?: ProjectAssignment[];
}

export function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    getById,
    updateEmployeeProfile,
    addCharacterization,
    updateCharacterization,
  } = useEmployees();
  const [form] = Form.useForm<ProfileFormValues>();
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
        <Link to="/profiles">{t('profiles.backToList')}</Link>
      </Empty>
    );
  }

  const fullName = getFullName(employee);

  const saveProfile = async () => {
    try {
      const values = await form.validateFields();
      updateEmployeeProfile(employee.id, {
        firstName: employee.firstName,
        lastName: employee.lastName,
        projectAssignments: values.projectAssignments ?? [],
        leadName: values.leadName ?? '',
      });
      message.success(t('profiles.saved'));
    } catch {
      // validation errors are shown by Form
    }
  };

  return (
    <div>
      {isMobile ? (
        <Link
          to="/profiles"
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
          {t('profiles.backToList')}
        </Link>
      ) : (
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link to="/">{t('detail.team')}</Link> },
            { title: <Link to="/profiles">{t('profiles.title')}</Link> },
            { title: fullName },
          ]}
        />
      )}

      <Typography.Title
        level={isMobile ? 4 : 3}
        style={{ marginTop: 0, marginBottom: 16 }}
      >
        {fullName}
      </Typography.Title>

      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: isMobile ? 12 : 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <Form
          key={employee.id}
          form={form}
          layout="vertical"
          initialValues={{
            leadName: employee.leadName,
            projectAssignments: employee.projectAssignments,
          }}
        >
          <Form.Item name="leadName" label={t('profiles.lead')} style={{ maxWidth: 420 }}>
            <Input
              placeholder={t('profiles.leadPlaceholder')}
              size={isMobile ? 'large' : 'middle'}
            />
          </Form.Item>

          <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
            {t('profiles.projects')}
          </Typography.Text>
          <Form.List name="projectAssignments">
            {(fields, { add, remove }) => (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {fields.map((field) => (
                  <div
                    key={field.key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile
                        ? '1fr'
                        : 'minmax(0, 1fr) minmax(0, 1fr) auto',
                      gap: isMobile ? 0 : 12,
                      padding: 12,
                      borderRadius: token.borderRadiusLG,
                      border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <Form.Item
                      name={[field.name, 'project']}
                      label={t('employees.project')}
                      rules={[
                        { required: true, message: t('employees.projectRequired') },
                      ]}
                      style={{ marginBottom: isMobile ? 12 : 0 }}
                    >
                      <Input
                        placeholder={t('employees.projectPlaceholder')}
                        size={isMobile ? 'large' : 'middle'}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'projectManager']}
                      label={t('employees.projectManager')}
                      rules={[
                        { required: true, message: t('employees.managerRequired') },
                      ]}
                      style={{ marginBottom: isMobile ? 12 : 0 }}
                    >
                      <Input
                        placeholder={t('employees.managerPlaceholder')}
                        size={isMobile ? 'large' : 'middle'}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                      aria-label={t('employees.removeProject')}
                      block={isMobile}
                      style={isMobile ? undefined : { marginTop: 30 }}
                    >
                      {isMobile && t('employees.removeProject')}
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => add({ project: '', projectManager: '' })}
                  block
                >
                  {t('employees.addProject')}
                </Button>
              </Space>
            )}
          </Form.List>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => void saveProfile()}
            style={{ marginTop: 16 }}
            block={isMobile}
            size={isMobile ? 'large' : 'middle'}
          >
            {t('profiles.saveProfile')}
          </Button>
        </Form>

        <CharacterizationNotes
          notes={employee.characterizations}
          onAdd={(date, text) => addCharacterization(employee.id, date, text)}
          onUpdate={(noteId, note) =>
            updateCharacterization(employee.id, noteId, note)
          }
        />
      </div>
    </div>
  );
}
