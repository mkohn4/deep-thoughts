import React from 'react';
import {useQuery} from '@apollo/client';
import {QUERY_THOUGHTS, QUERY_ME_BASIC} from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {

//use object destructuring to extract `data` from the `useQuery` hook
const {data: userData} = useQuery(QUERY_ME_BASIC);

  //use useQuery to make a query request
  const {loading, data} = useQuery(QUERY_THOUGHTS);
//optional chaining to check if an object exists before accessing properties
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

//establish T/F if user is logged in or not
const loggedIn = Auth.loggedIn()

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {/*only show ability to post if logged in*/}
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm/>
            </div>
        )}
        <div className={`col-12 mb-3'${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some feed for Thoughts..." />
          )
        }</div>
        {/*if user logged in and userData returns info from query, show friends list*/}
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
              />
              </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
