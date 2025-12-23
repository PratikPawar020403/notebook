export interface Chapter {
    id: string;
    title: string;
    pageCount: number;
}

export const chapters: Chapter[] = [
    {
        id: 'class-10',
        title: 'Class 10',
        pageCount: 2,
    },
    {
        id: 'class-12',
        title: 'Class 12',
        pageCount: 2,
    },
    {
        id: 'undergraduate',
        title: 'Undergraduate',
        pageCount: 2,
    },
    {
        id: 'msc',
        title: 'MSc',
        pageCount: 2,
    },
];
