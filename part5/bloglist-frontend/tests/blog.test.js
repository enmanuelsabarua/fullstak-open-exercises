import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from "../src/components/Blog";

test('renders content', () => {
    const blog = {
        title: 'Test title',
        author: 'Author test',
        likes: 0,
        url: 'Test url'
    }

    render(<Blog blog={blog} />);

    const element = screen.getByText('Test title - Author test');
    expect(element).toBeDefined();

    const likes = screen.queryByText('likes 0');
    const url = screen.queryByText('Test url');
    expect(likes).toBeNull();
    expect(url).toBeNull();
});

test('url and likes ares shown when the button is pressed', async () => {
    const blog = {
        title: 'Test title',
        author: 'Author test',
        likes: 0,
        url: 'Test url',
        user: {
            username: 'test'
        }
    }

    const userTest = {
        username: 'test'
    }

    render(<Blog blog={blog} user={userTest} />);

    const element = screen.getByText('Test title - Author test');
    expect(element).toBeDefined();

    const likes = screen.queryByText('likes 0');
    const url = screen.queryByText('Test url');
    expect(likes).toBeNull();
    expect(url).toBeNull();

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);


    expect(likes).toBeDefined();
    expect(url).toBeDefined();

});

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Test title',
        author: 'Author test',
        likes: 0,
        url: 'Test url',
        user: {
            username: 'test'
        }
    }

    const userTest = {
        username: 'test'
    }

    const likeBlog = jest.fn();

    const { container } = render(<Blog blog={blog} user={userTest} likeBlog={likeBlog}/>);

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = container.querySelector('.likeButton');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeBlog.mock.calls).toHaveLength(2);
})