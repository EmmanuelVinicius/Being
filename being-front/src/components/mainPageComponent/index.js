import React, { Component } from 'react';
import { Collapse, Icon, Col, Row } from 'antd';
import apiService from '../../sevices/apiService';
import CreateItemButton from '../createItemButtonComponent';

import 'antd/es/icon/style/css';
import 'antd/es/collapse/style/css';
import 'antd/es/col/style/css';
import 'antd/es/row/style/css';
import './style.css';

const { Panel } = Collapse;
const PRIORITY_COLOR = {
    1: "#f74d52",
    2: "#f7ee65",
    3: "#6762f5",
    4: "#e3e3e3"
};
const genExtra = item => (
    <Icon
        type="flag"
        theme="twoTone"
        twoToneColor={PRIORITY_COLOR[item]}
        onClick={event => {
            event.stopPropagation();
        }}
    />
);
const completeIcon = item => (
    <Icon
        type="check-circle"
        style={{ fontSize: '18px' }}
        onClick={async event => {
            event.stopPropagation();
            const result = await apiService.patch(`/items/${item.panelKey}`, { status: 0 });

            await loadItems(1);
        }}
    />
);
const loadItems = async status => {
    const result = await apiService.get(`/items?status=${status}`);
    console.log('result', result);
    return { items: result.data }
}
const editItem = () => {
    
}
export default class Main extends Component {

    state = {
        items: [],
        active: true
    }


    async componentDidMount() {
        this.setState(await loadItems(1));
    }

    render() {
        const { items } = this.state

        return (
            <div className="items-list">
                <Collapse
                    bordered={false}
                    expandIcon={completeIcon}
                >
                    {items.map(items => (
                        <Panel
                            header={<strong>{items.title}</strong>}
                            key={items._id}
                            extra={genExtra(items.priority)}
                        >
                            <Row>
                                <Col span="8">
                                    <p>Owner: <b>{items.owner}</b></p>
                                </Col>
                                <Col span="8" offset="6">
                                    <p>Priority: <b>{items.priority}</b></p>
                                </Col>
                                <p>Created at: <b>{items.insertedAt}</b></p>
                            </Row>
                            <CreateItemButton icon="edit" type="link" item={items}/>
                        </Panel>
                    ))}
                </Collapse >

                <CreateItemButton />
            </div >
        );
    }
}