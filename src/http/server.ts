import { env } from "#/env/index.js";

import { app } from "./app.js";

app.ready().then(() => {
  app.listen({ port: env.PORT }).then(() => {
    console.log("HTTP server running!");
  });
});
