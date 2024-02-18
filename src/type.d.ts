type Language = "ko" | "en";

interface WorkType {
	id: string;
	title: {
		en: string;
		ko?: string;
	};
	imageUrl: string;
	year: string;
}
