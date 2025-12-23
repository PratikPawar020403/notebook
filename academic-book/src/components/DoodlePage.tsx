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
          alignItems: 'center',
          height: '100%',
          padding: '40px'
        }}
      >
        <img
          src="/this.jpg"
          alt="Doodle Art"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    </Page>
  );
});

export default DoodlePage;
