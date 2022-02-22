import React from 'react';
import {useQuery} from '@apollo/client';
import {QUERY_THOUGHTS} from '../utils/queries';
import ThoughtList from '../components/ThoughtList';

const Home = () => {

  //use useQuery to make a query request
  const {loading, data} = useQuery(QUERY_THOUGHTS);
//optional chaining to check if an object exists before accessing properties
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>{
          loading? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some feed for Thoughts..." />
          )
        }</div>
      </div>
    </main>
  );
};

export default Home;
