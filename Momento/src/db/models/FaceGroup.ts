// ============================================================
// WatermelonDB FaceGroup Model — 人脸聚类
// ============================================================

export interface FaceGroupRecord {
  id: string;
  name: string;
  thumbnailUri: string | null;
  faceCount: number;
}

export interface FaceGroupPhotoRecord {
  faceGroupId: string;
  photoId: string;
}

// 目前仅定义类型，后期实现 AI 人脸聚类后使用
