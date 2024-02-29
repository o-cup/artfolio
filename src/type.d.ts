type Language = "ko" | "en";

interface MainWorkType {
	id: string;
	title: string;
	imageUrl: string;
	year: string;
}

interface WorkDetailType {
	id: string;
	title: string;
	year: string;
	description: string;
	images: string[];
  imgCount: number;
}
