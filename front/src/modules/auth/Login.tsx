// src/modules/auth/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values: LoginFormValues) => {
    // Aquí iría tu llamada real a la API...
    // Por ejemplo: api.login(values).then(...)
    // Simulamos éxito si user/pass === admin/admin
    const { username, password } = values;
    if (username === 'admin' && password === 'admin') {
      message.success('Login exitoso');
      // Rediriges a la página principal o dashboard
      navigate('/');
    } else {
      message.error('Credenciales incorrectas');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Iniciar sesión
        </Title>
        <Form
          name="login"
          layout="vertical"
          initialValues={{ username: '', password: '' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
