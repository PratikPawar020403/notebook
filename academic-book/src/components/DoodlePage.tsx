import React, { forwardRef } from 'react';
import Page from './Page';

interface DoodlePageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
}

const DoodlePage = forwardRef<HTMLDivElement, DoodlePageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="plain" className={`doodle-page ${props.className || ''}`} {...props}>
            <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '10px 90px 50px 0px' }}>
                <img
                    src="src/assets/this.jpg"
                    alt="Doodle Art"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',
                        display: 'block'
                    }}
                />
            </div>
        </Page>
    );
});

export default DoodlePage;
