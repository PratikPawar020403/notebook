import React, { forwardRef } from 'react';
import Page from './Page';

interface QuotePageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
}

const QuotePage = forwardRef<HTMLDivElement, QuotePageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="inner" className={`quote-page ${props.className || ''}`} {...props}>
            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', padding: '40px 40px 40px 20px', gap: '40px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '30px', color: '#333' }}>
                    Notes to Self
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '5px', color: '#333' }}>
                            Carl Jung
                        </div>
                        <div style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.4' }}>
                            “Who looks outside, dreams; who looks inside, awakes.”
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '5px', color: '#333' }}>
                            Mahatma Gandhi
                        </div>
                        <div style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.4' }}>
                            “In a gentle way, you can shake the world.”
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '5px', color: '#333' }}>
                            Osho
                        </div>
                        <div style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.4' }}>
                            “I am here to confuse you more and more.”
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
});

export default QuotePage;
