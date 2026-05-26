// ============================================================
// 数据库迁移系统
// 后期接入 WatermelonDB 后，每次 schema 变更只需在此添加新 migration
// ============================================================

import type { Migration } from './schema';

export const migrations: Migration[] = [
  // 示例：
  // {
  //   from: 1,
  //   to: 2,
  //   migrate: async () => {
  //     // ALTER TABLE photos ADD COLUMN rating NUMBER;
  //   },
  // },
];

/** 获取从当前版本到目标版本的所有迁移 */
export function getMigrations(currentVersion: number, targetVersion: number): Migration[] {
  return migrations.filter((m) => m.from >= currentVersion && m.to <= targetVersion);
}
