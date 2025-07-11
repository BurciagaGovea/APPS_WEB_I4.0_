import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import UserModalForm from './UserModalForm';

const { Search } = Input;

interface Role {
  type: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  status: boolean;
  role: Role[];
  firstName: string;
  lastName: string;
}

export default function UserForm() {
  const [rawData, setRawData] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/auth/users');
      setRawData(res.data.userList || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error al cargar usuarios');
    }
  };

  const filteredData = rawData.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setIsEditing(false);
    setVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
    setVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      // Aquí iría la lógica de eliminación cuando conectes con el backend
      console.log('Eliminar usuario:', userId);
      message.success('Usuario eliminado correctamente');
      // fetchUsers(); // Recargar la lista después de eliminar
    } catch (error) {
      message.error('Error al eliminar usuario');
    }
  };

  const handleSave = async (userData: any) => {
    try {
      if (isEditing) {
        // Lógica para editar usuario
        console.log('Editando usuario:', userData);
        message.success('Usuario actualizado correctamente');
      } else {
        // Lógica para agregar nuevo usuario
        console.log('Agregando nuevo usuario:', userData);
        message.success('Usuario agregado correctamente');
      }
      setVisible(false);
      // fetchUsers(); // Recargar la lista después de guardar
    } catch (error) {
      message.error('Error al guardar usuario');
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Nombre Completo',
      key: 'fullName',
      render: (record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (roles: Role[]) => roles.map((r) => r.name).join(', '),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Activo' : 'Inactivo'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: User) => (
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
          placeholder="Buscar usuario..."
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Agregar Usuario
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <UserModalForm
        visible={visible}
        user={editingUser}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}