import React, { forwardRef } from 'react';
import Page from './Page';

interface IndexPageProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    number?: number;
    onJump: (pageIndex: number) => void;
    items: {
        title: string;
        pageIndex: number;
        pageCount?: number;
        displayStart?: number;
    }[];
}

const IndexPage = forwardRef<HTMLDivElement, IndexPageProps>((props, ref) => {
    return (
        <Page ref={ref} variant="plain" className={`index-page ${props.className || ''}`} {...props}>
            <div className="index-container">
                <h2 className="index-title">Index</h2>
                <ul className="index-list">
                    {props.items.map((item, index) => (
                        <li key={index} className="index-item" onClick={() => props.onJump(item.pageIndex)}>
                            <span className="index-label">{item.title}</span>
                            <span className="index-dots"></span>
                            <span className="index-page-num">
                                {item.displayStart || (item.pageIndex + 1)}
                                {item.pageCount ? `-${(item.displayStart || (item.pageIndex + 1)) + item.pageCount - 1}` : ''}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </Page>
    );
});

export default IndexPage;
