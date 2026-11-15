// GitHub 자동 번역: 관리 화면에서 저장한 뒤, 영어가 아직 한국어 그대로인 칸만 골라 영어로 번역해요.
// GitHub Actions(.github/workflows/translate.yml)가 실행하고, 바뀐 게 있으면 커밋해요.
// 키(ANTHROPIC_API_KEY)는 GitHub 저장소 Settings → Secrets 에 넣어요. (Vercel 설정은 필요 없어요)
//
// 번역 대상: 한국어에 한글이 있고, 영어 칸이 비어 있거나 한국어와 똑같은 칸
//   (관리 화면은 번역을 못 하면 영어 칸에 한국어를 그대로 넣어요. 직접 쓴 영어는 건드리지 않아요.)
//
// 사용법: node scripts/translate-data.js          → 번역하고 파일 저장
//        node scripts/translate-data.js --dry    → 번역할 칸만 보여주고 저장 안 함 (키 없어도 돼요)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FILES = {
	works: "src/components/works/worksData.json",
	exhibitions: "src/components/exhibitions/exhibitionsData.json",
	about: "src/components/about/aboutData.json",
};
const HANGUL = /[가-힣]/;
const dry = process.argv.includes("--dry");

const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const write = (rel, data) => fs.writeFileSync(path.join(ROOT, rel), `${JSON.stringify(data, null, 2)}\n`);

/** 번역이 필요한 칸들을 모아요. 각 칸은 { label, ko, set(en) } */
function collect(data) {
	const todo = [];
	const add = (label, ko, en, set) => {
		if (typeof ko !== "string" || !HANGUL.test(ko)) return;
		if (typeof en === "string" && en.trim() && en !== ko) return; // 이미 영어가 있어요
		todo.push({ label, ko, set });
	};

	// 작업 / 전시: id로 짝을 맞춰요
	const pairById = (key, fields) => {
		const { ko, en } = data[key];
		ko.forEach((k, i) => {
			const e = en.find((x) => x.id === k.id) || en[i];
			if (!e) return;
			fields.forEach((f) => add(`${key} ${k.id} ${f}`, k[f], e[f], (v) => (e[f] = v)));
		});
	};
	pairById("works", ["title", "description"]);
	pairById("exhibitions", ["type", "title", "date", "location"]);

	// 소개·이력: 순서대로 짝을 맞춰요
	const { ko: aKo, en: aEn } = data.about;
	add("about name", aKo.artist.name, aEn.artist.name, (v) => (aEn.artist.name = v));
	add("about intro", aKo.artist.about, aEn.artist.about, (v) => (aEn.artist.about = v));
	aKo.histories.forEach((h, i) => {
		const e = aEn.histories[i];
		if (!e) return;
		add(`about category ${i + 1}`, h.title, e.title, (v) => (e.title = v));
		h.details.forEach((d, j) => add(`about category ${i + 1} line ${j + 1}`, d, e.details[j], (v) => (e.details[j] = v)));
	});
	return todo;
}

async function main() {
	const data = Object.fromEntries(Object.entries(FILES).map(([k, rel]) => [k, read(rel)]));
	const todo = collect(data);
	console.log(`번역할 칸: ${todo.length}개`);
	todo.forEach((t) => console.log(`  - ${t.label}: ${t.ko.slice(0, 40).replace(/\n/g, " ")}`));
	if (todo.length === 0 || dry) return;

	if (!process.env.ANTHROPIC_API_KEY) {
		console.log("ANTHROPIC_API_KEY가 없어서 번역을 건너뛰어요. (GitHub Settings → Secrets 에 넣어 주세요)");
		return;
	}

	// eslint-disable-next-line global-require
	const { translateItems } = require("../api/_lib/translator");
	// 한 번에 너무 많지 않게 나눠서 번역해요
	const BATCH = 60;
	for (let i = 0; i < todo.length; i += BATCH) {
		const chunk = todo.slice(i, i + BATCH);
		// eslint-disable-next-line no-await-in-loop
		const translations = await translateItems(chunk.map((t) => t.ko));
		chunk.forEach((t, j) => {
			if (translations[j] && translations[j].trim()) t.set(translations[j]);
		});
	}
	Object.entries(FILES).forEach(([k, rel]) => write(rel, data[k]));
	console.log("번역을 저장했어요.");
}

main().catch((e) => {
	console.error("자동 번역 실패:", e.message);
	process.exit(1);
});
