import React from 'react';
import { Checkbox } from 'antd';
import apiService from '../sevices/apiService';


function onChange(e) {
    // apiService.patch(`/items/${e.target._id}`, { state: e.target.checked })
}

<Checkbox onChange={onChange}></Checkbox>