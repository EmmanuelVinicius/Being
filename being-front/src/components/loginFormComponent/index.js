import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button } from 'antd';
import apiService from './../../sevices/apiService';

import 'antd/es/form/style/index.css';
import 'antd/es/icon/style/index.css';
import 'antd/es/input/style/index.css';
import 'antd/es/button/style/index.css';
import './style.css';

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) return <><h1>Unauthorized</h1></>;

            const result = await apiService.post('/login', values);
            if (result.status === 200) {
                console.log('token', result);
                localStorage.setItem('key', result.data.token);
                this.props.history.push("/items");
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
          </Button>
                </Form.Item>
            </Form>
        );
    }
}

const LoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

ReactDOM.render(<LoginForm />, document.getElementById('root'));

export default LoginForm;