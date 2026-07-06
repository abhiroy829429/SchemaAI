import { writeFileSync } from "fs";
import { SCHEMES_SEED } from "./schemes";

writeFileSync(
  "seed/schemes.json",
  JSON.stringify(SCHEMES_SEED, null, 2),
  "utf-8"
);

console.log(`Exported ${SCHEMES_SEED.length} schemes to seed/schemes.json`);
