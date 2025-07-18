import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Row, Col } from 'antd';

const { Option } = Select;

interface Role {
  type: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  status: boolean;
  role: Role[];
  firstName: string;
  lastName: string;
}

interface UserModalFormProps {
  visible: boolean;
  user: User | null;
  isEditing: boolean;
  onSave: (userData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserModalForm({ 
  visible, 
  user, 
  isEditing, 
  onSave, 
  onCancel,
  loading = false
}: UserModalFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEditing && user) {
        // Llenar el formulario con los datos del usuario a editar
        form.setFieldsValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          roles: user.role.map(r => r.name),
        });
      } else {
        // Limpiar el formulario para nuevo usuario
        form.resetFields();
        form.setFieldsValue({
          status: true, // Por defecto activo
        });
      }
    }
  }, [visible, user, isEditing, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const userData = {
        ...values,
        role: values.roles?.map((roleName: string) => ({
          type: roleName, // Usando el nombre del rol como tipo también
          name: roleName
        })) || []
      };
      
      if (isEditing && user) {
        userData._id = user._id;
      }
      
      onSave(userData);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title={isEditing ? 'Editar Usuario' : 'Agregar Usuario'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={isEditing ? 'Actualizar' : 'Agregar'}
      cancelText="Cancelar"
      confirmLoading={loading}
      closable={!loading}
      maskClosable={!loading}
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre de Usuario"
              name="username"
              rules={[
                { required: true, message: 'Por favor ingresa el nombre de usuario' },
                { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
              ]}
            >
              <Input placeholder="Nombre de usuario" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa el email' },
                { type: 'email', message: 'Por favor ingresa un email válido' }
              ]}
            >
              <Input placeholder="correo@ejemplo.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre"
              name="firstName"
              rules={[
                { required: true, message: 'Por favor ingresa el nombre' }
              ]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Apellido"
              name="lastName"
              rules={[
                { required: true, message: 'Por favor ingresa el apellido' }
              ]}
            >
              <Input placeholder="Apellido" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Roles"
              name="roles"
              rules={[
                { required: true, message: 'Por favor selecciona al menos un rol' }
              ]}
            >
              <Select 
                mode="multiple" 
                placeholder="Selecciona roles"
                allowClear
              >
                <Option value="admin">Administrador</Option>
                <Option value="user">Usuario</Option>
                <Option value="moderator">Moderador</Option>
                <Option value="editor">Editor</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              label="Estado"
              name="status"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Activo" 
                unCheckedChildren="Inactivo"
              />
            </Form.Item>
          </Col> */}
        </Row>

        {!isEditing && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: 'Por favor ingresa una contraseña' },
                  { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                ]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirmar Contraseña"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Por favor confirma la contraseña' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Las contraseñas no coinciden'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirmar contraseña" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
}