import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import { MOBILE_DEVICE } from "../../../styles/theme";
import CloseButton from "./CloseButton";
import exhibitionsData, { PREFIX } from "../../../components/exhibitions/exhibitionsData";
import Text from "../text";

const DetailView = () => {
	const navigate = useNavigate();
	const isMobile = useMediaQuery({ query: MOBILE_DEVICE });

	const { id, subId } = useParams<{ id: string; subId: string }>();
	if (!id || !subId) return null;
	const formattedSubId = parseInt(subId, 10).toString();

	const data = exhibitionsData.kr.find((item) => item.id === id);
	if (!data) return null;
	const totalCount = data?.exhibitionPhotoCount;

	const handleRightArrowClick = () => {
		const nextSubId = parseInt(subId, 10) + 1;
		const formattedNextSubId = nextSubId < 10 ? `0${nextSubId}` : nextSubId.toString();

		if (nextSubId > totalCount) return;
		navigate(`/exhibitions/${id}/${formattedNextSubId}`);
	};

	const handleLeftArrowClick = () => {
		const prevSubId = parseInt(subId, 10) - 1;
		const formattedPrevSubId = prevSubId < 10 ? `0${prevSubId}` : prevSubId.toString();
    
		if (prevSubId < 1) return;
		navigate(`/exhibitions/${id}/${formattedPrevSubId}`);
	};

	const imgUrl = `${PREFIX}/${id}/${formattedSubId}.jpeg`;

	return (
		<Styled.Wrap>
			<CloseButton />
			{isMobile ? (
				<StyledMobile.Wrap>
					<StyledMobile.Image src={imgUrl} alt={`${id}/${subId}`} />
					<StyledMobile.LeftArrow />
					<StyledMobile.RightArrow />
					<StyledMobile.Count />
				</StyledMobile.Wrap>
			) : (
				<StyledDesktop.Wrap>
					<StyledDesktop.LeftArrow onClick={handleLeftArrowClick} />
					<StyledDesktop.RightArrow onClick={handleRightArrowClick} />
					<StyledDesktop.ImageWrap>
						<StyledDesktop.Image src={imgUrl} alt={`${id}/${subId}`} />
						<StyledDesktop.Count>
							<Text typography="body2" customStyle={{ fontWeight: "bold" }}>
								{`${formattedSubId}/${totalCount}`}
							</Text>
						</StyledDesktop.Count>
					</StyledDesktop.ImageWrap>
				</StyledDesktop.Wrap>
			)}
		</Styled.Wrap>
	);
};

export default DetailView;

const Styled = {
	Wrap: styled.div`
		background-color: #f0f0ef;
	`,
};

const StyledMobile = {
	Wrap: styled.div`
		display: flex;
		border: 1px solid blue;
		width: 100%;
		height: 100%;
		align-items: center;
	`,
	Image: styled.img`
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	`,
	LeftArrow: styled.span`
		position: absolute;
		/* top: 50%;
		left: 0;
		transform: translateY(-50%); */
		width: 24px;
		height: 24px;
		background-color: rgba(0, 0, 0, 0.5);
		background-image: url("/icons/left-arrow.svg") no-repeat;
		background-size: 24px;
		border: 1px solid red;
	`,
	RightArrow: styled.img`
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		width: 50px;
		height: 50px;
		/* background-color: rgba(0, 0, 0, 0.5); */
	`,
	Count: styled.div`
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		/* background-color: rgba(0, 0, 0, 0.5); */
	`,
};

const StyledDesktop = {
	Wrap: styled.div`
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		position: relative;
	`,
	LeftArrow: styled.span`
		width: 48px;
		height: 48px;
		background-image: url("/icons/left-arrow.svg");
		background-size: contain;
		cursor: pointer;
		position: absolute;
		top: 50%;
		left: 32px;
		transform: translateY(-50%);
	`,
	RightArrow: styled.span`
		width: 48px;
		height: 48px;
		background-image: url("/icons/right-arrow.svg");
		background-size: contain;
		cursor: pointer;
		position: absolute;
		top: 50%;
		right: 32px;
		transform: translateY(-50%);
	`,
	ImageWrap: styled.div`
		max-height: 85vh;
		max-width: 85vw;
		height: 100%;
		position: relative;
	`,
	Image: styled.img`
		width: 100%;
		height: 100%;
		object-fit: contain;
	`,
	Count: styled.div`
		position: absolute;
		bottom: -24px;
		right: 0;
	`,
};
