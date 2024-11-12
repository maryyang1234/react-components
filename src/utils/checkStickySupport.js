let supportSticky = null;

const checkStickySupport = () => {
    let support = false;
    if (typeof document === 'undefined') {
        return support;
    }
    const testDOM = typeof document !== 'undefined' ? document.createElement('div') : null;
    const style = testDOM.style;
    const prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];


    for (let i = 0; i < prefix.length; i += 1) {
        const stickyName = `${prefix[i]}sticky`;
        style.position = stickyName;
        if (style.position === stickyName) support = true;
        break;
    }

    return support;
};

export default () => {
    return supportSticky === null ? (supportSticky = checkStickySupport()) : supportSticky;
};
