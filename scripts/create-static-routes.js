const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const indexFile = path.join(buildDir, 'index.html');

const departments = [
  'all-employees',
  'production-lines',
  'warehouse',
  'technical-service',
  'sanitation',
  'quality-lab',
  'office',
  'contractors',
];

const modules = ['life-saving-rules', 'slips-and-falls', 'electrical-safety'];
const lsrLessons = Array.from({ length: 15 }, (_, index) => `lsr-card-${index + 1}`);
const slipLessons = [
  'slip-video-1',
  'slip-text-1',
  'slip-question-1',
  'slip-video-2',
  'slip-text-2',
  'slip-question-2',
  'slip-video-3',
  'slip-text-3',
  'slip-question-3',
  'slip-video-4',
  'slip-text-4',
  'slip-question-4',
  'slip-video-5',
  'slip-text-5',
];
const electricalLessons = [
  'el-video-1',
  'el-text-1',
  'el-question-1',
  'el-video-2',
  'el-text-2',
  'el-question-2',
  'el-video-3',
  'el-text-3',
  'el-question-3',
  'el-video-4',
  'el-text-4',
  'el-question-4',
  'el-video-5',
  'el-text-5',
];

const lessonRoutes = [
  ...lsrLessons.map((lesson) => `hse/mvp/showcase/modules/life-saving-rules/lessons/${lesson}`),
  ...slipLessons.map((lesson) => `hse/mvp/showcase/modules/slips-and-falls/lessons/${lesson}`),
  ...electricalLessons.map((lesson) => `hse/mvp/showcase/modules/electrical-safety/lessons/${lesson}`),
];

const routes = [
  'medicine',
  'why_it_works',
  'ceo',
  'hse',
  'hse/mvp',
  'hse/mvp/showcase',
  'hse/mvp/showcase/organization',
  ...departments.map((department) => `hse/mvp/showcase/departments/${department}`),
  ...modules.map((module) => `hse/mvp/showcase/modules/${module}`),
  ...lessonRoutes,
  ...modules.map((module) => `hse/mvp/showcase/modules/${module}/test`),
  'hse/mvp/showcase/specialist',
  'hse/mvp/showcase/admin',
  'hse/mvp/showcase/request-course',
  'hse/mvp/showcase/integrations',
  'hse/mvp/showcase/support',
  'hse/mvp/test',
  'hse/mvp/test/login',
  'hse/mvp/test/register',
  'hse/mvp/test/admin-login',
  'hse/mvp/test/organization',
  'hse/mvp/test/me',
  'hse/mvp/test/admin',
  'hse/mvp/test/specialist',
  'hse/mvp/employee',
  'hse/mvp/course/life-saving-rules',
  'hse/mvp/course/life-saving-rules/test',
  'hse/mvp/course/slips-and-falls',
  'hse/mvp/course/slips-and-falls/test',
  'hse/mvp/course/electrical-safety',
  'hse/mvp/course/electrical-safety/test',
  'hse/mvp/specialist',
  'hse/mvp/admin',
  'hse/mvp/request-course',
  'hse/mvp/integrations',
  'hse/mvp/support',
  'personal-data',
  'privacy',
  'design1test',
  'hero_animation_test',
  'design_old',
];

if (!fs.existsSync(indexFile)) {
  console.warn(
    '[routes] build/index.html not found, skipping static route copies'
  );
  process.exit(0);
}

for (const route of routes) {
  const routeDir = path.join(buildDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
  fs.copyFileSync(indexFile, path.join(buildDir, `${route}.html`));
}

fs.copyFileSync(indexFile, path.join(buildDir, '404.html'));
console.log(`[routes] created static entries for: ${routes.join(', ')}`);