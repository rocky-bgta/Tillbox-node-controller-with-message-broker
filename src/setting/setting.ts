import * as dotenv from 'dotenv'

dotenv.config({ path: "variables.env" });

export const setting = {
    NODE_SERVER_PORT:   process.env.NODE_SERVER_PORT,
    NODE_SERVER_HOST:   process.env.NODE_SERVER_HOST,
    TOKEN_SECRET:       process.env.TOKEN_SECRET
};