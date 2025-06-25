// src/modules/dashboard/MenuDynamic.tsx
import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import routes from '../core/menuRoutes'; // ajusta la ruta si la tienes diferente

// Importa aquí todos los íconos que uses en menuRoutes.tsx
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  SettingOutlined
} from '@ant-design/icons';

// Mapa de nombre de ícono → componente
const IconsMap = {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  SettingOutlined
};

export default function MenuDynamic() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Genera los items del menú a partir de menuRoutes
  const items = routes
    .filter(route => !route.hidden)         // excluye las rutas ocultas
    .map(route => {
      const IconComp = IconsMap[route.icon as keyof typeof IconsMap];
      return {
        key: route.path,
        icon: IconComp ? <IconComp /> : null,
        label: route.label ?? route.path
      };
    });

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
}
