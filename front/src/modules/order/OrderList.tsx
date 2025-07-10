import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Search } = Input;

interface ProductInOrder {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  idUser: string;
  status: string;
  products: ProductInOrder[];
  subtotal: number;
  total: number;
  Date: string;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:3002/api/auth/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.idUser.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'idUser',
      key: 'idUser',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Pendiente' ? 'orange' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'Date',
      key: 'Date',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button danger size="small">Editar</Button>
          <Button danger size="small">Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Search
        className="mb-4 w-60"
        placeholder="Buscar por ID de usuario..."
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
