import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CloseButton from "./CloseButton";
import Portal from "../portal";
import { MOBILE_DEVICE } from "../../../styles/theme";
import Text from "../text";
import { useModal } from "../../../context/ModalProvider";
import Motion from "../motion";

type Props = {
	category: "works" | "exhibitions";
	totalCount: number;
};

const ModalViewer = ({ category, totalCount }: Props) => {
	const isMobile = useMediaQuery({ query: MOBILE_DEVICE });
	const { id } = useParams<{ id: string }>();

	const { closeModal, itemId, setItemId } = useModal();

	const PREFIX = `${process.env.PUBLIC_URL}/${category}`;
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

	const renderPageCount = () => (
		<Text typography="body2" customStyle={{ fontWeight: "bold" }}>
			{`${itemId}/${totalCount}`}
		</Text>
	);

	return (
		<Portal>
			<Motion>
				<Styled.Wrap>
					<CloseButton handleClick={handleCloseClick} />
					{isMobile ? (
						<StyledMobile.Wrap>
							<StyledMobile.PageWrap>
								<StyledMobile.LeftArrow onClick={handleLeftArrowClick} />
								<StyledMobile.Count>{renderPageCount()}</StyledMobile.Count>
								<StyledMobile.RightArrow onClick={handleRightArrowClick} />
							</StyledMobile.PageWrap>
							<StyledMobile.Image src={imgUrl} alt={`${id}/${itemId}`} />
						</StyledMobile.Wrap>
					) : (
						<StyledDesktop.Wrap>
							<StyledDesktop.LeftArrow onClick={handleLeftArrowClick} />
							<StyledDesktop.RightArrow onClick={handleRightArrowClick} />
							<StyledDesktop.ImageWrap>
								<StyledDesktop.Image src={imgUrl} alt={`${id}/${itemId}`} />
								<StyledDesktop.Count>{renderPageCount()}</StyledDesktop.Count>
							</StyledDesktop.ImageWrap>
						</StyledDesktop.Wrap>
					)}
				</Styled.Wrap>
			</Motion>
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
		position: relative;
	`,
	PageWrap: styled.div`
		position: absolute;
		top: 16px;
		left: 6px;
		display: flex;
		z-index: 999;
	`,
	LeftArrow: styled.span`
		width: 24px;
		height: 24px;
		background-image: url("/icons/left-arrow.svg");
	`,
	RightArrow: styled.span`
		width: 24px;
		height: 24px;
		background-image: url("/icons/right-arrow.svg");
	`,
	Count: styled.div`
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 3px;
	`,
	Image: styled.img`
		width: 100%;
		object-fit: cover;
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
