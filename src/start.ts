'use strict';

import {ApiServer} from './app';


export const start = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const apiServer = new ApiServer();
        apiServer.start()
            .then(resolve)
            .catch(reject);

        const graceful = async () => {
            apiServer.stop().then(() => process.exit(0));
        };

        // Stop graceful
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
        process.on('disconnect',graceful);
    });
};
