import styled from "styled-components";

type Props = {
	data: ExhibitionDataType;
};

const Poster = ({ data }: Props) => (
	<Styled.Poster>
		<Styled.Image src={data.imgUrl} />
	</Styled.Poster>
);

export default Poster;

const Styled = {
	Poster: styled.section`
		margin-bottom: 32px;
		display: flex;
		justify-content: center;
	`,
	Image: styled.img`
		width: 80%;
		border: 1px solid red;
	`,
};
