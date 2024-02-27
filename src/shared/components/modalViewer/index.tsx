import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CloseButton from "./CloseButton";
import Portal from "../portal";
import { MOBILE_DEVICE } from "../../../styles/theme";
import { PREFIX } from "../../../components/exhibitions/exhibitionsData";
import Text from "../text";
import { useModal } from "../../../context/ModalProvider";

type Props = {
	totalCount: number;
};

const ModalViewer = ({ totalCount }: Props) => {
	const isMobile = useMediaQuery({ query: MOBILE_DEVICE });

	const { closeModal, itemId, setItemId } = useModal();

	const { id } = useParams<{ id: string }>();
	const imgUrl = `${PREFIX}/${id}/${itemId}.jpeg`;

	const handleCloseClick = () => {
		closeModal();
	};

	const handleLeftArrowClick = () => {
		if (!itemId) return;
		if (itemId === 1) return;

		setItemId(itemId - 1);
	};

	const handleRightArrowClick = () => {
		if (!itemId) return;
		if (totalCount === itemId) return;

		setItemId(itemId + 1);
	};

	return (
		<Portal>
			<Styled.Wrap>
				<CloseButton handleClick={handleCloseClick} />
				{isMobile ? (
					<StyledMobile.Wrap>
						<StyledMobile.Image src={imgUrl} alt={`${id}/${itemId}`} />
						<StyledMobile.LeftArrow />
						<StyledMobile.RightArrow />
						<StyledMobile.Count />
					</StyledMobile.Wrap>
				) : (
					<StyledDesktop.Wrap>
						<StyledDesktop.LeftArrow onClick={handleLeftArrowClick} />
						<StyledDesktop.RightArrow onClick={handleRightArrowClick} />
						<StyledDesktop.ImageWrap>
							<StyledDesktop.Image src={imgUrl} alt={`${id}/${itemId}`} />
							<StyledDesktop.Count>
								<Text typography="body2" customStyle={{ fontWeight: "bold" }}>
									{`${itemId}/${totalCount}`}
								</Text>
							</StyledDesktop.Count>
						</StyledDesktop.ImageWrap>
					</StyledDesktop.Wrap>
				)}
			</Styled.Wrap>
		</Portal>
	);
};

export default ModalViewer;

const Styled = {
	Wrap: styled.div`
		width: 100vw;
		height: 100vh;
		background-color: #f0f0ef;
		position: relative;
	`,
};

const StyledMobile = {
	Wrap: styled.div`
		display: flex;
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
