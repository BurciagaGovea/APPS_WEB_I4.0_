import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import OrderModalForm from './OrderModalForm';

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
  const [visible, setVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3002/api/auth/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      message.error('Error al cargar órdenes');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.idUser.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingOrder(null);
    setIsEditing(false);
    setVisible(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditing(true);
    setVisible(true);
  };

  const handleDelete = async (orderId: string) => {
    try {
      // Aquí iría la lógica de eliminación cuando tengas el endpoint
      console.log('Eliminar orden:', orderId);
      message.success('Orden eliminada correctamente');
      // fetchOrders(); // Recargar la lista después de eliminar
    } catch (error) {
      message.error('Error al eliminar orden');
    }
  };

  const handleSave = async (orderData: any) => {
    try {
      if (isEditing && editingOrder) {
        // Editar orden existente
        const response = await axios.put(
          `http://localhost:3002/api/auth/orders/${editingOrder._id}`,
          {
            idUser: orderData.idUser,
            products: orderData.products,
            status: orderData.status
          }
        );
        
        if (response.status === 200) {
          message.success('Orden actualizada correctamente');
          setVisible(false);
          fetchOrders(); // Recargar la lista
        }
      } else {
        // Crear nueva orden
        const response = await axios.post(
          'http://localhost:3002/api/auth/orders',
          {
            idUser: orderData.idUser,
            products: orderData.products
          }
        );
        
        if (response.status === 201) {
          message.success('Orden creada correctamente');
          setVisible(false);
          fetchOrders(); // Recargar la lista
        }
      }
    } catch (error: any) {
      console.error('Error al guardar orden:', error);
      
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(isEditing ? 'Error al actualizar orden' : 'Error al crear orden');
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingOrder(null);
  };

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
        <Tag color={status === 'Pendiente' ? 'orange' : status === 'Completado' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (products: ProductInOrder[]) => `${products.length} producto(s)`,
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
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => handleDelete(record._id)}
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
          placeholder="Buscar por ID de usuario..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Agregar Orden
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <OrderModalForm
        visible={visible}
        order={editingOrder}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}