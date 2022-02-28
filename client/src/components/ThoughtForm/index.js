import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {

    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addThought, {error}] = useMutation(ADD_THOUGHT, {
        update(cache, {data: {addThought}}) {

            try {
                //could potentially not exist yet so wrap in a try catch
                //read whats currently in cache
                const {thoughts} = cache.readQuery({query: QUERY_THOUGHTS});

                //prepend the newest thought tot he front of the array
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: {thoughts: [addThought, ...thoughts]}
                });
            } catch(e) {
                console.error(e);
            }
            //update me objects cache
            if (!cache.readQuery({query: QUERY_ME})) {
                return;
            }

            //update me object's cache, appending new thought tot he end of the array
            const {me} = cache.readQuery({query: QUERY_ME});
            cache.writeQuery({
                query: QUERY_ME,
                data: {me: {...me, thoughts: [...me.thoughts, addThought]}}
            });
        }
    });

    const handleChange = (e) => {
        if (e.target.value.length <=280) {
            setText(e.target.value);
            setCharacterCount(e.target.value.length);
        }

    }

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            //add thought to database
            await addThought({
                variables: {thoughtText}
            });

            //clear form value
            setText('');
            setCharacterCount(0);
        } catch(e) {
            console.error(e);
        }

    };

    return(
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
                Character Count: {characterCount}/200
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form 
            className='flex-row justify-center justify-space-between-md align-stretch'
            onSubmit={handleFormSubmit}>
                <textarea 
                 placeholder="Here's a new thought"
                 className="form-input col-12 col-md-9"
                 value={thoughtText}
                 onChange={handleChange}
                 >
                </textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ThoughtForm;