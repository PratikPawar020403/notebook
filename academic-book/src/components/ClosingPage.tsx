import React, { forwardRef } from 'react';
import Page from './Page';

interface ClosingPageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string; // Add className to props
    number?: number;
}

const ClosingPage = forwardRef<HTMLDivElement, ClosingPageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="plain" className={`cover-page back-cover ${props.className || ''}`} {...props}>
            <div className="cover-text-end">
                This is the end !!
            </div>
        </Page>
    );
});

export default ClosingPage;
