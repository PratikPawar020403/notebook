import React, { forwardRef } from 'react';
import Page from './Page';

interface ContentPageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
}

const ContentPage = forwardRef<HTMLDivElement, ContentPageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="inner" className={`content-page ${props.className || ''}`} {...props}>
            <div className="content-body">
                {props.children || "Content Page"}
            </div>
        </Page>
    );
});

export default ContentPage;
