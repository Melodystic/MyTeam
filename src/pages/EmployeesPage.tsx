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
  Space,
  Typography,
  message,
  theme,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import {
  getFullName,
  type Employee,
  type ProjectAssignment,
} from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

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
  if (assignments.length === 0) return null;

  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      {assignments.map((assignment, index) => (
        <Typography.Text
          key={`${assignment.project}-${assignment.projectManager}-${index}`}
          type="secondary"
          style={{ fontSize: 13, display: 'block' }}
        >
          <Typography.Text strong>{assignment.project || 'Проект не указан'}</Typography.Text>
          {' · РП: '}
          {assignment.projectManager || 'не указан'}
        </Typography.Text>
      ))}
    </Space>
  );
}

export function EmployeesPage() {
  const { employees, loading, addEmployee, updateEmployeeProfile, removeEmployee } =
    useEmployees();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm<EmployeeFormValues>();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

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
        message.success('Сотрудник обновлён');
      } else {
        await addEmployee(profile);
        message.success('Сотрудник добавлен');
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
          marginBottom: 24,
          gap: 12,
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
            Команда
          </Typography.Title>
          <Typography.Text type="secondary">
            Список сотрудников для ведения one-to-one
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          Добавить сотрудника
        </Button>
      </div>

      <List
        loading={loading}
        bordered
        style={{ background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Пока нет сотрудников. Добавьте первого."
            />
          ),
        }}
        dataSource={[...employees].sort((a, b) =>
          getFullName(a).localeCompare(getFullName(b), 'ru'),
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
                aria-label="Редактировать сотрудника"
                style={isMobile ? { width: 40, height: 40 } : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(employee);
                }}
              />,
              <Popconfirm
                key="delete"
                title="Удалить сотрудника?"
                description={`«${getFullName(employee)}» будет удалён безвозвратно.`}
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{ danger: true }}
                onConfirm={async () => {
                  await removeEmployee(employee.id);
                  message.success('Сотрудник удалён');
                }}
              >
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  aria-label="Удалить сотрудника"
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
        title={editingEmployee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
        open={open}
        onCancel={closeModal}
        onOk={() => void handleSubmit()}
        okText={editingEmployee ? 'Сохранить' : 'Добавить'}
        cancelText="Отмена"
        destroyOnHidden
        centered
        width={isMobile ? 'calc(100vw - 32px)' : 680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="lastName"
            label="Фамилия"
            rules={[{ required: true, message: 'Введите фамилию' }]}
          >
            <Input placeholder="Иванов" size={isMobile ? 'large' : 'middle'} autoFocus />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Иван" size={isMobile ? 'large' : 'middle'} />
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
                      label="Проект"
                      rules={[{ required: true, message: 'Введите проект' }]}
                      style={{ marginBottom: isMobile ? 12 : 0 }}
                    >
                      <Input
                        placeholder="Название проекта"
                        size={isMobile ? 'large' : 'middle'}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'projectManager']}
                      label="Руководитель проекта"
                      rules={[{ required: true, message: 'Введите РП' }]}
                      style={{ marginBottom: isMobile ? 12 : 0 }}
                    >
                      <Input
                        placeholder="Имя руководителя"
                        size={isMobile ? 'large' : 'middle'}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                      aria-label="Удалить проект"
                      block={isMobile}
                      style={isMobile ? undefined : { marginTop: 30 }}
                    >
                      {isMobile && 'Удалить проект'}
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
                  Добавить проект и РП
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
