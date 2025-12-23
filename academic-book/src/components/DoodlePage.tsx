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
    <Page
      ref={ref}
      variant="plain"
      className={`doodle-page ${props.className || ''}`}
      {...props}
    >
      <div
        className="page-content"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', // 
          height: '100%',
          padding: '40px 60px 40px 40px',
          boxSizing: 'border-box'
        }}
      >
        <img
          src="/doodle.jpg" // 
          alt="Doodle Art"
          style={{
            width: '100%',
            maxHeight: '90%',
            objectFit: 'contain', // 
            display: 'block'
          }}
        />
      </div>
    </Page>
  );
});

export default DoodlePage;
