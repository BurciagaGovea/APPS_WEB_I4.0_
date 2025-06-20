// src/modules/dashboard/MenuDynamic.tsx
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

type IconName = 'DashboardOutlined' | 'UserOutlined' | 'BarChartOutlined';

interface MenuItemData {
  title: string;
  path: string;
  icon: IconName;
  roles: string[];
}

const Icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined
};

export default function MenuDynamic() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fakeMenuData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: "DashboardOutlined",
        roles: ["665a1f2b40fd3a12b3e77611"]
    },
    {
        title: "Usuarios",
        path: "/users",
        icon: "UserOutlined",
        roles: ["665a1f2b40fd3a12b3e77612"]
    },
    {
        title: "Reportes",
        path: "/reports",
        icon: "BarChartOutlined",
        roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"]
    }
];

  useEffect(() => {
    // Simula carga de datos
    const t = setTimeout(() => {
      setMenuItems(fakeMenuData);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const renderMenuItems = () =>
    menuItems.map(item => {
      const IconComp = Icons[item.icon];
      return {
        key: item.path,
        icon: IconComp ? <IconComp /> : null,
        label: item.title
      };
    });

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={renderMenuItems()}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
}
