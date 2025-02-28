// Importing necessary hooks from the 'react' library
import { useEffect, useState } from 'react';

// Variable to store the online status
let online;

// Custom hook to track online/offline status and execute corresponding functions
export const useOnline = (funcObj: { online: () => void, offline: () => void }) => {
    // Checking if the navigator indicates the user is online
    if (navigator.onLine) {
        online = true;
    }
    else {
        online = false;
    }

    // Creating a state variable to manage online status
    const [isOnline, setIsOnline] = useState(online);

    useEffect(() => {
        // Function to be called when offline event occurs
        const offlineEventListenerFunction = () => {
            setIsOnline(false); // Set online status to false
            funcObj.offline()
        };

        // Function to be called when online event occurs
        const onlineEventListenerFunction = () => {
            setIsOnline(true); // Set online status to true
            funcObj.online()
        };

        // Adding event listeners for online and offline events
        addEventListener('offline', offlineEventListenerFunction);
        addEventListener('online', onlineEventListenerFunction);

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            removeEventListener('offline', offlineEventListenerFunction);
            removeEventListener('online', onlineEventListenerFunction);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return isOnline; // Returning the current online status
};
