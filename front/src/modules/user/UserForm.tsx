import { Form, Input, Button } from "antd";
import React from "react";

function UserForm() {
    const [form] = Form.useForm();
    const title = "User Form";

    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log("Form values:", values);
        }).catch(errorInfo => {
            console.log("Validation Failed:", errorInfo);
        });
    }

    return (
        <>
            <div><h1>{title}</h1></div>
            <Form
                form={form}
                name="user-form"
                layout="vertical"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="Horizontal" name="horizontal" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Vertical" name="vertical" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default UserForm;


/*
* 1.-CRUD completo de productos
* (create, delete(stattus)m update y getAll)
* 2.-Modificar modelo de usuario para recibir arreglo de roles
* martes 17 junio

*/