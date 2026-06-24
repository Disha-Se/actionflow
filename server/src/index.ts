import { app } from "./app.js";
import { env } from "./utils/env.js";

app.listen(env.PORT, () => {
  console.log(`ActionFlow API listening on port ${env.PORT}`);
});
