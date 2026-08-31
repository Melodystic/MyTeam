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
  Typography,
  message,
  theme,
} from 'antd';
import { DeleteOutlined, PlusOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { useEmployees } from '../context/EmployeesContext';
import { getFullName } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';

export function EmployeesPage() {
  const { employees, loading, addEmployee, removeEmployee } = useEmployees();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<{ firstName: string; lastName: string }>();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await addEmployee(values.firstName, values.lastName);
      message.success('Сотрудник добавлен');
      form.resetFields();
      setOpen(false);
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
          onClick={() => setOpen(true)}
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
                alignItems: 'center',
                gap: 12,
                flex: 1,
                minWidth: 0,
                color: token.colorText,
                textDecoration: 'none',
                padding: isMobile ? '4px 0' : undefined,
              }}
            >
              <UserOutlined
                style={{ fontSize: 18, color: token.colorPrimary, flexShrink: 0 }}
              />
              <Typography.Text strong ellipsis style={{ flex: 1, minWidth: 0 }}>
                {getFullName(employee)}
              </Typography.Text>
              {isMobile && (
                <RightOutlined style={{ color: token.colorTextQuaternary, fontSize: 12 }} />
              )}
            </Link>
          </List.Item>
        )}
      />

      <Modal
        title="Новый сотрудник"
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Добавить"
        cancelText="Отмена"
        destroyOnHidden
        centered
        width={isMobile ? 'calc(100vw - 32px)' : 520}
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
        </Form>
      </Modal>
    </div>
  );
}
