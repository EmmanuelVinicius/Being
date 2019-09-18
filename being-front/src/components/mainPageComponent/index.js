import React, { Component } from 'react';
import { Collapse, Icon } from 'antd';
import apiService from '../../sevices/apiService';
import CreateItemButton from '../createItemButtonComponent';

import 'antd/es/icon/style/css';
import 'antd/es/collapse/style/css';
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
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}
    />
);
const completeIcon = item => (
    <Icon
        type="check-circle"
        style={{ fontSize: '18px' }}
        onClick={async event => {
            console.log('item', item);
            event.stopPropagation();
            apiService.patch(`/items/${item.panelKey}`, { status: 1 })
            await loadItems();
            //window.location.reload();
        }}
    />
);
const loadItems = async () => {
    const result = await apiService.get(`/items?status=0`);
    return { items: result.data }
}
export default class Main extends Component {

    state = {
        items: [],
        active: true
    }


    async componentDidMount() {
        this.setState(await loadItems());
    }

    render() {
        const { items } = this.state
        return (
            <>
                <Collapse
                    className="items-list"
                    bordered={false}
                    expandIcon={completeIcon}
                >
                    {items.map(items => (
                        <Panel
                            header={<strong>{items.title}</strong>}
                            key={items._id}
                            extra={genExtra(items.priority)}
                        >
                            <p>Priority: {items.priority}</p>
                            <p>Date: {items.date}</p>
                        </Panel>
                    ))}
                </Collapse >

                <CreateItemButton />
            </>
        );
    }
}