# 어드민(관리 화면) 설정 안내

주소: **https://www.parkmejung.com/admin**

## 어떻게 동작하나요?

- 내용(작업·전시·소개·이력)은 **Supabase 데이터베이스**에 저장돼요. 사이트는 열릴 때마다 여기서 최신 내용을 읽어요.
  → 관리 화면에서 **[저장하기]를 누르면 바로** 사이트에 반영돼요. (다시 배포하지 않아요)
- 사진은 모두 **Supabase 사진 보관함(photos)** 에 저장돼요. 올리기 전에 화면에서 웹용 크기(긴 쪽 2400px, JPG)로 줄여요.
- 예전 사진(`public/works`, `public/exhibitions`의 원본)은 관리 화면에 처음 로그인할 때 **한 번만 자동으로** 웹용 크기로 줄여서 보관함으로 옮겨요. 원본은 GitHub 기록에 남아요.
- Supabase가 응답하지 않으면, 사이트는 코드에 들어 있는 예전 JSON 파일 내용을 대신 보여줘요.
- 로그인은 Supabase 계정(이메일 + 비밀번호)으로 해요. 비밀번호를 잊으면 로그인 화면에서 **재설정 메일**을 받을 수 있어요.
- 한국어만 쓰면 저장할 때 Supabase의 `translate` 기능이 Claude로 영어 번역을 해요. 번역이 실패한 칸은 한국어가 그대로 들어가고, 다음에 저장할 때 다시 번역해요.
- GitHub Actions(`keep-supabase-awake.yml`)가 사흘에 한 번 Supabase를 깨워서, 무료 프로젝트가 멈추지 않게 해요.

| 내용 | 어디에 |
|---|---|
| 작업 / 전시 / 소개·이력 | Supabase → Table Editor → `site_content` (works, exhibitions, about 세 줄) |
| 사진 | Supabase → Storage → `photos` |
| 관리자 계정 | Supabase → Authentication → Users |
| 관리자로 인정하는 이메일 | Supabase → Table Editor → `admin_emails` |

Vercel 설정(환경변수)은 **필요 없어요.** 예전에 넣은 `AUTH_SECRET`, `GITHUB_TOKEN`, `ADMIN_SETUP_PASSWORD`는 이제 쓰지 않아요.

---

## 처음 한 번만 하는 설정 (Supabase 화면에서, 따님이 직접)

1. **표·보관함 만들기:** SQL Editor → `supabase/setup.sql` 내용을 붙여 넣고 [Run]
2. **관리자 계정 만들기:** Authentication → Users → Add user → Create new user
   - 이메일·비밀번호 입력, **Auto Confirm User** 체크
3. **관리자 이메일 등록:** SQL Editor에서 실행 (이메일만 바꿔서)
   ```sql
   insert into public.admin_emails (email) values ('관리자@이메일.com') on conflict do nothing;
   ```
4. **아무나 가입하지 못하게:** Authentication → Sign In / Providers → **Allow new users to sign up** 끄기
5. **재설정 메일 링크 주소:** Authentication → URL Configuration
   - Site URL: `https://www.parkmejung.com`
   - Redirect URLs에 추가: `https://www.parkmejung.com/admin/reset`, `https://parkmejung.com/admin/reset`, `http://localhost:3000/admin/reset`
6. **재설정 메일이 실제로 가도록:** Supabase 기본 메일은 **조직(Organization) 멤버의 이메일로만** 보내져요.
   관리자 이메일이 Supabase 가입 이메일과 다르면, 조직 설정 → Team → **Invite**로 그 이메일을 멤버로 초대하고 초대를 수락해 주세요.
   (기본 메일은 1시간에 몇 통으로 제한돼요. 비밀번호 재설정 용도로는 충분해요.)
7. **번역 기능 올리기:** Edge Functions → Deploy a new function → **Via Editor**
   - 이름: `translate`, 내용: `supabase/functions/translate/index.ts` 를 통째로 붙여 넣고 Deploy
   - 함수 설정에서 **Verify JWT** 끄기 (함수 안에서 관리자인지 직접 확인해요)
   - Edge Functions → **Secrets** → `ANTHROPIC_API_KEY` = Claude API 키 (console.anthropic.com에서 새로 만들기)

## 비밀번호를 잊었을 때

- 로그인 화면 → **비밀번호가 생각나지 않으세요?** → 이메일 넣고 메일 받기 → 메일 속 링크 → 새 비밀번호 만들기
- 메일이 안 오면: Supabase → Authentication → Users → 그 계정 오른쪽 ⋯ → 비밀번호를 직접 바꿀 수 있어요.

## 내 컴퓨터에서 테스트

`start-preview.sh`를 실행하고 http://localhost:3000/admin 을 열어요.
**진짜 데이터베이스에 연결돼서, 여기서 저장하면 실제 사이트에도 바로 반영돼요.**
