import React, { createContext, useContext, useState } from 'react';

// Initial notices is now empty
const initialNotices = [];

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
            value={{ notices, setNotices, addNotice, updateNotice, deleteNotice, addSubmission }}
        >
            {children}
        </NoticesContext.Provider>
    );
};

// Blog context
const initialBlogs = [];

const BlogsContext = createContext();
export const useBlogs = () => useContext(BlogsContext);

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState(initialBlogs);

    const addBlog = (blog) => setBlogs((prev) => [...prev, blog]);
    const updateBlog = (id, updated) => setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    const deleteBlog = (id) => setBlogs((prev) => prev.filter((b) => b.id !== id));

    return (
        <BlogsContext.Provider value={{ blogs, setBlogs, addBlog, updateBlog, deleteBlog }}>
            {children}
        </BlogsContext.Provider>
    );
}; 