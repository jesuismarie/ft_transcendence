import { collectDefaultMetrics, Registry } from "prom-client";

const register = new Registry();
collectDefaultMetrics({ register });

export { register };
