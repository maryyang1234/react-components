import styled from '@emotion/styled';
import { css } from '@emotion/core';

import config from 'src/config';
import { clearFixMixin, sWrap } from 'src/style';

import { TabsProps } from '../Tabs';

const { prefixCls: _prefixCls } = config;
export const prefixCls = _prefixCls + '-tabs';

/* stylelint-disable no-descending-specificity */
export const SWrap = sWrap<Required<Pick<TabsProps, 'size' | 'tabBarPosition' | 'styleType'>>>({
  className: ({ styleType }) => `${prefixCls}-styletype-${styleType}`
})(
  styled.div(props => {
    const {
      theme: { designTokens: DT },
      tabBarPosition,
      styleType,
      size
    } = props;

    const padding = {
      sm: DT.TAB_PANEL_PADDING_SM,
      md: DT.TAB_PANEL_PADDING_MD,
      lg: DT.TAB_PANEL_PADDING_LG
    }[size];
    const lineHeight = {
      sm: DT.TAB_PANEL_LINEHEIGHT_SM,
      md: DT.TAB_PANEL_LINEHEIGHT_MD,
      lg: DT.TAB_PANEL_LINEHEIGHT_LG
    }[size];
    const fontSize = {
      sm: DT.TAB_PANEL_FONTSIZE_SM,
      md: DT.TAB_PANEL_FONTSIZE_MD,
      lg: DT.TAB_PANEL_FONTSIZE_LG
    }[size];
    const fontWeight = {
      sm: 'normal',
      md: 'normal',
      lg: 'bold'
    }[size];

    return css`
      overflow: hidden;
      ${clearFixMixin};

      .${prefixCls} {
        &-bar {
          outline: none;
          position: relative;
        }
        &-tabpane {
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          box-sizing: border-box;
          &-inactive {
            display: none;
          }
        }
        &-tab {
          color: ${DT.T_COLOR_TEXT_REMARK_LIGHT};
          border: 1px solid transparent;
          border-radius: 2px 2px 0 0;
          box-sizing: border-box;
          cursor: pointer;
          margin-right: 30px;
          ${css`
            padding: ${padding};
            font-size: ${fontSize};
            font-weight: ${fontWeight};
          `}
        }
        &-nav {
          display: inline-block;
          white-space: nowrap;
          position: relative;
        }
        &-nav-animated {
          transition: transform 0.2s cubic-bezier(0.35, 0, 0.25, 1);
        }
        &-nav-wrap {
          height: 100%;
        }
        &-nav-container {
          position: relative;
          height: 100%;
          box-sizing: border-box;
          background: ${DT.T_COLOR_BG_DEFAULT_BRIGHT};
          box-shadow: 0px 0px 4px 0px rgba(62, 89, 184, 0.21);
          border-radius: ${DT.T_CORNER_LG};
          padding-left: 18px;
        }
        &-tab-prev,
        &-tab-next {
          display: none;
          position: absolute;
          font-size: 16px;
          line-height: 20px;
          height: 20px;
          width: 20px;
          text-align: center;
          cursor: pointer;
          fill: currentcolor;
        }
        &-tab-btn-disabled {
          pointer-events: none;
          color: ${DT.T_COLOR_TEXT_DISABLED};
        }

        &-tab-prev.${prefixCls}-tab-arrow-show, &-tab-next.${prefixCls}-tab-arrow-show {
          display: inline-block;
        }

        &-tab-disabled,
        &-tab-disabled:hover {
          cursor: default;
          color: ${DT.T_COLOR_TEXT_DISABLED};
        }

        &-styletype-default-bar {
          .${prefixCls} {
            &-ink-bar {
              width: 2px;
              height: 2px;
              position: absolute;
              transition: transform 0.3s ease-out 0s;
              background: ${DT.T_COLOR_LINE_PRIMARY_DEFAULT};
            }
            &-tab:hover {
              color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
            }
            &-tab-disabled:hover {
              background: none;
              border-color: transparent;
            }
            &-tab-active,
            &-tab-active:hover {
              color: ${DT.T_BUTTON_PRIMARY_COLOR_BG_DEFAULT};
              font-weight: 500;
            }
          }
        }

        &-styletype-ink-bar {
          .${prefixCls} {
            &-nav-container {
              box-shadow: none;
              padding-left: 0;
            }
            &-ink-bar {
              width: 2px;
              height: 2px;
              position: absolute;
              transition: transform 0.3s ease-out 0s;
              background: ${DT.T_COLOR_LINE_PRIMARY_DEFAULT};
              z-index: 2;
            }
            &-tab {
              border: 1px solid transparent !important;
            }
            &-nav {
              background: none;
              box-shadow: none;
            }
            &-tab:hover {
              color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
            }
            &-tab-disabled:hover {
              color: ${DT.T_COLOR_TEXT_DISABLED};
            }
            &-tab-active,
            &-tab-active:hover {
              color: ${DT.T_COLOR_TEXT_PRIMARY_DEFAULT};
            }
          }
        }

        &-styletype-pure-bar {
          .${prefixCls} {
            &-ink-bar {
              display: none !important;
            }
          }
          .${prefixCls}-tab {
            border: none;
            border-radius: 0;
            padding: 0;
            line-height: normal;
          }
        }
      }

      &.${prefixCls} {
        ${tabBarPosition === 'top' &&
        css`
          .${prefixCls}-top-bar {
            .${prefixCls} {
              &-tab {
                display: inline-block;

                &:hover {
                }
                &-disabled:hover {
                  border-bottom-color: transparent;
                }
                &-active,
                &-active:hover {
                }
              }
              &-ink-bar {
                bottom: 0;
              }
            }
          }
          .${prefixCls}-top-content {
            width: 100%;
          }
        `}

        ${tabBarPosition === 'bottom' &&
        css`
          .${prefixCls}-bottom-bar {
            ::before {
              content: ' ';
              position: absolute;
              top: 0;
              width: 100%;
              height: 1px;
              background: ${DT.T_COLOR_LINE_DEFAULT_DARK};
              z-index: 0;
            }
            .${prefixCls} {
              &-tab {
                display: inline-block;

                &:hover {
                  border-top-color: ${DT.T_TABS_DEFAULT_COLOR_BG_HOVER};
                }
                &-disabled:hover {
                  border-top-color: transparent;
                }
                &-active,
                &-active:hover {
                  border-top-color: ${DT.T_TABS_DEFAULT_COLOR_BG_DEFAULT};
                }
              }
              &-ink-bar {
                top: 0;
              }
            }
          }
          .${prefixCls}-bottom-content {
            width: 100%;
          }
        `}

    ${tabBarPosition === 'left' &&
        css`
          .${prefixCls}-left-bar {
            float: left;
            height: 100%;
            ::before {
              content: ' ';
              position: absolute;
              right: 0;
              height: 100%;
              width: 1px;
              background: ${DT.T_COLOR_LINE_DEFAULT_DARK};
              z-index: 0;
            }
            .${prefixCls} {
              &-tab {
                &:hover {
                  border-right-color: ${DT.T_TABS_DEFAULT_COLOR_BG_HOVER};
                }
                &-disabled:hover {
                  border-right-color: transparent;
                }
                &-active,
                &-active:hover {
                  border-right-color: ${DT.T_TABS_DEFAULT_COLOR_BG_DEFAULT};
                }
                text-align: right;
                padding-left: 12px;
              }

              &-ink-bar {
                right: 0;
              }
            }
          }
          .${prefixCls}-left-content {
            overflow: hidden;
            height: 100%;
          }
        `}

    ${tabBarPosition === 'right' &&
        css`
          .${prefixCls}-right-bar {
            float: right;
            height: 100%;
            ::before {
              content: ' ';
              position: absolute;
              left: 0;
              height: 100%;
              width: 1px;
              background: ${DT.T_COLOR_LINE_DEFAULT_DARK};
              z-index: 0;
            }
            .${prefixCls} {
              &-tab {
                &:hover {
                  border-left-color: ${DT.T_TABS_DEFAULT_COLOR_BG_HOVER};
                }
                &-disabled:hover {
                  border-left-color: transparent;
                }
                &-active,
                &-active:hover {
                  border-left-color: ${DT.T_TABS_DEFAULT_COLOR_BG_DEFAULT};
                }
              }
              &-ink-bar {
                left: 0;
              }
            }
          }
          .${prefixCls}-right-content {
            overflow: hidden;
            height: 100%;
          }
        `}
    ${(tabBarPosition === 'top' || tabBarPosition === 'bottom') &&
        css`
          .${prefixCls}-top-bar, .${prefixCls}-bottom-bar {
            .${prefixCls}-nav {
              height: ${DT.TAB_PANEL_TITLE_HEIGHT};
            }
            .${prefixCls}-nav-scroll {
              width: 100%;
            }
            .${prefixCls}-nav-container-scrolling {
              padding: 0 32px;
            }
            .${prefixCls}-tab-prev {
              left: 0;
            }
            .${prefixCls}-tab-next {
              right: 0;
            }
            .${prefixCls}-tab-prev, .${prefixCls}-tab-next {
              top: 50%;
              margin-top: -10px;
            }
            .${prefixCls}-tab-prev-icon:before {
              content: '\\2039';
            }
            .${prefixCls}-tab-next-icon:before {
              content: '\\203A';
            }
          }
        `}
    ${(tabBarPosition === 'left' || tabBarPosition === 'right') &&
        css`
          .${prefixCls}-left-bar, .${prefixCls}-right-bar {
            .${prefixCls}-nav-scroll {
              height: 100%;
            }
            .${prefixCls}-nav-container-scrolling {
              padding: 28px 0;
            }
            .${prefixCls}-tab-prev {
              top: 0;
            }
            .${prefixCls}-tab-next {
              bottom: 0;
            }
            .${prefixCls}-tab-prev, .${prefixCls}-tab-next {
              left: 50%;
              margin-left: -10px;
              transform: rotate(90deg);
            }
            .${prefixCls}-tab-prev-icon:before {
              content: '\\2039';
            }
            .${prefixCls}-tab-next-icon:before {
              content: '\\203A';
            }
          }
        `}
      }
      ${styleType === 'ink' &&
      css`
        > .${prefixCls}-top-bar, > .${prefixCls}-bottom-bar {
          .${prefixCls}-tab+.${prefixCls}-tab {
            margin-left: 12px;
          }
        }
        > .${prefixCls}-left-bar, > .${prefixCls}-right-bar {
          .${prefixCls}-tab+.${prefixCls}-tab {
            margin-top: 8px;
          }
        }
      `}
      ${styleType === 'ink' &&
      tabBarPosition === 'top' &&
      css`
        .${prefixCls}-top-bar {
          ::before {
            content: ' ';
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 1px;
            background: ${DT.T_COLOR_LINE_DEFAULT_DARK};
            z-index: 1;
          }
        }
      `};
    `;
  })
);
