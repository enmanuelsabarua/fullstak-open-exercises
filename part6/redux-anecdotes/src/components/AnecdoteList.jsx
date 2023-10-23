import { updateVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer";
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line react/prop-types
const Anecdote = ({ anecdote, handleVote }) => {
    return (
        <>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </>
    )
}


const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        const anecdotesContent = state.anecdotes.map(anecdote => anecdote.content.toLowerCase());
        const filteredAnecdotes = anecdotesContent.filter(anecdote => anecdote.includes(state.filter.toLowerCase()) && anecdote);
        return state.anecdotes.filter(anecdote => filteredAnecdotes.includes(anecdote.content.toLowerCase()) && anecdote);
    })
    const dispatch = useDispatch();

    const orderedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    const handleVote = (anecdote) => {
        dispatch(updateVote(anecdote.id))
        dispatch(setNotification(`You voted ${anecdote.content}`, 5));
    }

    return (
        <div>
            {orderedAnecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={() => handleVote(anecdote)} />
            )}
        </div>
    )
}

export default AnecdoteList;