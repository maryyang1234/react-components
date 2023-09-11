import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import config from 'src/config';
import { inlineBlockWithVerticalMixin, sWrap, Theme } from 'src/style';
import Button from 'src/components/Button';
import SvgIcon from 'src/components/SvgIcon';
import { ButtonProps } from 'src/components/Button/Button';

import { ItemProps } from '../Item';
import { BreadcrumbProps } from '../Breadcrumb';

const { prefixCls: _prefixCls } = config;
export const prefixCls = _prefixCls + '-breadcrumb';
export const itemCls = prefixCls + '-item';
export const backBtnCls = prefixCls + '-back-btn';

const textStyleMixin = css`
    font-size: 16px;
    ${inlineBlockWithVerticalMixin};
`;

export const BackButtonWrap = sWrap<ButtonProps, HTMLButtonElement>({
    icon: <SvgIcon type="arrow-left" />,
    size: 'sm',
    styleType: 'border-gray',
    className: backBtnCls
})(styled(Button)`
    margin-right: 16px;
    padding: 0 5px;
`);

const itemStyle = (props: { theme: Theme } & ItemProps) => {
    const {
        theme: { designTokens: DT },
        disabled,
        current,
        noAction
    } = props;

    return css`
        cursor: pointer;
        text-decoration: none;

        font-weight: bold;
        ${textStyleMixin};

        ${noAction &&
        css`
            pointer-events: none;
            color: ${DT.T_COLOR_TEXT_DEFAULT_LIGHT} !important;
            cursor: default;
        `};

        ${current &&
        css`
            pointer-events: none;
            color: ${DT.TEXT_NORMAL_TITLE_COLOR} !important;
            font-weight: bold;
        `};

        ${disabled &&
        css`
            pointer-events: none;
            color: ${DT.T_COLOR_TEXT_TITLE_DARK} !important;
        `};
    `;
};

export const ItemSpan = sWrap({
    className: itemCls
})(styled.span(itemStyle));

export const ItemA = sWrap({
    className: itemCls
})(
    styled.a(props => {
        const {
            theme: { designTokens: DT }
        } = props;
        return css`
            ${itemStyle(props)};
            text-decoration: none;
            &,
            &:hover,
            &:visited,
            &:link,
            &:active {
                color: ${DT.T_COLOR_TEXT_DEFAULT_LIGHT};
            }
        `;
    })
);

export const SeparatorWrap = sWrap({})(
    styled.span(props => {
        const {
            theme: { designTokens: DT }
        } = props;

        return css`
            ${textStyleMixin};
            font-weight: bold;
            cursor: default;
            font-size: 16px;
            color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
            margin: 0 4px;
        `;
    })
);

export const BreadcrumbWrap = sWrap<Required<Pick<BreadcrumbProps, 'styleType'>>>({})(
    styled.div(props => {
        const {
            theme: { designTokens: DT },
            styleType
        } = props;

        return css`
            font-size: ${DT.T_TYPO_FONT_SIZE_4};
            color: ${DT.T_COLOR_TEXT_TITLE_DARK};
            vertical-align: baseline;

            ${{
                'block-hover': css`
                    :hover {
                        span.${itemCls} {
                            color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
                        }
                        a.${itemCls} {
                            &,
                            &:hover,
                            &:visited,
                            &:link,
                            &:active {
                                color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
                            }
                        }
                    }
                `,
                active: css`
                    span.${itemCls} {
                        color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
                    }
                    a.${itemCls} {
                        &,
                        &:hover,
                        &:visited,
                        &:link,
                        &:active {
                            color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
                        }
                    }
                `,
                hover: css`
                    span.${itemCls}, a.${itemCls} {
                        :hover {
                            color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
                        }
                    }
                `
            }[styleType]};
        `;
    })
);
