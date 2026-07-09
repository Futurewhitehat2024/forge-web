import fs from "fs";
import { execSync } from "child_process";

const batches = [1, 2, 3];
for (const n of batches) {
  const payload = fs.readFileSync(`.push-batch${n}.json`, "utf8");
  fs.writeFileSync(`.push-batch${n}-args.json`, payload);
  console.log(`Prepared batch ${n}`);
}