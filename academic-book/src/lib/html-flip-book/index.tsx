import React, {
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { PageFlip } from 'page-flip';
import { IFlipSetting, IEventProps } from './settings';

interface IProps extends IFlipSetting, IEventProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    renderOnlyPageLengthChange?: boolean;
}

export function patchPageFlipCoordinates(pageFlip: any) {
    if (!pageFlip) return;
    try {
        const ui = pageFlip.getUI ? pageFlip.getUI() : pageFlip.ui;
        if (ui) {
            const scaledGetMousePos = function (this: any, clientX: number, clientY: number) {
                const dist = this.distElement;
                if (!dist) {
                    return { x: clientX, y: clientY };
                }
                const rect = dist.getBoundingClientRect();
                if (!rect || rect.width === 0 || rect.height === 0) {
                    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) };
                }

                const app = this.app;
                const settings = app.getSettings ? app.getSettings() : app.setting;
                const orientation = app.getOrientation
                    ? app.getOrientation()
                    : (app.getRender ? app.getRender().getOrientation() : 'landscape');
                const isPortrait = orientation === 'portrait';

                // In landscape mode, a double spread is width * 2; in portrait, it is width
                const baseWidth = isPortrait ? settings.width : settings.width * 2;
                const baseHeight = settings.height;

                const scaleX = rect.width / baseWidth;
                const scaleY = rect.height / baseHeight;

                return {
                    x: (clientX - rect.left) / scaleX,
                    y: (clientY - rect.top) / scaleY,
                };
            };

            // Attach directly to instance
            ui.getMousePos = scaledGetMousePos;

            // Attach to prototype chain so any caller finding it on prototype also gets the scaled coordinates
            let proto = Object.getPrototypeOf(ui);
            while (proto && proto !== Object.prototype) {
                proto.getMousePos = scaledGetMousePos;
                proto = Object.getPrototypeOf(proto);
            }
        }

        // Helper to detect if currently on a single-page cover spread (Page 0 or Back Cover)
        const isCoverSpread = (app: any) => {
            const pageIndex = app.getCurrentPageIndex ? app.getCurrentPageIndex() : 0;
            const pageCount = app.getPageCount ? app.getPageCount() : 15;
            if (pageIndex === 0 || pageIndex >= pageCount - 1) {
                return true;
            }
            const pageCollection = app.getPageCollection ? app.getPageCollection() : app.pages;
            if (pageCollection) {
                const currentSpreadIndex = pageCollection.getCurrentSpreadIndex ? pageCollection.getCurrentSpreadIndex() : 0;
                const spreads = pageCollection.getSpread ? pageCollection.getSpread() : null;
                if (spreads && spreads[currentSpreadIndex] && spreads[currentSpreadIndex].length === 1) {
                    const orientation = app.getOrientation ? app.getOrientation() : 'landscape';
                    if (orientation !== 'portrait') {
                        return true;
                    }
                }
            }
            return false;
        };

        // Patch FlipController.showCorner to suppress corner curl on cover spreads
        // This prevents the cover from jumping/shifting 400px to the left on hover
        const flipController = pageFlip.getFlipController ? pageFlip.getFlipController() : pageFlip.flipController;
        if (flipController && !flipController._patchedShowCorner) {
            const originalShowCorner = flipController.showCorner;
            flipController.showCorner = function (pos: any) {
                if (isCoverSpread(pageFlip)) {
                    if (this.calc !== null) {
                        this.setState('read');
                        if (this.render && this.render.finishAnimation) {
                            this.render.finishAnimation();
                        }
                        this.stopMove();
                    }
                    return;
                }
                return originalShowCorner.call(this, pos);
            };
            flipController._patchedShowCorner = true;
        }

        // Also guard userMove when merely hovering (not dragging) over cover spreads
        if (pageFlip && !pageFlip._patchedUserMove) {
            const originalUserMove = pageFlip.userMove;
            pageFlip.userMove = function (pos: any, isTouch: boolean) {
                if (!this.isUserTouch && !isTouch && isCoverSpread(this)) {
                    return;
                }
                return originalUserMove.call(this, pos, isTouch);
            };
            pageFlip._patchedUserMove = true;
        }
    } catch (err) {
        console.error('Error patching pageFlip coordinates:', err);
    }
}

const HTMLFlipBookForward = React.forwardRef(
    (props: IProps, ref: React.MutableRefObject<PageFlip>) => {
        const htmlElementRef = useRef<HTMLDivElement>(null);
        const childRef = useRef<HTMLElement[]>([]);
        const pageFlip = useRef<PageFlip>();

        const [pages, setPages] = useState<ReactElement[]>([]);

        useImperativeHandle(ref, () => ({
            pageFlip: () => pageFlip.current,
        }));

        const refreshOnPageDelete = useCallback(() => {
            if (pageFlip.current) {
                pageFlip.current.clear();
            }
        }, []);

        const removeHandlers = useCallback(() => {
            const flip = pageFlip.current;

            if (flip) {
                flip.off('flip');
                flip.off('changeOrientation');
                flip.off('changeState');
                flip.off('init');
                flip.off('update');
            }
        }, []);

        useEffect(() => {
            childRef.current = [];

            if (props.children) {
                const childList = React.Children.map(props.children, (child) => {
                    return React.cloneElement(child as ReactElement, {
                        ref: (dom) => {
                            if (dom) {
                                childRef.current.push(dom);
                            }
                        },
                    });
                });

                if (!props.renderOnlyPageLengthChange || pages.length !== childList.length) {
                    if (childList.length < pages.length) {
                        refreshOnPageDelete();
                    }

                    setPages(childList);
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.children]);

        useEffect(() => {
            const setHandlers = () => {
                const flip = pageFlip.current;

                if (flip) {
                    if (props.onFlip) {
                        flip.on('flip', (e: unknown) => props.onFlip(e));
                    }

                    if (props.onChangeOrientation) {
                        flip.on('changeOrientation', (e: unknown) => props.onChangeOrientation(e));
                    }

                    if (props.onChangeState) {
                        flip.on('changeState', (e: unknown) => props.onChangeState(e));
                    }

                    if (props.onInit) {
                        flip.on('init', (e: unknown) => props.onInit(e));
                    }

                    if (props.onUpdate) {
                        flip.on('update', (e: unknown) => props.onUpdate(e));
                    }
                }
            };

            if (pages.length > 0 && childRef.current.length > 0) {
                removeHandlers();

                if (htmlElementRef.current && !pageFlip.current) {
                    pageFlip.current = new PageFlip(htmlElementRef.current, props);
                }

                if (!pageFlip.current.getFlipController()) {
                    pageFlip.current.loadFromHTML(childRef.current);
                } else {
                    pageFlip.current.updateFromHtml(childRef.current);
                }

                patchPageFlipCoordinates(pageFlip.current);

                setHandlers();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [pages]);

        return (
            <div ref={htmlElementRef} className={props.className} style={props.style}>
                {pages}
            </div>
        );
    }
);

export const HTMLFlipBook = React.memo(HTMLFlipBookForward);
