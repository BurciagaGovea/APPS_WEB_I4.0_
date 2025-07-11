import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Row, Col } from 'antd';

const { TextArea } = Input;

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

interface ProductModalFormProps {
  visible: boolean;
  product: Product | null;
  isEditing: boolean;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export default function ProductModalForm({ 
  visible, 
  product, 
  isEditing, 
  onSave, 
  onCancel 
}: ProductModalFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEditing && product) {
        // Llenar el formulario con los datos del producto a editar
        form.setFieldsValue({
          name: product.name,
          price: product.price,
          Qty: product.Qty,
          status: product.status,
          desc: product.desc,
        });
      } else {
        // Limpiar el formulario para nuevo producto
        form.resetFields();
        form.setFieldsValue({
          status: true, // Por defecto activo
          Qty: 1, // Cantidad por defecto
          price: 0, // Precio por defecto
        });
      }
    }
  }, [visible, product, isEditing, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const productData = {
        ...values,
        createDate: isEditing ? product?.createDate : new Date().toISOString(),
        deleteDate: null,
      };
      
      if (isEditing && product) {
        productData._id = product._id;
      }
      
      onSave(productData);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Producto' : 'Agregar Producto'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={isEditing ? 'Actualizar' : 'Agregar'}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        name="productForm"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre del Producto"
              name="name"
              rules={[
                { required: true, message: 'Por favor ingresa el nombre del producto' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
              ]}
            >
              <Input placeholder="Nombre del producto" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Precio"
              name="price"
              rules={[
                { required: true, message: 'Por favor ingresa el precio' },
                { type: 'number', min: 0, message: 'El precio debe ser mayor a 0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder="0.00"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Cantidad en Stock"
              name="Qty"
              rules={[
                { required: true, message: 'Por favor ingresa la cantidad' },
                { type: 'number', min: 0, message: 'La cantidad debe ser mayor o igual a 0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="Cantidad disponible"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Estado"
              name="status"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Activo" 
                unCheckedChildren="Inactivo"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Descripción"
              name="desc"
              rules={[
                { required: true, message: 'Por favor ingresa una descripción' },
                { min: 10, message: 'La descripción debe tener al menos 10 caracteres' }
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="Descripción detallada del producto..."
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}