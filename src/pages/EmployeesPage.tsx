import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Segmented,
  Space,
  Typography,
  message,
  theme,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RightOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { parseWorkMode, type WorkMode } from '../types/workspace';
import {
  getFullName,
  type Employee,
  type ProjectAssignment,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  projectAssignments?: ProjectAssignment[];
}

function ProjectAssignmentsMeta({
  assignments,
}: {
  assignments: ProjectAssignment[];
}) {
  const { t } = useLocale();
  if (assignments.length === 0) return null;

  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      {assignments.map((assignment, index) => (
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
      ))}
    </Space>
  );
}

export function EmployeesPage() {
  const { employees, loading, addEmployee, updateEmployeeProfile, removeEmployee } =
    useEmployees();
  const { workMode, setWorkMode } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm<EmployeeFormValues>();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { locale, t } = useLocale();
  const isHeadOfLeads = workMode === 'headOfLeads';

  const openCreate = () => {
    setEditingEmployee(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      projectAssignments: employee.projectAssignments,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const profile = {
        firstName: values.firstName,
        lastName: values.lastName,
        projectAssignments: values.projectAssignments ?? [],
      };

      if (editingEmployee) {
        updateEmployeeProfile(editingEmployee.id, profile);
        message.success(t('employees.updated'));
      } else {
        await addEmployee(profile);
        message.success(t('employees.created'));
      }
      closeModal();
    } catch {
      // validation errors are shown by Form
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: 16,
          gap: 12,
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
            {t('employees.title')}
          </Typography.Title>
          <Typography.Text type="secondary">
            {t(
              isHeadOfLeads
                ? 'employees.subtitleHeadOfLeads'
                : 'employees.subtitle',
            )}
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t(isHeadOfLeads ? 'employees.addLead' : 'employees.add')}
        </Button>
      </div>

      <Segmented<WorkMode>
        value={workMode}
        onChange={(value) => setWorkMode(parseWorkMode(value))}
        block={isMobile}
        size={isMobile ? 'large' : 'middle'}
        style={{ marginBottom: 16, maxWidth: isMobile ? '100%' : 420 }}
        aria-label={t('mode.switchAria')}
        options={[
          { label: t('mode.team'), value: 'team' },
          { label: t('mode.headOfLeads'), value: 'headOfLeads' },
        ]}
      />

      {isHeadOfLeads && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Link
            to="/notes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: isMobile ? 12 : 16,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorText,
              textDecoration: 'none',
            }}
            aria-label={t('leadNotes.cardAria')}
          >
            <FileTextOutlined
              style={{
                fontSize: 22,
                color: token.colorPrimary,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text strong style={{ display: 'block' }}>
                {t('leadNotes.cardTitle')}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {t('leadNotes.cardSubtitle')}
              </Typography.Text>
            </div>
            <RightOutlined
              style={{
                color: token.colorTextQuaternary,
                fontSize: 12,
                flexShrink: 0,
              }}
            />
          </Link>
          <Link
            to="/profiles"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: isMobile ? 12 : 16,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorText,
              textDecoration: 'none',
            }}
            aria-label={t('profiles.cardAria')}
          >
            <SolutionOutlined
              style={{
                fontSize: 22,
                color: token.colorPrimary,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text strong style={{ display: 'block' }}>
                {t('profiles.cardTitle')}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {t('profiles.cardSubtitle')}
              </Typography.Text>
            </div>
            <RightOutlined
              style={{
                color: token.colorTextQuaternary,
                fontSize: 12,
                flexShrink: 0,
              }}
            />
          </Link>
        </div>
      )}

      <List
        loading={loading}
        bordered
        style={{ background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t(
                isHeadOfLeads ? 'employees.emptyHeadOfLeads' : 'employees.empty',
              )}
            />
          ),
        }}
        dataSource={[...employees].sort((a, b) =>
          getFullName(a).localeCompare(
            getFullName(b),
            locale === 'ru' ? 'ru' : 'en',
          ),
        )}
        renderItem={(employee) => (
          <List.Item
            style={{
              padding: isMobile ? '12px 12px' : undefined,
              gap: 8,
            }}
            actions={[
              <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                aria-label={t('employees.editAria')}
                style={isMobile ? { width: 40, height: 40 } : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(employee);
                }}
              />,
              <Popconfirm
                key="delete"
                title={t('employees.deleteTitle')}
                description={t('employees.deleteDescription', {
                  name: getFullName(employee),
                })}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
                okButtonProps={{ danger: true }}
                onConfirm={async () => {
                  await removeEmployee(employee.id);
                  message.success(t('employees.deleted'));
                }}
              >
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  aria-label={t('employees.deleteAria')}
                  style={isMobile ? { width: 40, height: 40 } : undefined}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>,
            ]}
          >
            <Link
              to={`/employee/${employee.id}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                flex: 1,
                minWidth: 0,
                color: token.colorText,
                textDecoration: 'none',
                padding: isMobile ? '4px 0' : undefined,
              }}
            >
              <UserOutlined
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
                <div style={{ marginTop: 2 }}>
                  <ProjectAssignmentsMeta
                    assignments={employee.projectAssignments}
                  />
                </div>
              </div>
              {isMobile && (
                <RightOutlined
                  style={{
                    color: token.colorTextQuaternary,
                    fontSize: 12,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          </List.Item>
        )}
      />

      <Modal
        title={
          editingEmployee
            ? t('employees.editTitle')
            : t('employees.newTitle')
        }
        open={open}
        onCancel={closeModal}
        onOk={() => void handleSubmit()}
        okText={
          editingEmployee ? t('common.save') : t('common.add')
        }
        cancelText={t('common.cancel')}
        destroyOnHidden
        centered
        width={isMobile ? 'calc(100vw - 32px)' : 680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="lastName"
            label={t('employees.lastName')}
            rules={[
              { required: true, message: t('employees.lastNameRequired') },
            ]}
          >
            <Input
              placeholder={t('employees.lastNamePlaceholder')}
              size={isMobile ? 'large' : 'middle'}
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name="firstName"
            label={t('employees.firstName')}
            rules={[
              { required: true, message: t('employees.firstNameRequired') },
            ]}
          >
            <Input
              placeholder={t('employees.firstNamePlaceholder')}
              size={isMobile ? 'large' : 'middle'}
            />
          </Form.Item>
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
                  onClick={() =>
                    add({ project: '', projectManager: '' })
                  }
                  block
                >
                  {t('employees.addProject')}
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
