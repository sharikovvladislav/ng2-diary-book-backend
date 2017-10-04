export interface DiaryEntryDb {
  tagIds: string[];
  createDate: string;
  message: string;
  $key?: string;
  tags: any[];
  date: string;
}