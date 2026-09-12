import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import HTMLFlipBook from './lib';
import { patchPageFlipCoordinates } from './lib/html-flip-book';
import CoverPage from './components/CoverPage';
import ContentPage from './components/ContentPage';
import ClosingPage from './components/ClosingPage';
import IndexPage from './components/IndexPage';
import IntroPage from './components/IntroPage';
import QuotePage from './components/QuotePage';
import DoodlePage from './components/DoodlePage';
import Page from './components/Page'; // For blank spacer
import { chapters } from './data/chapters';
import { class10Content } from './data/content/class10';
import { class12Content } from './data/content/class12';
import { undergraduateContent } from './data/content/undergraduate';
import { mscContent } from './data/content/msc';
import lastImage from './assets/last2.jpg';

function App() {
    const book = useRef<any>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [scale, setScale] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const totalPages = 15;

    // Cross-origin height broadcaster for parent iframe (Fix B)
    const sendHeight = useCallback(() => {
        const rootEl = document.getElementById('root');
        const docEl = document.documentElement;
        const body = document.body;
        const height = Math.max(
            docEl ? docEl.scrollHeight : 0,
            body ? body.scrollHeight : 0,
            rootEl ? rootEl.scrollHeight : 0
        );
        if (height > 0 && typeof window !== 'undefined' && window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'notebook-height', height }, '*');
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mobile = width <= 767;
            setIsMobile(mobile);

            // Base dimensions
            const baseWidth = mobile ? 400 : 800; // Single page vs Double spread
            const baseHeight = 600;

            // Safe margins (accounting for flanking arrows and section padding)
            const horizontalMargin = mobile ? 24 : 140;
            const availableWidth = Math.max(width - horizontalMargin, 260);

            // Calculate scale to fit width comfortably
            const scaleX = availableWidth / baseWidth;

            // Safe vertical margins reserved for header, footer, padding, and stage gaps
            // Desktop: Header (~85px) + Footer (~50px) + Padding (~36px) + Stage gaps (~35px) = ~206px
            // Mobile: Header (~70px) + Footer (~40px) + Padding (~25px) + Stage gaps (~25px) = ~160px
            const verticalMargin = mobile ? 160 : 205;
            const availableHeight = Math.max(height - verticalMargin, 250);

            // Calculate scale to fit height comfortably in a single screen
            const scaleY = availableHeight / baseHeight;

            // Scale dynamically to fit BOTH width and height so everything fits in a single screen with NO SCROLLING!
            let newScale = Math.min(scaleX, scaleY);

            // Cap at 1 to avoid pixelation upscaling
            if (newScale > 1) newScale = 1;
            // Floor at 0.4 for very small screens
            if (newScale < 0.4) newScale = 0.4;

            setScale(newScale);
            sendHeight();
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        // Trigger entrance mount animation (Fix 7 / Mount animation)
        const entranceTimer = setTimeout(() => {
            setIsMounted(true);
        }, 60);

        // Initial postMessage height sends to parent
        sendHeight();
        const hTimer1 = setTimeout(sendHeight, 150);
        const hTimer2 = setTimeout(sendHeight, 500);
        const hTimer3 = setTimeout(sendHeight, 1200);

        window.addEventListener('load', sendHeight);

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(() => {
                sendHeight();
            });
            const rootEl = document.getElementById('root');
            if (rootEl) ro.observe(rootEl);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('load', sendHeight);
            clearTimeout(entranceTimer);
            clearTimeout(hTimer1);
            clearTimeout(hTimer2);
            clearTimeout(hTimer3);
            if (ro) ro.disconnect();
        };
    }, [sendHeight]);

    const handleJump = useCallback((pageIndex: number) => {
        if (book.current) {
            book.current.pageFlip().turnToPage(pageIndex);
        }
    }, []);

    const handlePrev = useCallback(() => {
        if (book.current) {
            book.current.pageFlip().flipPrev();
        }
    }, []);

    const handleNext = useCallback(() => {
        if (book.current) {
            book.current.pageFlip().flipNext();
        }
    }, []);

    const handleFlip = useCallback((e: any) => {
        const pageIndex = typeof e?.data === 'number' ? e.data : (typeof e === 'number' ? e : 0);
        setCurrentPage(pageIndex);
        setTimeout(sendHeight, 120);
    }, [sendHeight]);

    const handleInit = useCallback((e: any) => {
        const pageIndex = typeof e?.data === 'number' ? e.data : (typeof e === 'number' ? e : 0);
        setCurrentPage(pageIndex);
        if (book.current) {
            try {
                const flip = book.current.pageFlip();
                if (flip) {
                    patchPageFlipCoordinates(flip);
                }
            } catch (err) {}
        }
        setTimeout(sendHeight, 100);
        setTimeout(sendHeight, 350);
    }, [sendHeight]);

    useEffect(() => {
        if (book.current) {
            try {
                const flip = book.current.pageFlip();
                if (flip) {
                    patchPageFlipCoordinates(flip);
                }
            } catch (err) {}
        }
    }, [scale, isMobile]);

    // Keyboard arrow navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
            if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    // Calculate index items based on chapter order and page counts
    const indexItems = useMemo(() => {
        // Start after:
        // 0: Cover (R)
        // 1: Index (L)
        // 2: Intro (R)
        // First Chapter starts at 3 (L)
        let currentPageIndex = 3;
        let currentDisplayPage = 1;
        return chapters.map(chapter => {
            const item = {
                title: chapter.title,
                pageIndex: currentPageIndex,
                pageCount: chapter.pageCount,
                displayStart: currentDisplayPage
            };
            currentPageIndex += chapter.pageCount;
            currentDisplayPage += chapter.pageCount;
            return item;
        });
    }, []);

    const renderChapterContent = (chapterId: string, pageIndex: number) => {
        if (chapterId === 'class-10') {
            if (pageIndex === 0) {
                // Journey Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '16px', fontSize: '30px' }}>My Journey</h2>
                        <ul className="text-list" style={{ paddingLeft: '32px', marginBottom: '0px' }}>
                            {class10Content.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '18px', lineHeight: '28px', marginBottom: '13px' }}>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.3, color: '#222' }}>
                                {class10Content.institute}
                            </div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '3px', color: '#555' }}>
                                {class10Content.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '12px', fontSize: '28px' }}>Marks</h2>
                        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {class10Content.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item" style={{ fontSize: '19px', lineHeight: '28px' }}>
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '12px', fontSize: '28px' }}>Key Learnings</h2>
                        <ul className="text-list" style={{ paddingLeft: '32px', marginBottom: '0px' }}>
                            {class10Content.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '18px', lineHeight: '26px', marginBottom: '10px' }}>
                                    {learning}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
        } else if (chapterId === 'class-12') {
            if (pageIndex === 0) {
                // Journey Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '16px', fontSize: '30px' }}>My Journey</h2>
                        <ul className="text-list" style={{ paddingLeft: '32px', marginBottom: '0px' }}>
                            {class12Content.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '17.5px', lineHeight: '26px', marginBottom: '11px' }}>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <div style={{ marginBottom: '18px' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.3, color: '#222' }}>
                                {class12Content.institute}
                            </div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '3px', color: '#555' }}>
                                {class12Content.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '12px', fontSize: '28px' }}>Marks</h2>
                        <div style={{ marginBottom: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {class12Content.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item" style={{ fontSize: '19px', lineHeight: '28px' }}>
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '12px', fontSize: '28px' }}>Key Learnings</h2>
                        <ul className="text-list" style={{ paddingLeft: '32px', marginBottom: '0px' }}>
                            {class12Content.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '18px', lineHeight: '26px', marginBottom: '10px' }}>
                                    {learning}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
        } else if (chapterId === 'undergraduate') {
            if (pageIndex === 0) {
                // Journey Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '10px', fontSize: '28px' }}>My Journey</h2>
                        <ul className="text-list" style={{ paddingLeft: '30px', marginBottom: '0px' }}>
                            {undergraduateContent.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '16.5px', lineHeight: '23.5px', marginBottom: '7px' }}>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, color: '#222' }}>
                                {undergraduateContent.institute}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '2px', color: '#555' }}>
                                {undergraduateContent.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '10px', fontSize: '26px' }}>Marks</h2>
                        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {undergraduateContent.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item" style={{ fontSize: '18px', lineHeight: '25px' }}>
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '10px', fontSize: '26px' }}>Key Learnings</h2>
                        <ul className="text-list" style={{ paddingLeft: '30px', marginBottom: '0px' }}>
                            {undergraduateContent.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '16.5px', lineHeight: '23px', marginBottom: '7px' }}>
                                    {learning}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
        } else if (chapterId === 'msc') {
            if (pageIndex === 0) {
                // Journey Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '16px', fontSize: '30px' }}>My Journey</h2>
                        <ul className="text-list" style={{ paddingLeft: '32px', marginBottom: '0px' }}>
                            {mscContent.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item" style={{ fontSize: '18px', lineHeight: '28px', marginBottom: '13px' }}>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '0px' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, color: '#222' }}>
                                {mscContent.institute}
                            </div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '2px', color: '#555' }}>
                                {mscContent.program}
                            </div>
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '10px', fontSize: '26px' }}>Marks</h2>
                        <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {(mscContent.marks && mscContent.marks.length > 0) ? (
                                mscContent.marks.map((mark, idx) => (
                                    <div key={idx} className="text-marks-item" style={{ fontSize: '17.5px', lineHeight: '24px' }}>
                                        <span>{mark.subject}</span>
                                        <span>{mark.score}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-marks-item" style={{ fontSize: '17.5px', lineHeight: '24px' }}>
                                    <span>Result</span>
                                    <span>Awaited...</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline', marginBottom: '10px', fontSize: '26px' }}>Key Learnings</h2>
                        <ul className="text-list" style={{ paddingLeft: '30px', marginBottom: '0px' }}>
                            {(mscContent.learnings && mscContent.learnings.length > 0) ? (
                                mscContent.learnings.map((learning, idx) => (
                                    <li key={idx} className="text-list-item" style={{ fontSize: '16.5px', lineHeight: '23px', marginBottom: '7px' }}>
                                        {learning}
                                    </li>
                                ))
                            ) : (
                                <li className="text-list-item">loading...</li>
                            )}
                        </ul>
                    </div>
                );
            }
        }

        // Default placeholder for other chapters
        const currentChapter = chapters.find(c => c.id === chapterId);
        return (
            <>
                <p>{currentChapter?.title}</p>
                <p>Page {pageIndex + 1}</p>
            </>
        );
    };

    return (
        <section className="notebook-section" aria-label="Academic Records">
            <div className="notebook-container">
                {/* Section Header (Fix 1) */}
                <header className="notebook-header">
                    <span className="notebook-kicker">MY ACADEMIC JOURNEY</span>
                    <h2 className="notebook-title">Academic Records</h2>
                    <p className="notebook-subtitle">
                        Flip through milestones, coursework, marks, and key academic learnings.
                    </p>
                </header>

                {/* Stage: Flanking Buttons + Centered Flipbook (Fix 4, Fix 6) */}
                <div className="notebook-stage">
                    {/* Entrance container (Mount fade + scale / Fix 7) */}
                    <div className={`flipbook-entrance ${isMounted ? 'is-visible' : ''}`}>
                        {/* Scaled viewport container */}
                        <div
                            className="flipbook-wrapper"
                            style={{
                                width: `${(isMobile ? 400 : 800) * scale}px`,
                                height: `${600 * scale}px`,
                                transition: 'width 0.3s ease, height 0.3s ease',
                            }}
                        >
                            {/* Flanking Prev Button */}
                            <button
                                type="button"
                                className="flipbook-nav-btn flipbook-nav-prev"
                                onClick={handlePrev}
                                disabled={currentPage <= 0}
                                aria-label="Previous page"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>

                            {/* Grounding contact shadow under the book (Fix 2) */}
                            <div className="flipbook-ground-shadow" aria-hidden="true" />

                            <div style={{
                                width: `${isMobile ? 400 : 800}px`,
                                height: '600px',
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                transition: 'transform 0.3s ease',
                                overflow: 'hidden',
                            }}>
                                <HTMLFlipBook
                                    width={400}
                                    height={600}
                                    showCover={true}
                                    mobileScrollSupport={true}
                                    useMouseEvents={true}
                                    showPageCorners={true}
                                    disableFlipByClick={false}
                                    usePortrait={isMobile}
                                    startPage={0}
                                    ref={book}
                                    onFlip={handleFlip}
                                    onInit={handleInit}
                                    maxShadowOpacity={0.8}
                                >
                                    {/* 0: Cover (Right) */}
                                    <CoverPage number={1}>
                                        Cover Page
                                    </CoverPage>

                                    {/* 1: Index (Left) */}
                                    <IndexPage number={2} onJump={handleJump} items={indexItems} />

                                    {/* 2: Intro/Spacer (Right) - Ensures Class 10 starts on Left */}
                                    <IntroPage number={3} />

                                    {/* Chapters */}
                                    {chapters.map((chapter) => (
                                        Array.from({ length: chapter.pageCount }).map((_, i) => (
                                            <ContentPage key={`${chapter.id}-${i}`}>
                                                {renderChapterContent(chapter.id, i)}
                                            </ContentPage>
                                        ))
                                    ))}

                                    {/* 11: Quote (Left) */}
                                    <QuotePage />

                                    {/* 12: Doodle (Right) */}
                                    <DoodlePage />

                                    {/* 13: Last Image Page (Left) */}
                                    <Page>
                                        <div style={{
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                src={lastImage}
                                                alt="End"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'fill'
                                                }}
                                            />
                                        </div>
                                    </Page>

                                    {/* 14: Closing (Right) - Back Cover */}
                                    <ClosingPage>
                                        Closing Page
                                    </ClosingPage>
                                </HTMLFlipBook>
                            </div>

                            {/* Flanking Next Button */}
                            <button
                                type="button"
                                className="flipbook-nav-btn flipbook-nav-next"
                                onClick={handleNext}
                                disabled={currentPage >= totalPages - 1}
                                aria-label="Next page"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Indicator Footer (Fix 4) */}
                <footer className="flipbook-footer">
                    <div className="flipbook-page-indicator" aria-live="polite">
                        <span className="current">{currentPage + 1}</span>
                        <span className="separator">/</span>
                        <span className="total">{totalPages}</span>
                    </div>
                    <span className="flipbook-hint-text">
                        Drag page corner or use arrows to flip
                    </span>
                </footer>
            </div>
        </section>
    );
}

export default App;
