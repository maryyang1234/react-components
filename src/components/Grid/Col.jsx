import React from 'react';
import PropTypes from 'prop-types';

import { ColWrap } from './style';

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const Col = ({ ...rest }) => {
    return <ColWrap {...rest} />;
};

Col.propTypes = {
    /** 栅格占位格数 */
    span: PropTypes.number,
    /** 栅格向右偏移格数，偏移占位 */
    offset: PropTypes.number,
    /** 栅格向左偏移格数，偏移不占位 */
    pull: PropTypes.number,
    /** 栅格向右偏移格数，偏移不占位 */
    push: PropTypes.number,
    /** flex布局下的order */
    order: PropTypes.number,
    /** @ignore */
    gutter: PropTypes.number,
    /** @ignore */
    className: PropTypes.string,
    /** 响应式占位格数 */
    xs: PropTypes.number,
    /** 响应式占位格数 */
    sm: PropTypes.number,
    /** 响应式占位格数 */
    md: PropTypes.number,
    /** 响应式占位格数 */
    lg: PropTypes.number,
    /** 响应式占位格数 */
    xl: PropTypes.number,
    /** 响应式占位格数 */
    xxl: PropTypes.number
};

export default Col;
