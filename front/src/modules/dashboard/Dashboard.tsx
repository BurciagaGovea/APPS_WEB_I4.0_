// src/modules/dashboard/Dashboard.tsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MenuDynamic from '../MenuDynamic';

const { Header, Sider, Content, Footer } = Layout;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220}>
        <MenuDynamic />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <h3 style={{ margin: 0 }}>Mi App</h3>
        </Header>

        <Content
          style={{
            margin: '24px 16px 0',
            padding: 24,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          ©2025 Mi Empresa
        </Footer>
      </Layout>
    </Layout>
  );
}
