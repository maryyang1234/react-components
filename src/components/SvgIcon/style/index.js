import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { spinMixin, inlineBlockWithVerticalMixin } from 'src/style';
import withProps from 'src/utils/withProps';

export const SvgIconWrapper = withProps({})(
    styled('svg')(props => {
        const {
            color,
            size,
            spin,
            theme: { designTokens: DT }
        } = props;

        const _size = size || DT.T_TYPO_FONT_SIZE_1;

        return css`
            transition: all 0.3s;

            ${inlineBlockWithVerticalMixin};

            fill: currentcolor;

            ${color &&
            css`
                fill: ${color};
            `};

            ${css`
                width: ${_size};
                height: ${_size};
            `};
            ${spin && spinMixin};
        `;
    })
);
