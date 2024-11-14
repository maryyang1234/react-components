import React, { ReactNode, useContext, useMemo } from 'react';

import SelectContext from './SelectContext';
import { OptionWrap } from './style';
import { Key } from 'src/hooks/group';

export interface OptionProps {
    /** 值，会被用作 key */
    value?: Key;
    /** 是否禁用 */
    disabled?: boolean;
    /**
     * tooltip 提示，可以为文本或 node，也可以是 tooltip 的 props object
     */
    tooltip?: ReactNode | any;
    /** @ignore */
    children?: ReactNode;
    /**
     * @ignore
     * @description 内部使用，请勿使用
     */
    label?: ReactNode;
}

const Option = ({ value, children, ...rest }: OptionProps) => {
    const { handleSearch, searchValue } = useContext(SelectContext);
    const visible = useMemo(
        () =>
            handleSearch(value as Key, {
                value,
                children
            }),
        // change when searchValue change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [children, handleSearch, value, searchValue]
    );
    return (
        <OptionWrap hidden={!visible} {...rest} itemKey={value}>
            {children}
        </OptionWrap>
    );
};

Option.isMenuItem = true;

export const PureOption = ({ value, label, children, ...rest }: OptionProps) => {
    return (
        <OptionWrap {...rest} itemKey={value}>
            {children}
        </OptionWrap>
    );
};

export default Option;
