import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Search } = Input;

interface Product {
  _id: string;
  name: string;
  price: number;
  Qty: number;
  status: boolean;
  desc: string;
  deleteDate: string | null;
  createDate: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3003/api/auth/product');
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Cantidad',
      dataIndex: 'Qty',
      key: 'Qty',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) =>
        status ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
    },
    {
      title: 'Descripción',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Product) => (
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
        placeholder="Buscar producto..."
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
