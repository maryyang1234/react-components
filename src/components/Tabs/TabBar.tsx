import React, {
    cloneElement,
    CSSProperties,
    MouseEvent,
    KeyboardEvent,
    TransitionEvent,
    Key,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
    memo,
    useCallback
} from 'react';
import classnames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';
import _ from 'lodash';

import { setTransform, isTransform3dSupported, getStyle, isVertical } from './utils';
import RefContext, { GetRef } from './RefContext';
import { Panes, TabBarPosition } from './shared';
import { prefixCls } from './style';
import SvgIcon from '../SvgIcon';

const noop = () => undefined;
const warning = (skip: boolean, msg: string) => !skip && console.warn(msg);

function getActiveIndex(panes: Panes, activeKey: Key | null) {
    for (let i = 0; i < panes.length; i++) {
        if (panes[i].key === activeKey) {
            return i;
        }
    }
    return -1;
}

interface TabBarTabsNodeProps {
    activeKey: Key | null;
    panes: Panes;
    tabBarGutter?: number;
    tabBarPosition: TabBarPosition;
    direction: string;
    onTabClick: (activeKey: Key) => void;
    handlePaneDelete?: (activeKey: string) => void;
}
const TabBarTabsNode = ({
    activeKey,
    panes,
    tabBarGutter,
    tabBarPosition,
    direction,
    onTabClick = noop,
    handlePaneDelete
}: TabBarTabsNodeProps) => {
    const { saveRef } = useContext(RefContext);
    const rst: ReactNode[] = [];

    panes.forEach((pane, index) => {
        if (!pane) return;
        const key = pane.key;
        const paneProps = pane.pane.props;
        const className = classnames({
            [`${prefixCls}-tab`]: 1,
            [`${prefixCls}-tab-active`]: activeKey === key,
            [`${prefixCls}-tab-disabled`]: paneProps.disabled
        });

        const gutter = tabBarGutter && index === panes.length - 1 ? 0 : tabBarGutter;
        const marginProperty = direction === 'rtl' ? 'marginLeft' : 'marginRight';
        const style = {
            [isVertical(tabBarPosition) ? 'marginBottom' : marginProperty]: gutter
        };
        warning('tab' in paneProps, 'There must be `tab` property on children of Tabs.');

        const node = (
            <div
                className={className}
                key={key}
                style={style}
                {...(activeKey === key ? { ref: saveRef('activeTab') } : {})}
                {...(paneProps.disabled ? {} : { onClick: onTabClick.bind(this, key) })}
            >
                {paneProps.tab}
                {!handlePaneDelete ? null : (
                    <SvgIcon
                       style={{marginLeft: "5px"}}
                        type="close"
                        size="16px"
                        onClick={(event: React.MouseEvent) => {
                            event.stopPropagation(); // 取消父级的点击事件
                            handlePaneDelete(key);
                        }}
                    />
                )}
            </div>
        );
        rst.push(node);
    });

    return <div ref={saveRef('navTabsContainer')}>{rst}</div>;
};

interface TabBarRootNodeInterface {
    className?: string;
    style?: CSSProperties;
    tabBarPosition?: TabBarPosition;
    children: ReactNode;
    extraContent?: ReactNode;
    onKeyDown?: (e: KeyboardEvent) => void;
    styleType: string;
    tabBarClassName?: string;
}
const TabBarRootNode = ({
    tabBarPosition = 'top',
    children,
    extraContent,
    onKeyDown = noop,
    styleType,
    tabBarClassName
}: TabBarRootNodeInterface) => {
    const { saveRef = () => null } = useContext(RefContext);
    const cls = classnames(
        `${prefixCls}-bar`,
        `${prefixCls}-${tabBarPosition}-bar`,
        `${prefixCls}-styletype-${styleType}-bar`,
        tabBarClassName
    );
    const topOrBottom = isVertical(tabBarPosition);
    const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    const extraContentStyle = extraContent && React.isValidElement(extraContent) ? extraContent.props.style : {};
    let newChildren = children;
    if (extraContent) {
        if (React.isValidElement(extraContent)) {
            extraContent = cloneElement(extraContent as  React.ReactElement, {
                key: 'extra',
                style: {
                    ...tabBarExtraContentStyle,
                    ...extraContentStyle
                }
            });
        }
        newChildren = topOrBottom ? (
            <>
                {extraContent}
                {children}
            </>
        ) : (
            <>
                {children}
                {extraContent}
            </>
        );
    }
    return (
        <div role="tablist" className={cls} tabIndex={0} ref={saveRef('root')} onKeyDown={onKeyDown}>
            {newChildren}
        </div>
    );
};

interface InkTabBarNodeProps {
    inkBarAnimated?: boolean;
    direction: string;
    tabBarPosition: TabBarPosition;
    styles?: {
        inkBar?: CSSProperties;
    };
    panes: Panes;
    activeKey: Key | null;
}
function scrollInkBar(props: Pick<BarContext, 'getRef' | 'direction' | 'tabBarPosition'> & { display: boolean }) {
    const { getRef, direction, tabBarPosition, display } = props;
    const rootNode = getRef('root');
    const wrapNode = getRef('nav') || rootNode;
    const inkBarNode = getRef('inkBar');
    const activeTab = getRef('activeTab');
    if (!inkBarNode || !wrapNode || !rootNode) return;
    const inkBarNodeStyle = inkBarNode.style;
    inkBarNodeStyle.display = display ? 'block' : 'none';
    if (!display) return;
    if (activeTab) {
        const tabNode = activeTab;
        const transformSupported = isTransform3dSupported(inkBarNodeStyle);
        // Reset current style
        setTransform(inkBarNodeStyle, '');
        inkBarNodeStyle.width = '';
        inkBarNodeStyle.height = '';
        inkBarNodeStyle.left = '';
        inkBarNodeStyle.top = '';
        inkBarNodeStyle.bottom = '';
        inkBarNodeStyle.right = '';

        if (isVertical(tabBarPosition)) {
            const top = tabNode.offsetTop;
            const height = tabNode.offsetHeight;
            if (transformSupported) {
                setTransform(inkBarNodeStyle, `translate3d(0,${top}px,0)`);
                inkBarNodeStyle.top = '0';
            } else {
                inkBarNodeStyle.top = `${top}px`;
            }
            inkBarNodeStyle.height = `${height}px`;
        } else {
            let left = tabNode.offsetLeft;
            let width = tabNode.offsetWidth;
            // If tabNode width equal to wrapNode width when tabBarPosition is top or bottom
            // It means no css working, then ink bar should not have width until css is loaded
            // Fix https://github.com/ant-design/ant-design/issues/7564
            if (width === rootNode.offsetWidth) {
                width = 0;
            }
            if (direction === 'rtl') {
                left = getStyle(tabNode, 'margin-left') - left;
            }
            // use 3d gpu to optimize render
            if (transformSupported) {
                setTransform(inkBarNodeStyle, `translate3d(${left}px,0,0)`);
            } else {
                inkBarNodeStyle.left = `${left}px`;
            }
            inkBarNodeStyle.width = `${width}px`;
        }
    }
}
const InkTabBarNode = ({ panes, activeKey, tabBarPosition, inkBarAnimated = true, direction }: InkTabBarNodeProps) => {
    const { saveRef, getRef } = useContext(RefContext);
    useEffect(() => {
        const activeIndex = getActiveIndex(panes, activeKey);
        scrollInkBar({
            display: activeIndex >= -1,
            getRef,
            tabBarPosition,
            direction
        });
    }, [activeKey, direction, getRef, panes, tabBarPosition]);
    const className = `${prefixCls}-ink-bar`;
    const classes = classnames(className, inkBarAnimated ? `${className}-animated` : `${className}-no-animated`);

    return <div className={classes} key="inkBar" ref={saveRef('inkBar')} />;
};

const getOffsetWH = (node: HTMLElement | null, tabBarPosition: TabBarPosition) => {
    if (!node) return 0;
    if (isVertical(tabBarPosition)) {
        return node.offsetHeight;
    }
    return node.offsetWidth;
};
const getScrollWH = (node: HTMLElement | null, tabBarPosition: TabBarPosition) => {
    if (!node) return 0;
    if (isVertical(tabBarPosition)) {
        return node.scrollHeight;
    }
    return node.scrollWidth;
};
const getOffsetLT = (node: HTMLElement | null, tabBarPosition: TabBarPosition) => {
    if (!node) return 0;
    if (isVertical(tabBarPosition)) {
        return node.offsetTop;
    }
    return node.offsetLeft;
};

interface BarContext {
    getCurrentOffset: () => number;
    setCurrentOffset: (offset: number) => void;
    currentOffset: number;
    tabBarPosition: TabBarPosition;
    direction?: string;
    getRef: GetRef;
    next: boolean;
    prev: boolean;
}
const setNavOffset = (
    offset: number,
    context: Pick<BarContext, 'getRef' | 'currentOffset' | 'tabBarPosition' | 'direction'>
) => {
    const { currentOffset, getRef, tabBarPosition, direction } = context;
    const navNode = getRef('nav');
    const navTabsContainer = getRef('navTabsContainer');
    const navNodeWH = getScrollWH(navTabsContainer || navNode, tabBarPosition);
    // Add 1px to fix `offsetWidth` with decimal in Chrome not correct handle
    // https://github.com/ant-design/ant-design/issues/13423
    const containerWH = getOffsetWH(getRef('container'), tabBarPosition) + 1;
    const navWrapNodeWH = getOffsetWH(getRef('navWrap'), tabBarPosition);
    const minOffset = containerWH - navNodeWH;
    if (offset > 0) offset = 0;
    if (minOffset >= 0) {
        offset = 0;
    } else if (minOffset >= offset) {
        const realOffset = navWrapNodeWH - navNodeWH;
        offset = realOffset;
    }
    if (currentOffset !== offset) {
        let navOffset: {
            value?: string;
            name?: 'top' | 'left';
        } = {};
        const navNode = getRef('nav');
        if (!navNode) return currentOffset;
        const navStyle = navNode.style;
        const transformSupported = isTransform3dSupported(navStyle);
        if (isVertical(tabBarPosition)) {
            if (transformSupported) {
                navOffset = {
                    value: `translate3d(0,${offset}px,0)`
                };
            } else {
                navOffset = {
                    name: 'top',
                    value: `${offset}px`
                };
            }
        } else {
            if (transformSupported) {
                if (direction === 'rtl') {
                    offset = -offset;
                }
                navOffset = {
                    value: `translate3d(${offset}px,0,0)`
                };
            } else {
                navOffset = {
                    name: 'left',
                    value: `${offset}px`
                };
            }
        }
        if (navOffset.value) {
            if (transformSupported) {
                setTransform(navStyle, navOffset.value);
            } else if (navOffset.name) {
                navStyle[navOffset.name] = navOffset.value;
            }
        }
    }
    return offset;
};
const getNextPrev = ({
    getRef,
    tabBarPosition,
    currentOffset
}: Pick<BarContext, 'getRef' | 'tabBarPosition' | 'currentOffset'>) => {
    const navNode = getRef('nav');
    const navTabsContainer = getRef('navTabsContainer');
    const navNodeWH = getScrollWH(navTabsContainer || navNode, tabBarPosition);
    // Add 1px to fix `offsetWidth` with decimal in Chrome not correct handle
    // https://github.com/ant-design/ant-design/issues/13423
    const containerWH = getOffsetWH(getRef('container'), tabBarPosition) + 1;
    const minOffset = containerWH - navNodeWH;
    let next, prev;
    if (minOffset >= 0) {
        next = false;
    } else if (minOffset < currentOffset) {
        next = true;
    } else {
        next = false;
    }

    if (currentOffset < 0) {
        prev = true;
    } else {
        prev = false;
    }

    return {
        next,
        prev
    };
};
const getOffsetOfActive = (context: {
    getRef: GetRef;
    next: boolean;
    prev: boolean;
    tabBarPosition: TabBarPosition;
    currentOffset: number;
}) => {
    const { getRef, next, prev, tabBarPosition, currentOffset } = context;
    const activeTab = getRef('activeTab');
    const navWrap = getRef('navWrap');
    if (!activeTab) return;

    // when not scrollable or enter scrollable first time, don't emit scrolling
    const needToScroll = next || prev;
    if (!needToScroll) return;

    const activeTabWH = getScrollWH(activeTab, tabBarPosition);
    const wrapWH = getOffsetWH(navWrap, tabBarPosition);
    const activeTabOffset = getOffsetLT(activeTab, tabBarPosition);
    if (-currentOffset < activeTabOffset + activeTabWH - wrapWH) {
        return -(activeTabOffset + activeTabWH - wrapWH);
    } else if (-currentOffset > activeTabOffset) {
        return -activeTabOffset;
    }
};

interface ScrollableTabBarNodeProps {
    tabBarPosition: TabBarPosition;
    scrollAnimated?: boolean;
    onPrevClick?: (e: MouseEvent) => void;
    onNextClick?: (e: MouseEvent) => void;
    prevIcon?: ReactNode;
    nextIcon?: ReactNode;
    children?: ReactNode;
    direction?: string;
    activeKey: Key | null;
}
const ScrollableTabBarNode = ({
    tabBarPosition,
    scrollAnimated = true,
    onPrevClick = noop,
    onNextClick = noop,
    prevIcon,
    nextIcon,
    children,
    direction,
    activeKey
}: ScrollableTabBarNodeProps) => {
    const offsetRef = useRef(0);
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const showNextPrev = prev || next;
    const { saveRef, getRef } = useContext(RefContext);

    // update next/prev icon
    const setNextPrev = useCallback(() => {
        const { next, prev } = getNextPrev({
            getRef,
            currentOffset: offsetRef.current,
            tabBarPosition
        });
        setNext(next);
        setPrev(prev);
    }, [getRef, tabBarPosition]);
    // set nav offset
    const setOffset = useCallback(
        (offset: number) => {
            const newOffset = setNavOffset(offset, {
                currentOffset: offsetRef.current,
                direction,
                tabBarPosition,
                getRef
            });
            offsetRef.current = newOffset;
        },
        [direction, getRef, tabBarPosition]
    );
    // scroll bar to active tab
    const scrollToActiveTab = useCallback(() => {
        const offset = getOffsetOfActive({ getRef, next, prev, tabBarPosition, currentOffset: offsetRef.current });
        if (offset != null) setOffset(offset);
    }, [getRef, next, prev, setOffset, tabBarPosition]);

    const prevTransitionEnd = useCallback(
        (e: TransitionEvent) => {
            if (e.propertyName !== 'opacity') return;
            scrollToActiveTab();
            setNextPrev();
        },
        [scrollToActiveTab, setNextPrev]
    );

    const onPrev = useCallback(
        (e: MouseEvent) => {
            onPrevClick?.(e);
            const navWrapNode = getRef('navWrap');
            const navWrapNodeWH = getOffsetWH(navWrapNode, tabBarPosition);
            setOffset(offsetRef.current + navWrapNodeWH);
            setNextPrev();
        },
        [getRef, onPrevClick, setNextPrev, setOffset, tabBarPosition]
    );
    const onNext = useCallback(
        (e: MouseEvent) => {
            onNextClick?.(e);
            const navWrapNode = getRef('navWrap');
            const navWrapNodeWH = getOffsetWH(navWrapNode, tabBarPosition);
            setOffset(offsetRef.current - navWrapNodeWH);
            setNextPrev();
        },
        [getRef, onNextClick, setNextPrev, setOffset, tabBarPosition]
    );

    // reset offset when tabBarPosition change
    useEffect(() => {
        setOffset(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabBarPosition]);
    // scroll to active when initial and activeKey changed
    useEffect(() => {
        scrollToActiveTab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, tabBarPosition]);
    useEffect(() => {
        setNextPrev();
    }, [children, setNextPrev, tabBarPosition]);
    // set next/prev when size change
    useEffect(() => {
        const debouncedResize = _.debounce(() => {
            setNextPrev();
        }, 200);
        const resizeObserver = new ResizeObserver(debouncedResize);
        const containerNode = getRef('container');
        if (containerNode) resizeObserver.observe(containerNode);
        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (debouncedResize.cancel) {
                debouncedResize.cancel();
            }
        };
    }, [getRef, setNextPrev]);

    const prevButton = (
        <span
            onClick={onPrev}
            // eslint-disable-next-line react/no-unknown-property
            unselectable="on"
            className={classnames({
                [`${prefixCls}-tab-prev`]: 1,
                [`${prefixCls}-tab-btn-disabled`]: !prev,
                [`${prefixCls}-tab-arrow-show`]: showNextPrev
            })}
            onTransitionEnd={prevTransitionEnd}
        >
            {prevIcon || <span className={`${prefixCls}-tab-prev-icon`} />}
        </span>
    );
    const nextButton = (
        <span
            onClick={onNext}
            // eslint-disable-next-line react/no-unknown-property
            unselectable="on"
            className={classnames({
                [`${prefixCls}-tab-next`]: 1,
                [`${prefixCls}-tab-btn-disabled`]: !next,
                [`${prefixCls}-tab-arrow-show`]: showNextPrev
            })}
        >
            {nextIcon || <span className={`${prefixCls}-tab-next-icon`} />}
        </span>
    );

    const navClassName = `${prefixCls}-nav`;
    const navClasses = classnames(
        navClassName,
        scrollAnimated ? `${navClassName}-animated` : `${navClassName}-no-animated`
    );

    return (
        <div
            className={classnames({
                [`${prefixCls}-nav-container`]: 1,
                [`${prefixCls}-nav-container-scrolling`]: showNextPrev
            })}
            ref={saveRef('container')}
        >
            {prevButton}
            {nextButton}
            <div className={`${prefixCls}-nav-wrap`} ref={saveRef('navWrap')}>
                <div className={`${prefixCls}-nav-scroll`}>
                    <div className={navClasses} ref={saveRef('nav')}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface TabBarProps {
    onKeyDown: (e: KeyboardEvent) => void;
    tabBarPosition: TabBarPosition;
    onTabClick: (activeKey: Key) => void;
    panes: Panes;
    activeKey: Key | null;
    direction: string;
    styleType: string;
    handlePaneDelete?: (activeKey: string) => void;
}
const TabBar = (props: TabBarProps) => {
    const refs = useRef<Record<string, HTMLElement | null>>({});
    const getRef = useCallback((name: string) => refs.current[name], []);
    const saveRef = useCallback(
        (name: string) => (node: HTMLElement | null) => {
            if (!node) return;
            refs.current[name] = node;
        },
        []
    );
    return (
        <RefContext.Provider value={{ getRef, saveRef }}>
            <TabBarRootNode {...props}>
                <ScrollableTabBarNode {...props}>
                    <TabBarTabsNode {...props} />
                    <InkTabBarNode {...props} />
                </ScrollableTabBarNode>
            </TabBarRootNode>
        </RefContext.Provider>
    );
};

export default memo(TabBar);
