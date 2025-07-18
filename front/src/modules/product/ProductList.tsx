import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import ProductModalForm from './ProductModalForm';

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
  const [visible, setVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3010/api/auth/product');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Error al cargar productos');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingProduct(null);
    setIsEditing(false);
    setVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setVisible(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      // Aquí iría la lógica de eliminación cuando conectes con el backend
      console.log('Eliminar producto:', productId);
      message.success('Producto eliminado correctamente');
      // fetchProducts(); // Recargar la lista después de eliminar
    } catch (error) {
      message.error('Error al eliminar producto');
    }
  };

  const handleSave = async (productData: any) => {
    setLoading(true);
    try {
      if (isEditing && editingProduct) {
        // Lógica para editar producto
        const updateData = {
          name: productData.name,
          price: productData.price,
          Qty: productData.Qty,
          desc: productData.desc
        };

        const response = await axios.put(
          `http://localhost:3010/api/auth/product/${editingProduct._id}`,
          updateData
        );

        if (response.data.product) {
          message.success('Producto actualizado correctamente');
          setVisible(false);
          fetchProducts(); // Recargar la lista después de actualizar
        }
      } else {
        // Lógica para agregar nuevo producto
        const createData = {
          name: productData.name,
          price: productData.price,
          Qty: productData.Qty,
          desc: productData.desc,
          status: productData.status || true
        };

        // Aquí necesitarías la ruta para crear producto
        const response = await axios.post(
          'http://localhost:3010/api/auth/product',
          createData
        );

        message.success('Producto agregado correctamente');
        setVisible(false);
        fetchProducts(); // Recargar la lista después de agregar
      }
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      
      if (error.response?.status === 404) {
        message.error('Producto no encontrado');
      } else {
        message.error(error.response?.data?.message || 'Error al guardar producto');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingProduct(null);
  };

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
      render: (desc: string) => desc.length > 50 ? `${desc.substring(0, 50)}...` : desc,
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
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleEdit(record)}
            loading={loading}
          >
            Editar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleDelete(record._id)}
            loading={loading}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Search
          className="w-60"
          placeholder="Buscar producto..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
          loading={loading}
        >
          Agregar Producto
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      <ProductModalForm
        visible={visible}
        product={editingProduct}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}