import React, { forwardRef } from 'react';
import '../styles/Page.css';

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    number?: number;
    style?: React.CSSProperties;
    className?: string;
    variant?: 'inner' | 'plain';
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    const { variant = 'plain', className, style, ...rest } = props;
    const variantClass = variant === 'inner' ? 'page--inner' : 'page--plain';

    return (
        <div className={`page ${variantClass} ${className || ''}`} ref={ref} style={{ backgroundColor: '#fdf6e3', ...style }} {...rest}>
            <div className="page-content">
                {props.children}
            </div>
        </div>
    );
});

export default Page;
