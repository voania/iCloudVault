// ============================================================
// Accessibility — 无障碍标签工具集
// 集中定义各组件的 a11y 标签，方便后期国际化
// 对应角色：button / image / header / link / tab
// ============================================================

export const A11Y = {
  // ---- 导航 ----
  tab: {
    grid: { label: '照片网格', hint: '查看所有照片的网格视图' },
    timeline: { label: '时间线', hint: '按时间查看照片' },
    map: { label: '地图', hint: '在地图上查看照片位置' },
    category: { label: '分类', hint: '按 AI 分类浏览照片' },
    trash: { label: '回收站', hint: '查看已删除的照片' },
  },

  // ---- 通用按钮 ----
  button: {
    back: { label: '返回', hint: '返回上一页' },
    close: { label: '关闭', hint: '关闭当前页面' },
    cancel: { label: '取消', hint: '取消操作' },
    save: { label: '保存', hint: '保存更改' },
    delete: { label: '删除', hint: '删除所选项目' },
    confirm: { label: '确认', hint: '确认操作' },
    more: { label: '更多选项', hint: '查看更多操作' },
    search: { label: '搜索', hint: '搜索照片' },
  },

  // ---- 照片操作 ----
  photo: {
    card: (index: number) => ({ label: `照片 ${index + 1}`, hint: '点击查看大图，长按选择' }),
    favorite: (isFav: boolean) => ({
      label: isFav ? '取消收藏' : '收藏',
      hint: isFav ? '从收藏中移除' : '添加到收藏',
    }),
    hidden: (isHidden: boolean) => ({
      label: isHidden ? '取消隐藏' : '隐藏',
      hint: isHidden ? '取消隐藏此照片' : '隐藏此照片',
    }),
    pin: (isPinned: boolean) => ({
      label: isPinned ? '取消置顶' : '置顶',
      hint: isPinned ? '从置顶移除' : '置顶此照片',
    }),
    edit: { label: '编辑照片', hint: '裁剪、调整、添加滤镜' },
    share: { label: '分享', hint: '分享照片' },
    compare: { label: '对比', hint: '并排比较两张照片' },
    slideshow: { label: '幻灯片', hint: '开始幻灯片播放' },
    collage: { label: '拼图', hint: '创建照片拼图' },
    versionHistory: { label: '版本历史', hint: '查看编辑历史版本' },
    rating: (rating: number) => ({
      label: rating > 0 ? `评分 ${rating} 星` : '评分',
      hint: '为照片设置评分',
    }),
    exif: { label: '照片信息', hint: '查看拍摄参数和元数据' },
  },

  // ---- 选择模式 ----
  selection: {
    enter: { label: '选择照片', hint: '长按进入选择模式' },
    exit: { label: '退出选择', hint: '退出多选模式' },
    batchEdit: { label: '批量编辑', hint: '编辑选中的照片' },
    batchAlbum: { label: '添加到相册', hint: '将选中照片添加到相册' },
  },

  // ---- AI ----
  ai: {
    scan: { label: 'AI 分析', hint: '运行 AI 智能分析' },
    dedup: { label: '去重扫描', hint: '扫描重复照片' },
    faceGroup: { label: '人物组', hint: '查看此人物组的所有照片' },
  },

  // ---- 其他 ----
  settings: {
    theme: { label: '主题配色', hint: '选择应用主题颜色' },
    gridColumns: { label: '网格列数', hint: '调整照片网格的列数' },
    pin: { label: 'PIN 锁', hint: '设置应用锁定密码' },
    biometric: { label: '生物识别', hint: '使用指纹或面部解锁' },
  },

  storage: {
    dashboard: { label: '存储管理', hint: '查看存储空间使用情况' },
    cleanup: { label: '清理建议', hint: '释放可回收的空间' },
  },
};

// ---- 辅助函数 ----
export function a11yProps(label: string, hint?: string) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button' as const,
  };
}

export function a11yImage(label: string) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'image' as const,
  };
}

export function a11yTab(label: string, selected: boolean) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'tab' as const,
    accessibilityState: { selected },
  };
}
