// src/modules/dashboard/Dashboard.tsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MenuDynamic from './MenuDynamic.tsx';

const { Sider, Content } = Layout;

function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220}>
        <MenuDynamic />
      </Sider>

      <Layout>
        <Header />

        <Content
          style={{
            margin: '24px 16px 0',
            padding: 24,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
}

export default Dashboard;
