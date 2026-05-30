import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import stylisRTLPlugin from 'stylis-plugin-rtl';

export const RTL = (props) => {
    const { children, direction } = props;
    const cache = useMemo(() => createCache({
        key: 'rtl',
        prepend: true,
        stylisPlugins: [stylisRTLPlugin]
    }), []);

    useEffect(() => {
        document.dir = direction;
    }, [direction]);

    if (direction === 'rtl') {
        return (
            <CacheProvider value={cache}>
                {children}
            </CacheProvider>
        );
    }

    return <>{children}</>;
};

RTL.propTypes = {
    children: PropTypes.node.isRequired,
    direction: PropTypes.oneOf(['ltr', 'rtl'])
};