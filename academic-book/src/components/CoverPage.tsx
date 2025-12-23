import React, { forwardRef } from 'react';
import Page from './Page';

interface CoverPageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
}

const CoverPage = forwardRef<HTMLDivElement, CoverPageProps>((props, ref) => {
    return (
        // Using variant="plain" specifically for the cover
        <Page ref={ref} variant="plain" className={`cover-page ${props.className || ''}`} {...props}>
            <div className="cover-container">
                <h1 className="cover-title">Pratik Suryakant Sushma Pawar</h1>
                <div className="cover-subtitle">My Academic Journey</div>
                <div className="cover-year">2008 — 2026</div>
            </div>
        </Page>
    );
});

export default CoverPage;
