// Supabase(데이터베이스 + 사진 보관함 + 로그인) 연결
// 주소와 publishable 키는 원래 공개되는 값이에요. (비밀 키는 절대 여기에 넣지 않아요)
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://nadchkvnwrvitiskjiwv.supabase.co";
export const SUPABASE_KEY = "sb_publishable_qp4RAxqCQfaNPwy83u72Cg_-v2l1u6d";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const PHOTO_BUCKET = "photos";
/** 사진 보관함에 있는 사진의 주소는 이렇게 시작해요 */
export const PHOTO_BASE = `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`;

export type ContentKey = "works" | "exhibitions" | "about";
