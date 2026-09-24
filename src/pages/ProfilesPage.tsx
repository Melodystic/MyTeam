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
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  RightOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { useProfiles } from '../context/ProfilesContext';
import { getFullName } from '../types/employee';
import { useIsMobile } from '../hooks/useBreakpoint';
import { useLocale } from '../context/LocaleContext';

interface NewProfileValues {
  firstName: string;
  lastName: string;
}

export function ProfilesPage() {
  const { profiles, loading, addProfile, removeProfile } = useProfiles();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<NewProfileValues>();
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const { locale, t } = useLocale();

  const sorted = [...profiles].sort((a, b) =>
    getFullName(a).localeCompare(getFullName(b), locale === 'ru' ? 'ru' : 'en'),
  );

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addProfile(values);
      message.success(t('profiles.created'));
      closeModal();
    } catch {
      // validation errors are shown by Form
    }
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
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          <Link to="/">{t('detail.team')}</Link>
          {' / '}
          {t('profiles.title')}
        </Typography.Text>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: 16,
          gap: 12,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <div>
          <Typography.Title
            level={isMobile ? 4 : 3}
            style={{ marginTop: 0, marginBottom: 4 }}
          >
            {t('profiles.title')}
          </Typography.Title>
          <Typography.Text type="secondary">{t('profiles.subtitle')}</Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          block={isMobile}
          size={isMobile ? 'large' : 'middle'}
        >
          {t('profiles.add')}
        </Button>
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
        renderItem={(profile) => (
          <List.Item
            style={{ padding: isMobile ? '12px 12px' : undefined, gap: 8 }}
            actions={
              profile.sourceEmployeeId
                ? undefined
                : [
                    <Popconfirm
                      key="delete"
                      title={t('profiles.deleteTitle')}
                      description={t('profiles.deleteDescription', {
                        name: getFullName(profile),
                      })}
                      okText={t('common.delete')}
                      cancelText={t('common.cancel')}
                      okButtonProps={{ danger: true }}
                      onConfirm={() => {
                        removeProfile(profile.id);
                        message.success(t('profiles.deleted'));
                      }}
                    >
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        aria-label={t('profiles.deleteAria')}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </Popconfirm>,
                  ]
            }
          >
            <Link
              to={`/profiles/${profile.id}`}
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
                  {getFullName(profile)}
                </Typography.Text>
                {profile.sourceEmployeeId && (
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    {t('profiles.fromTeam')}
                  </Typography.Text>
                )}
                <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
                  {t('profiles.leadPrefix')}
                  {profile.leadName || t('profiles.leadMissing')}
                </Typography.Text>
                {profile.projectAssignments.length === 0 ? (
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {t('profiles.projectsMissing')}
                  </Typography.Text>
                ) : (
                  profile.projectAssignments.map((assignment, index) => (
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
                    count: profile.characterizations.length,
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

      <Modal
        title={t('profiles.newTitle')}
        open={open}
        onCancel={closeModal}
        onOk={() => void handleSubmit()}
        okText={t('common.add')}
        cancelText={t('common.cancel')}
        destroyOnHidden
        centered
        width={isMobile ? 'calc(100vw - 32px)' : 480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="lastName"
            label={t('employees.lastName')}
            rules={[{ required: true, message: t('employees.lastNameRequired') }]}
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
            rules={[{ required: true, message: t('employees.firstNameRequired') }]}
          >
            <Input
              placeholder={t('employees.firstNamePlaceholder')}
              size={isMobile ? 'large' : 'middle'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
