/// <reference types="vite/client" />

declare module 'react-pageflip' {
    import React from 'react';

    export interface HTMLFlipBookProps {
        width: number;
        height: number;
        size?: "fixed" | "stretch";
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        drawShadow?: boolean;
        flippingTime?: number;
        usePortrait?: boolean;
        startZIndex?: number;
        autoSize?: boolean;
        maxShadowOpacity?: number;
        showCover?: boolean;
        mobileScrollSupport?: boolean;
        swipeDistance?: number;
        clickEventForward?: boolean;
        useMouseEvents?: boolean;
        renderOnlyPageLengthChange?: boolean;
        className?: string;
        style?: React.CSSProperties;
        children: React.ReactNode;
        ref?: any;
        onFlip?: (e: any) => void;
        onChangeOrientation?: (e: any) => void;
        onChangeState?: (e: any) => void;
    }

    export const HTMLFlipBook: React.ForwardRefExoticComponent<HTMLFlipBookProps & React.RefAttributes<any>>;
    export default HTMLFlipBook;
}
