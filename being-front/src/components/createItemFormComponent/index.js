import React, { Component } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col } from 'antd';

import 'antd/es/modal/style/css';
import 'antd/es/form/style/css';
import 'antd/es/input/style/css';
import 'antd/es/select/style/css';
import 'antd/es/date-picker/style/css';
import 'antd/es/row/style/css';
import 'antd/es/col/style/css';

const { Option } = Select;

class CreateItemForm extends Component {
    render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Create a new Item"
                okText="Create"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <Form.Item label="Title">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input the title of the item!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Row>
                        <Col span="8">
                            <Form.Item label="Priority">
                                {getFieldDecorator('priority', {
                                    rules: [{ required: false, message: 'Please input the priority of the item!' }],
                                })(
                                    <Select
                                        style={{ width: 200 }}
                                        placeholder="Select (Default 4)"
                                    >
                                        <Option value="1">1 (High)</Option>
                                        <Option value="2">2 (Mid)</Option>
                                        <Option value="3">3 (Low)</Option>
                                        <Option value="4">4 (None)</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span="8" offset="6">
                            <Form.Item label="Schedule to">
                                {getFieldDecorator('dateTime', {
                                    rules: [{ required: false, message: 'Please input the schedule of the item!' }],
                                })(
                                    <DatePicker style={{ width: 200 }} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
// const LoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
const createItemForm = Form.create({ name: 'form_in_modal' })(CreateItemForm)

// ReactDOM.render(<LoginForm />, document.getElementById('root'));

export default createItemForm;