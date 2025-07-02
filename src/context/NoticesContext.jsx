import React, { createContext, useContext, useState } from 'react';

// Initial mock data
const initialNotices = [
    {
        id: 'n1',
        title: 'Hackathon Registration',
        type: 'Event',
        hasForm: true,
        description: 'Register for the annual hackathon!',
        form: {
            title: 'Hackathon Registration Form',
            fields: [
                { id: 'f1', type: 'text', label: 'Team Name', required: true },
                { id: 'f2', type: 'email', label: 'Email', required: true },
                { id: 'f3', type: 'text', label: 'Experience', required: false },
            ],
        },
        submissions: [],
    },
    {
        id: 'n2',
        title: 'General Meeting Notice',
        type: 'Information',
        hasForm: false,
        description: 'Monthly meeting for all members.',
        form: null,
        submissions: [],
    },
];

const NoticesContext = createContext();

export const useNotices = () => useContext(NoticesContext);

export const NoticesProvider = ({ children }) => {
    const [notices, setNotices] = useState(initialNotices);

    // CRUD for notices
    const addNotice = (notice) => setNotices((prev) => [...prev, notice]);
    const updateNotice = (id, updated) => setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    const deleteNotice = (id) => setNotices((prev) => prev.filter((n) => n.id !== id));

    // Add submission to a notice
    const addSubmission = (noticeId, submission) => {
        setNotices((prev) =>
            prev.map((n) =>
                n.id === noticeId ? { ...n, submissions: [...(n.submissions || []), submission] } : n
            )
        );
    };

    return (
        <NoticesContext.Provider
            value={{ notices, addNotice, updateNotice, deleteNotice, addSubmission }}
        >
            {children}
        </NoticesContext.Provider>
    );
};

// Blog context
const initialBlogs = [
    {
        id: 'b1',
        title: 'How to Organize a Hackathon',
        category: 'Events',
        author: 'Admin',
        content: 'Tips and tricks...',
        date: '2024-05-01',
        thumbnail: '',
    },
    {
        id: 'b2',
        title: 'React Best Practices',
        category: 'Tutorials',
        author: 'Admin',
        content: 'Use hooks...',
        date: '2024-04-20',
        thumbnail: '',
    },
];

const BlogsContext = createContext();
export const useBlogs = () => useContext(BlogsContext);

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState(initialBlogs);

    const addBlog = (blog) => setBlogs((prev) => [...prev, blog]);
    const updateBlog = (id, updated) => setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    const deleteBlog = (id) => setBlogs((prev) => prev.filter((b) => b.id !== id));

    return (
        <BlogsContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog }}>
            {children}
        </BlogsContext.Provider>
    );
}; 