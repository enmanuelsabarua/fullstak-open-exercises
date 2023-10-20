import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import NoteForm from '../src/components/NoteForm'

test('<NoteForm /> updates parent state and calls on Submit', async () => {
    const createNote = jest.fn();
    const user = userEvent.setup();

    render(<NoteForm createNote={createNote } />);

    const input = screen.getByPlaceholderText('write a new note');
    const sendButton = screen.getByText('save');

    await user.type(input, 'testing a form...');
    await user.click(sendButton);

    console.log(createNote.mock.calls);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
});