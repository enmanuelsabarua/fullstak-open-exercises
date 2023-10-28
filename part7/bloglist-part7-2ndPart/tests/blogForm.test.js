import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from "../src/components/BlogForm";

test('<BlogForm /> user the right content on the event handler', async () => {
    const handleAddBlog = jest.fn();
    const setTitle = jest.fn();
    const setAuthor = jest.fn()
    const setUrl = jest.fn();
    const user = userEvent.setup();

    const { container } = render(<BlogForm handleAddBlog={handleAddBlog} setAuthor={setAuthor} setTitle={setTitle} setUrl={setUrl}/>)

    const title = container.querySelector('#title');
    const author = container.querySelector('#author');
    const url = container.querySelector('#url');

    await user.type(title, 'Title test');
    await user.type(author, 'Author test');
    await user.type(url, 'Url test');

    expect(setTitle.mock.calls[setTitle.mock.calls.length - 1][0]).toBe('Title test');
    expect(setAuthor.mock.calls[setAuthor.mock.calls.length - 1][0]).toBe('Author test');
    expect(setUrl.mock.calls[setUrl.mock.calls.length - 1][0]).toBe('Url test');

})