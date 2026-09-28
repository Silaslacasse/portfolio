import { stdin } from "node:process";
import { hashPassword } from "../server/utils/password.ts";

// Reads the password from stdin so it never lands in shell history or `ps` output:
//   printf '%s' 'my password' | npm run hash-password
// Paste the output into NUXT_ADMIN_PASSWORD_HASH.
let input = "";
for await (const chunk of stdin) input += chunk;

const password = input.replace(/\r?\n$/, "");
if (!password) {
  console.error("Usage: printf '%s' 'password' | npm run hash-password");
  process.exit(1);
}

console.log(await hashPassword(password));
