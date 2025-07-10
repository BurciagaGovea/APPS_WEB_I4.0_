import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import axios from 'axios';

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

export default function UserData() {
  const [rawData, setRawData] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/auth/users');
        setRawData(res.data.userList || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredData = rawData.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

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
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (roles: Role[]) => roles.map((r) => r.name).join(', '),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button danger size="small">Editar</Button>
          <Button danger size="small">Borrar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Search
        className="mb-4 w-60"
        placeholder="Buscar usuario..."
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
