import React, { forwardRef } from 'react';
import Page from './Page';

interface IntroPageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
}

const IntroPage = forwardRef<HTMLDivElement, IntroPageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="plain" className={`intro-page ${props.className || ''}`} {...props}>
            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h2 className="text-heading" style={{ fontSize: '28px', opacity: 0.7 }}>Welcome</h2>
                <div style={{ width: '50px', height: '2px', background: '#ccc', margin: '20px 0' }}></div>
                <p className="text-body" style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.6 }}>
                    "Every great journey begins with a single step."
                </p>
            </div>
        </Page>
    );
});

export default IntroPage;
