import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Button, Table, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

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

interface OrderModalFormProps {
  visible: boolean;
  order: Order | null;
  isEditing: boolean;
  onSave: (orderData: any) => void;
  onCancel: () => void;
}

export default function OrderModalForm({ 
  visible, 
  order, 
  isEditing, 
  onSave, 
  onCancel 
}: OrderModalFormProps) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<ProductInOrder[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (visible) {
      if (isEditing && order) {
        form.setFieldsValue({
          idUser: order.idUser,
          status: order.status,
        });
        setProducts(order.products);
        setSubtotal(order.subtotal);
        setTotal(order.total);
      } else {
        form.resetFields();
        setProducts([]);
        setSubtotal(0);
        setTotal(0);
        form.setFieldsValue({
          status: 'Pendiente',
        });
      }
    }
  }, [visible, order, isEditing, form]);

  useEffect(() => {
    calculateTotals();
  }, [products]);

  const calculateTotals = () => {
    const newSubtotal = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    const tax = newSubtotal * 0.16; // 16% de impuesto
    const newTotal = newSubtotal + tax;
    
    setSubtotal(newSubtotal);
    setTotal(newTotal);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (products.length === 0) {
        message.error('Debe agregar al menos un producto a la orden');
        return;
      }

      // Validar que todos los productos tengan datos completos
      const incompleteProducts = products.filter(p => !p.productId || p.quantity <= 0 || p.price <= 0);
      if (incompleteProducts.length > 0) {
        message.error('Todos los productos deben tener ID, cantidad y precio válidos');
        return;
      }

      const orderData = {
        idUser: values.idUser,
        products: products,
        subtotal: subtotal,
        total: total,
        status: values.status,
        Date: isEditing ? order?.Date : new Date().toISOString(),
      };
      
      if (isEditing && order) {
        orderData._id = order._id;
      }
      
      onSave(orderData);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setProducts([]);
    setSubtotal(0);
    setTotal(0);
    onCancel();
  };

  const addProduct = () => {
    const newProduct: ProductInOrder = {
      productId: '',
      quantity: 1,
      price: 0
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const updateProduct = (index: number, field: keyof ProductInOrder, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const productColumns = [
    {
      title: 'ID Producto',
      dataIndex: 'productId',
      key: 'productId',
      render: (value: string, record: ProductInOrder, index: number) => (
        <Input
          value={value}
          onChange={(e) => updateProduct(index, 'productId', e.target.value)}
          placeholder="ID del producto"
        />
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number, record: ProductInOrder, index: number) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(val) => updateProduct(index, 'quantity', val || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (value: number, record: ProductInOrder, index: number) => (
        <InputNumber
          min={0}
          precision={2}
          value={value}
          onChange={(val) => updateProduct(index, 'price', val || 0)}
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (record: ProductInOrder) => `$${(record.quantity * record.price).toFixed(2)}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: ProductInOrder, index: number) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => removeProduct(index)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={isEditing ? 'Editar Orden' : 'Agregar Orden'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      okText={isEditing ? 'Actualizar' : 'Agregar'}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        name="orderForm"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="ID Usuario"
              name="idUser"
              rules={[
                { required: true, message: 'Por favor ingresa el ID del usuario' }
              ]}
            >
              <Input placeholder="ID del usuario" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Estado"
              name="status"
              rules={[
                { required: true, message: 'Por favor selecciona el estado' }
              ]}
            >
              <Select placeholder="Selecciona el estado">
                <Option value="Pendiente">Pendiente</Option>
                <Option value="En proceso">En proceso</Option>
                <Option value="Completado">Completado</Option>
                <Option value="Cancelado">Cancelado</Option>
                <Option value="Pagado">Pagado</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4>Productos</h4>
            <Button 
              type="dashed" 
              onClick={addProduct}
              icon={<PlusOutlined />}
            >
              Agregar Producto
            </Button>
          </div>
          
          <Table
            columns={productColumns}
            dataSource={products}
            rowKey={(record, index) => index?.toString() || '0'}
            pagination={false}
            size="small"
          />
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <div className="text-right">
              <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-right">
              <strong>IVA (16%): ${(subtotal * 0.16).toFixed(2)}</strong>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-right">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}