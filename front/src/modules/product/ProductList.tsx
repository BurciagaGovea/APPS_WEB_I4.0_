// src/modules/product/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fake: Product[] = [
      { id: 1, name: 'Laptop', price: 1200, category: 'Electrónica' },
      { id: 2, name: 'Smartphone', price: 800, category: 'Electrónica' },
      { id: 3, name: 'Café Molido', price: 15, category: 'Alimentos' },
    ];
    setTimeout(() => setProducts(fake), 500);
  }, []);

  const columns = [
    { title: 'ID',        dataIndex: 'id',        key: 'id' },
    { title: 'Nombre',    dataIndex: 'name',      key: 'name' },
    { title: 'Precio',    dataIndex: 'price',     key: 'price', render: (p: number) => `$${p}` },
    { title: 'Categoría', dataIndex: 'category',  key: 'category' },
  ];

  return (
    <div>
      <h2>Listado de Productos</h2>
      <Table<Product>
        rowKey="id"
        dataSource={products}
        columns={columns}
        loading={!products.length}
        pagination={false}
      />
    </div>
  );
}
