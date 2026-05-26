const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const target = process.argv[2] ?? 'all';

function remove(relativePath) {
  fs.rmSync(path.join(root, relativePath), { recursive: true, force: true });
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function cleanAndroid() {
  const gradle = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  run(gradle, ['clean'], path.join(root, 'android'));
}

function cleanIos() {
  remove('ios/build');
  remove('ios/Pods');
  remove('ios/Podfile.lock');
}

if (target === 'all') {
  remove('node_modules');
  remove('package-lock.json');
  run('npm', ['install'], root);
} else if (target === 'android') {
  cleanAndroid();
} else if (target === 'ios') {
  cleanIos();
} else {
  console.error(`Unknown clean target: ${target}`);
  process.exit(1);
}
