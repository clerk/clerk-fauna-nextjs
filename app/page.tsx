'use client';

import React from 'react';
import { useAuth } from '@clerk/nextjs';
import { Client, fql } from 'fauna';

export default function Page() {
  const [message, setMessage] = React.useState('');
  // The `useAuth()` hook is used to get the `getToken()` method.
  const { getToken } = useAuth();

  // Create a function to make a query to Fauna.
  const makeQuery = async () => {
    let client;

    try {
      // Get the custom Fauna token from Clerk.
      const clerkToken = await getToken({ template: 'fauna' });

      if (!clerkToken) {
        setMessage('No token found');
        return;
      }

      // Initialize a new Fauna client with the Clerk token.
      client = new Client({ secret: clerkToken });

      // Make a query to Fauna.
      const response = await client.query(fql`'Hello World!'`);
      setMessage(JSON.stringify(response));
    } catch (error) {
      console.error(error);
      setMessage('Error occurred');
    } finally {
      if (client) client.close();
    }
  };

  return (
    <>
      <button onClick={makeQuery}>Make authenticated query</button>
      <p>Message: {message}</p>
    </>
  );
}
