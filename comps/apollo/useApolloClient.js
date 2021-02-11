import { ApolloClient, InMemoryCache } from '@apollo/client';
import EventEmitter from 'events';
import { useEffect, useState } from 'react';

const AuthTokenEmitter = new EventEmitter();

export const setAuthToken = token => AuthTokenEmitter.emit('setToken', token);
export const cache = new InMemoryCache();

const useApolloClient = () => {
    const [token, setToken] = useState(
        typeof window !== 'undefined' ? window?.localStorage?.getItem('auth-jwt') : null
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const callback = newToken => setToken(newToken);
            AuthTokenEmitter.on('setToken', callback);

            return () => AuthTokenEmitter.removeListener('setToken', callback);
        }
    });

    return new ApolloClient({
        cache,
        uri: '/api/graphql',
        headers: {
            authorization: token ? 'Bearer ' + token : '',
        },
    });
};

export default useApolloClient;
