// Webové demo pro Vercel: demo build (EXPO_PUBLIC_DEMO=1, --clear kvůli cache Metra, jinak zůstane DEMO_BUILD=false),
// pak přesun assets/node_modules → assets/nm (Vercel složky node_modules nenahraje → fonty by vracely HTML).
// Nasazení: cd dist && npx vercel deploy --prod --yes --name gimu
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

execSync('npx expo export --platform web --clear', { stdio: 'inherit', env: { ...process.env, EXPO_PUBLIC_DEMO: '1' } });
renameSync('dist/assets/node_modules', 'dist/assets/nm');
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
for (const file of walk('dist').filter((f) => /\.(js|html|json)$/.test(f))) {
  const src = readFileSync(file, 'utf8');
  if (src.includes('assets/node_modules/')) writeFileSync(file, src.replaceAll('assets/node_modules/', 'assets/nm/'));
}
writeFileSync('dist/vercel.json', JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }));
console.log('Webové demo v dist/ připravené.');
