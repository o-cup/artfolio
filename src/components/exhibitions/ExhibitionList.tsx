import styled from "styled-components";
import ExhibitionListItem from "./ExhibitionListItem";
import { DESKTOP_DEVICE, MOBILE_DEVICE } from "../../styles/theme";

const ExhibitionList = () => {
	const PREFIX = `${process.env.PUBLIC_URL}/exhibitions`;

	const posterFiles = [
		{ id: "2019-1", url: `${PREFIX}/2019/2019-1/0_poster.png` },
		{
			id: "2019-2",
			url: `${PREFIX}/2019/2019-2/0_poster.jpeg`,
		},
		{
			id: "2019-3",
			url: `${PREFIX}/2019/2019-3/0_poster.jpeg`,
		},
		{ id: "2020-1", url: `${PREFIX}/2020/2020-1/0_poster.png` },
		{ id: "2020-2", url: `${PREFIX}/2020/2020-2/0_poster.jpg` },
		{ id: "2020-3", url: `${PREFIX}/2020/2020-3/0_poster.png` },
		{ id: "2021-1", url: `${PREFIX}/2021/2021-1/0_poster.jpeg` },
		{ id: "2021-2", url: `${PREFIX}/2021/2021-2/0_poster.jpeg` },
		{ id: "2023-1", url: `${PREFIX}/2023/2023-1/0_poster.png` },
		{ id: "2024-1", url: `${PREFIX}/2024/2024-1/0_poster.jpeg` },
	];

	return (
		<Styled.Wrap>
			{posterFiles.map((item) => (
				<ExhibitionListItem key={item.id} url={item.url} />
			))}
		</Styled.Wrap>
	);
};

export default ExhibitionList;

const Styled = {
	Wrap: styled.ul`
		display: flex;
		flex-wrap: wrap;

		@media screen and (${DESKTOP_DEVICE}) {
			column-gap: 24px;
			row-gap: 62px;
			padding: 32px 30px;
		}

		@media screen and (${MOBILE_DEVICE}) {
			justify-content: space-between;
			row-gap: 32px;
			padding: 0 12px;
		}
	`,
};
