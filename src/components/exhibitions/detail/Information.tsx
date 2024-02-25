import styled from "styled-components";
import Text from "../../../shared/components/text";

type Props = {
	data: ExhibitionDataType;
};

const Information = ({ data }: Props) => {
	const { type, title, date, location } = data;

	return (
		<Styled.Information>
			<Text typography="body2" color="gray">
				{type}
			</Text>
			<Text typography="title1" color="black">
				{title}
			</Text>
			<Text typography="body2" color="black">
				{date}
			</Text>
			<Text typography="body2" color="black">
				{location}
			</Text>
		</Styled.Information>
	);
};

export default Information;

const Styled = {
	Information: styled.section`
		display: flex;
		flex-direction: column;
		padding: 0 12px;

		> span:first-child {
			margin-bottom: 6px;
			font-weight: bold;
		}

		> span:nth-child(2) {
			margin-bottom: 24px;
		}

		> span:last-child {
			margin-bottom: 32px;
		}
	`,
};
