// src/modules/order/OrderList.tsx
import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';

interface Order {
  id: number;
  product: string;
  quantity: number;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fake: Order[] = [
      { id: 1001, product: 'Laptop',     quantity: 1, total: 1200, status: 'Pending'   },
      { id: 1002, product: 'Smartphone', quantity: 2, total: 1600, status: 'Completed' },
      { id: 1003, product: 'Café Molido',quantity: 5, total:   75, status: 'Cancelled' },
    ];
    setTimeout(() => setOrders(fake), 500);
  }, []);

  const columns = [
    { title: 'ID Orden',    dataIndex: 'id',       key: 'id' },
    { title: 'Producto',    dataIndex: 'product',  key: 'product' },
    { title: 'Cantidad',    dataIndex: 'quantity', key: 'quantity' },
    { title: 'Total',       dataIndex: 'total',    key: 'total',    render: (t: number) => `$${t}` },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (s: Order['status']) => {
        let color = s === 'Completed' ? 'green' : s === 'Pending' ? 'orange' : 'red';
        return <Tag color={color}>{s}</Tag>;
      }
    },
  ];

  return (
    <div>
      <h2>Listado de Órdenes</h2>
      <Table<Order>
        rowKey="id"
        dataSource={orders}
        columns={columns}
        loading={!orders.length}
        pagination={false}
      />
    </div>
  );
}
