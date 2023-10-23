import { filterChange } from '../reducers/filterReducer';
import { useDispatch } from "react-redux";

const VisibilityFilter = () => {
    const dispatch = useDispatch();

    return (
        <div>
            <input type="radio" id="all" name="filter" onChange={() => dispatch(filterChange('ALL'))} />
            <label htmlFor="all">all</label>

            <input type="radio" id="important" name="filter" onChange={() => dispatch(filterChange('IMPORTANT'))} />
            <label htmlFor="important">important</label>

            <input type="radio" id="nonimportant" name="filter" onChange={() => dispatch(filterChange('NONIMPORTANT'))} />
            <label htmlFor="nonimportant">nonimportant</label>
        </div>
    )
}

export default VisibilityFilter;