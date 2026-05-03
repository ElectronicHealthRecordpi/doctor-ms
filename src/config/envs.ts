import 'dotenv/config'
import * as joi from 'joi'
import { env } from 'prisma/config';
interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    NATS_SERVERS: string[];
}
const EnvSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().uri().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
})
    .unknown(true);

const { error, value } = EnvSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvVars = value;
export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    natsServers: envVars.NATS_SERVERS,
}