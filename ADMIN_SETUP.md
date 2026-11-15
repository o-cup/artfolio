# 어드민(관리 화면) 설정 안내

주소: **https://www.parkmejung.com/admin**

## 어떻게 동작하나요?

1. 어머님이 관리 화면에서 글·사진을 고치고 **[저장하기]** 를 누르면
2. 서버(Vercel의 `api/` 폴더)가 GitHub 저장소(`o-cup/artfolio`, `main` 브랜치)에 변경 내용을 **커밋 1개**로 올리고
3. Vercel이 그 커밋을 보고 사이트를 자동으로 다시 배포해요 → **2~3분 뒤 사이트에 반영**

데이터베이스나 새로 가입할 서비스는 없어요. 데이터는 지금처럼 아래 파일들에 저장돼요.

| 내용 | 파일 |
|---|---|
| 작업 (/works) | `src/components/works/worksData.json` + `public/works/{번호}/` 사진 |
| 전시 (/exhibitions) | `src/components/exhibitions/exhibitionsData.json` + `public/exhibitions/{번호}/` 사진 |
| 소개·이력 (/about) | `src/components/about/aboutData.json` |
| 관리자 비밀번호 (암호화) | `admin/auth.json` (처음 비밀번호를 만들면 생겨요) |

- 사진은 올리기 전에 화면에서 웹용 크기(긴 쪽 2400px, JPG)로 자동으로 줄여요.
- 한국어만 쓰면 영어는 Claude가 자동 번역해요. 저장 뒤 **GitHub이 영어가 아직 한국어 그대로인 칸만** 번역해서 한 번 더 커밋해요 (영어 반영까지 4~6분). 영어를 직접 쓴 칸은 건드리지 않아요.
- 비밀번호는 서버 비밀키를 섞은 해시로만 저장돼서, 저장소가 공개돼 있어도 `auth.json`으로 비밀번호를 알아낼 수 없어요.

---

## 처음 한 번만 하는 설정 (따님용)

Vercel → 이 프로젝트 → **Settings → Environment Variables** 에 아래 값을 넣고, 넣은 뒤 **다시 배포(Redeploy)** 해 주세요.

| 이름 | 값 | 필수 |
|---|---|---|
| `AUTH_SECRET` | 아무 긴 무작위 글자 (40자 이상). 아래 "비밀키 만들기" 참고 | ✅ |
| `GITHUB_TOKEN` | GitHub 토큰 (아래 1번) | ✅ |
| `ADMIN_SETUP_PASSWORD` | 처음 들어갈 때 쓸 임시 비밀번호 | ✅ (지우지 마세요: 비밀번호를 잊었을 때 다시 써요) |
| `GOOGLE_CLIENT_ID` | 구글 로그인용 ID (아래 2번) | 비밀번호 찾기용 |
| `ALLOWED_GOOGLE_EMAILS` | 비밀번호를 다시 만들 수 있는 구글 계정. 쉼표로 여러 개 (예: `엄마@gmail.com,나@gmail.com`) | 비밀번호 찾기용 |
| `GITHUB_REPO` | 기본값 `o-cup/artfolio` (저장소를 옮기면 바꿔요) | 선택 |
| `GITHUB_BRANCH` | 기본값 `main` | 선택 |

> ⚠️ `AUTH_SECRET`을 나중에 바꾸면 저장된 비밀번호가 맞지 않게 돼요. 그때는 아래 5번 방법으로 비밀번호를 새로 만들면 돼요.

**비밀키 만들기:** Mac의 터미널에서 아래를 실행하고 나온 글자를 그대로 복사해요.

```bash
openssl rand -base64 48
```

### 1. GitHub 토큰 만들기

1. GitHub → 오른쪽 위 프로필 → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
2. Resource owner: **o-cup**, Repository access: **Only select repositories → artfolio**
3. Permissions → Repository permissions → **Contents: Read and write**
4. Expiration은 가장 길게 (만료되면 저장이 안 돼요. 달력에 만료일을 적어 두세요)
5. 만든 토큰을 `GITHUB_TOKEN` 에 넣어요

> o-cup 조직이 fine-grained 토큰을 막아 두었다면, 조직 설정에서 허용하거나 친구분께 승인을 부탁해야 해요.

### 2. 구글 로그인 ID 만들기 (비밀번호를 잊었을 때)

1. https://console.cloud.google.com → 새 프로젝트 만들기 (이름 예: parkmejung-admin)
2. **APIs & Services → OAuth consent screen**: External, 앱 이름·이메일 입력. Test users에 어머님 Gmail과 내 Gmail 추가 (또는 Publish)
3. **Credentials → Create Credentials → OAuth client ID** → Application type: **Web application**
4. **Authorized JavaScript origins** 에 추가:
   - `https://www.parkmejung.com`
   - `https://parkmejung.com`
5. 만들어진 **Client ID**(…apps.googleusercontent.com)를 `GOOGLE_CLIENT_ID` 에 넣어요

### 3. Claude API 키 (자동 번역) — Vercel이 아니라 GitHub에 넣어요

번역은 GitHub Actions(`.github/workflows/translate.yml`)가 해요. 그래서 **Vercel 설정이 필요 없고**, 저장소 관리자 권한만 있으면 혼자 할 수 있어요.

1. https://console.anthropic.com 에서 결제 수단을 등록하고(월 사용 한도 예: $5), **API Keys → Create Key** 로 키를 만들어요 (`sk-ant-`로 시작, 한 번만 보여줘요)
2. GitHub 저장소 → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Secret: 복사한 키
3. 끝이에요. 다음에 관리 화면에서 저장하면 자동으로 번역돼요. 지금 바로 한 번 돌리려면 저장소 → **Actions → 자동 번역 → Run workflow**
4. 키가 없거나 번역이 실패해도 저장은 돼요. 그동안 영어 화면에 한국어가 보이고, 다음 저장 때(또는 Run workflow) 다시 번역을 시도해요.

> 번역이 안 되면 저장소 → **Actions** 탭에서 "자동 번역" 기록의 빨간 표시를 눌러 이유를 볼 수 있어요.

### 4. 처음 들어가기

1. `/admin` 에서 `ADMIN_SETUP_PASSWORD` 로 들어가요
2. 첫 화면 아래 **[비밀번호 변경]** 에서 어머님이 쓰실 비밀번호를 만들어요 (6글자 이상)
3. 만들고 나면 임시 비밀번호로는 들어올 수 없어요. 다만 비밀번호를 잊었을 때 다시 쓰이니 Vercel에서 지우지 마세요 (아래 5번)

### 5. 비밀번호를 잊었을 때

**환경변수 추가 없이 (지금 방식)**
1. GitHub 웹사이트에서 저장소의 `admin/auth.json` 파일을 지워요 (파일 열기 → 휴지통 아이콘 → Commit).
2. 2~3분 뒤 `/admin` 에서 Vercel에 넣어 둔 `ADMIN_SETUP_PASSWORD` 로 들어가요.
3. 첫 화면 아래 **[비밀번호 변경]** 에서 새 비밀번호를 만들어요.

> 그래서 Vercel의 `ADMIN_SETUP_PASSWORD` 는 지우지 말고 남겨 두세요.

**구글로 직접 찾기 (선택)**: `GOOGLE_CLIENT_ID`, `ALLOWED_GOOGLE_EMAILS` 를 넣고 Redeploy하면, 로그인 화면에 "비밀번호가 생각나지 않으세요?" 링크가 생겨요. 넣지 않으면 링크는 보이지 않아요.

---

## 내 컴퓨터에서 미리 테스트하기 (개발용)

Node.js가 설치돼 있어야 해요. 터미널 두 개에서 각각 실행해요.

```bash
npm run dev:api
```

```bash
npm start
```

브라우저에서 http://localhost:3000/admin → 임시 비밀번호 `test1234`.
이 모드에서는 GitHub이 아니라 **내 컴퓨터의 파일에 바로 저장**돼요. 테스트 후 `git status`로 확인하고 필요 없는 변경은 되돌려 주세요.

## 이번에 바뀐 사이트 코드

- 전시 데이터에 `images` 목록을 추가했어요 (예전엔 `1.jpeg ~ N.jpeg` 이름을 짐작했어요). 이제 사진 이름이 자유로워요.
- 사진 크게 보기(ModalViewer)도 `images` 목록을 써요.
- 첫 화면 목록은 `worksData.json`에서 바로 만들어요 (`mainData.json`은 지웠어요. 같은 내용을 두 번 관리할 필요가 없어요).
- `/admin` 화면은 따로 불러오기 때문에 일반 방문자의 사이트 속도에는 영향이 없어요.
