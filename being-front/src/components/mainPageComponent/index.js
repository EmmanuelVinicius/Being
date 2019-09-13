import React, { Component } from 'react';
import apiService from '../../sevices/apiService';
import { Collapse } from 'antd';
import { Icon } from 'antd'

import 'antd/es/icon/style/index.css';
import 'antd/es/collapse/style/index.css';
import './style.css';

const { Panel } = Collapse;
const PRIORITY_COLOR = {
    1: "#f74d52",
    2: "#f7ee65",
    3: "#6762f5",
    4: "#e3e3e3"
}
// const genExtra = (item) => (
//     <span
//         className="priority"
//         style={PRIORITY_COLOR[item.priority]}
//     >
//     </span>
// );
const genExtra = (item) => (
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
export default class Main extends Component {

    state = {
        items: [],
    }

    async componentDidMount() {
        const result = await apiService.get(`/items?skip=0&limit=20`);
        console.log('result', result);
        this.setState({ items: result.data });
    }

    render() {
        const { items } = this.state
        return (
            <Collapse
                className="items-list"
                bordered={false}
                expandIcon={({ isActive }) => <Icon type="check-circle" theme={isActive ? "twoTone" : ""} />}
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


            // <Collapse
            //     className="items-list"
            //     style={{ border: 0 }}
            //     expandIcon={({ isActive }) => <Icon type="check-circle" theme={isActive ? "twoTone" : ""} />}
            // >
            //     {items.map(items => (
            //         <Panel
            //             header={<strong>{items.title}</strong>}
            //             showArrow={false}
            //             key={items._id}
            //             extra={genExtra(items.priority)}
            //         >

            //             <p>Priority: {items.priority}</p>
            //             <p>Date: {items.date}</p>

            //         </Panel>
            //     ))}
            // </Collapse>



            // <div className="items-list">
            //     {items.map(items => (
            //         <article key={items._id}>
            //             <Icon type="check-circle" theme="twoTone" />
            //             <strong>{items.title}</strong>

            //             <span style={PRIORITY_COLOR[items.priority]}></span>
            //         </article>
            //     ))}
            // </div>
        );
    }
}



// const customPanelStyle = {
//     background: '#f7f7f7',
//     borderRadius: 4,
//     marginBottom: 24,
//     border: 0,
//     overflow: 'hidden',
// };

// <Collapse
//     bordered={false}
//     expandIcon={({ isActive }) => <Icon type="check-circle" theme={isActive ? "twoTone" : ""} />}
// >
//     <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
//         <p>{text}</p>
//     </Panel>
// </Collapse>