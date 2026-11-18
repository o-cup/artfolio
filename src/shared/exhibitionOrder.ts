// 전시 순서: 시작일 기준 최신순 (사이트와 관리 화면이 같이 써요)
//
// 한국어 날짜 글자(예: "2025/6/21 - 2025/6/27")의 앞쪽(시작일)으로 정해요.
// - 연·월·일 → 그 날짜
// - 연·월만 (예: "2025/6") → 그 달 1일
// - 연도만 (예: "2025") → 그 해의 가장 이른 전시로 간주 (1월 1일보다도 앞).
//   그래서 최신순 화면에서는 그 해 전시들 중 맨 아래, 바로 앞 해 전시들 위에 와요.
// - 날짜를 못 읽으면 맨 뒤

const START = /^\s*(\d{4})(?:\s*[./-]\s*(\d{1,2}))?(?:\s*[./-]\s*(\d{1,2}))?/;

/** 클수록 최신. 정렬용 숫자 */
export function exhibitionSortKey(koDate: string): number {
	const m = START.exec(koDate || "");
	if (!m) return 0;
	const y = Number(m[1]);
	if (!m[2]) return y * 10000; // 연도만: 그 해의 어떤 날짜보다도 이르게
	const month = Number(m[2]);
	const day = m[3] ? Number(m[3]) : 1; // 연·월만: 1일로
	return y * 10000 + month * 100 + day;
}

/** 최신순으로 정렬한 새 배열. 시작일이 같으면 나중에 등록한 것(번호가 큰 것)이 앞 */
export function sortExhibitionsNewestFirst<T extends { id: string }>(list: T[], koDate: (x: T) => string): T[] {
	return [...list].sort((a, b) => {
		const d = exhibitionSortKey(koDate(b)) - exhibitionSortKey(koDate(a));
		if (d !== 0) return d;
		return Number(b.id) - Number(a.id) || b.id.localeCompare(a.id);
	});
}
