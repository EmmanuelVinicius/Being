import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import CreateItemForm from './../createItemFormComponent';
import apiService from '../../sevices/apiService';
import moment from 'moment';

export default class CreateItemButton extends Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            values.dateTime = moment().format();
            apiService.post('/items', { title: values.title, owner: 'Emmanuel', priority: values.priority, dateTime: values.dateTime })
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        return (
            <>
                <Button type="primary" onClick={this.showModal}>
                    <Icon type="plus" />
                </Button>
                <CreateItemForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </>
        );
    }
}