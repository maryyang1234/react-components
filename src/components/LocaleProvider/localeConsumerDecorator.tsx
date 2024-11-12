import React, { useContext, useMemo } from 'react';

import hoistStatics from 'src/utils/hoistStatics';

import { getRuntimeLocale } from './locale/runtime';
import LocaleContext, { LocaleMap } from './LocaleContext';

const localeConsumerDecorator = ({
    defaultLocale = {},
    localeName,
    requireRuntimeLocale
}: {
    defaultLocale: LocaleMap;
    localeName: string;
    requireRuntimeLocale: boolean;
}) => (Child: React.ComponentType<any>) => {
    // eslint-disable-next-line react/display-name
    const LocalConsumerWrappedComponent = React.forwardRef(
        (props: Omit<{ [key: string]: any; locale: LocaleMap; }, 'ref'>, ref) => {
            const { locale, ...rest } = props;
            const localeContext = useContext(LocaleContext);
            const componentLocaleContent = localeContext[localeName];
            const finalLocale = useMemo(() => {
                return {
                    ...defaultLocale,
                    ...componentLocaleContent,
                    ...(requireRuntimeLocale ? getRuntimeLocale()[localeName] : {}),
                    ...locale
                };
            }, [locale, componentLocaleContent]);
            return <Child {...rest} locale={finalLocale} ref={ref} />;
        }
    );

    hoistStatics(LocalConsumerWrappedComponent, Child);

    return LocalConsumerWrappedComponent;
};

export default localeConsumerDecorator;
