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
          height: '100%',
          paddingTop: '40px',      // top notebook margin
          paddingLeft: '60px',
          paddingRight: '40px',
          paddingBottom: '40px',
          boxSizing: 'border-box'
        }}
      >
        <img
          src="/this.jpg"
          alt="Doodle Art"
          style={{
            width: '100%',
            maxHeight: '85%',       // prevents vertical centering effect
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    </Page>
  );
});

export default DoodlePage;
