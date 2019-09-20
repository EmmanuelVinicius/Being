import React, { Component } from 'react';
import { Button } from 'antd';
import CreateItemForm from './../createItemFormComponent';
import apiService from '../../sevices/apiService';

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
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await apiService.post('/items', {
                title: values.title,
                owner: 'Emmanuel',
                priority: values.priority,
                dateTime: () => new Date(values.dateTime)
            });
            window.location.reload();

            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const { icon, type, item } = this.props;
        return (
            <>
                <Button
                    type="primary"
                    shape="circle"
                    icon={icon ? icon : "plus"}
                    type={type ? type : "primary"}
                    size="large"
                    style={{ float: 'right', position: 'bottom' }}
                    onClick={this.showModal} />

                <CreateItemForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    values={item}
                />
            </>
        );
    }
}