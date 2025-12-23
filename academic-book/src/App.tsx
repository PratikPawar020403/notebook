import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import HTMLFlipBook from './lib';
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

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width <= 767;
            setIsMobile(mobile);

            // Base dimensions
            const baseWidth = mobile ? 400 : 800; // Single page vs Double spread
            const baseHeight = 600;

            // Safe margins
            const margin = 20;
            const availableWidth = width - margin;
            const availableHeight = window.innerHeight - margin;

            // Calculate scale to fit
            const scaleX = availableWidth / baseWidth;
            const scaleY = availableHeight / baseHeight;

            // Use the smaller scale to ensure it fits, cap at 1 to avoid pixelation upscaling
            // But if user wants "auto-fits container width" even on large screens, we might check.
            // "Notebook auto-fits container width" -> suggests filling. 
            // Let's cap at 1.5 for desktop to avoid too small on 4k, but keeps crispness.
            // Actually, safe bet is min(scale, 1) to start.
            let newScale = Math.min(scaleX, scaleY);
            if (newScale > 1) newScale = 1; // Cap at 1 for now

            setScale(newScale);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleJump = useCallback((pageIndex: number) => {
        if (book.current) {
            book.current.pageFlip().turnToPage(pageIndex);
        }
    }, []);

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
                    <div style={{ marginTop: '10px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>My Journey</h2>
                        <ul className="text-list">
                            {class10Content.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.3, color: '#333' }}>
                                {class10Content.institute}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px', color: '#555' }}>
                                {class10Content.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Marks</h2>
                        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {class10Content.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item">
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Key Learnings</h2>
                        <ul className="text-list">
                            {class10Content.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item">
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
                    <div style={{ marginTop: '10px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>My Journey</h2>
                        <ul className="text-list">
                            {class12Content.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.3, color: '#333' }}>
                                {class12Content.institute}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px', color: '#555' }}>
                                {class12Content.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Marks</h2>
                        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {class12Content.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item">
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Key Learnings</h2>
                        <ul className="text-list">
                            {class12Content.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item">
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
                    <div style={{ marginTop: '10px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>My Journey</h2>
                        <ul className="text-list">
                            {undergraduateContent.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.3, color: '#333' }}>
                                {undergraduateContent.institute}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px', color: '#555' }}>
                                {undergraduateContent.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Marks</h2>
                        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {undergraduateContent.marks.map((mark, idx) => (
                                <div key={idx} className="text-marks-item">
                                    <span>{mark.subject}</span>
                                    <span>{mark.score}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Key Learnings</h2>
                        <ul className="text-list">
                            {undergraduateContent.learnings.map((learning, idx) => (
                                <li key={idx} className="text-list-item">
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
                    <div style={{ marginTop: '10px' }}>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>My Journey</h2>
                        <ul className="text-list">
                            {mscContent.journey.map((point, idx) => (
                                <li key={idx} className="text-list-item">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (pageIndex === 1) {
                // Marks & Learnings Page
                return (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.3, color: '#333' }}>
                                {mscContent.institute}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px', color: '#555' }}>
                                {mscContent.program}
                            </div>
                        </div>
                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Marks</h2>
                        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            <div className="text-marks-item">
                                <span>Result</span>
                                <span>Awaited...</span>
                            </div>
                        </div>

                        <h2 className="text-heading" style={{ textDecoration: 'underline' }}>Key Learnings</h2>
                        <ul className="text-list">
                            <li className="text-list-item">
                                loading...
                            </li>
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
        <div className="flipbook-wrapper" style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#333',
            overflow: 'hidden',
        }}>
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
            }}>
                <HTMLFlipBook
                    width={400}
                    height={600}
                    showCover={true}
                    mobileScrollSupport={true}
                    useMouseEvents={true}
                    usePortrait={isMobile}
                    startPage={0}
                    ref={book}
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
        </div>
    );
}

export default App;
