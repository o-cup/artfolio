import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface ModalContextType {
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	itemId: number | null;
	setItemId: (id: number | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
	children: ReactNode;
}

export const useModal = () => {
	const context = useContext(ModalContext);
	if (context === undefined) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [itemId, setItemId] = useState<number | null>(null);

	const openModal = () => setModalOpen(true);
	const closeModal = () => {
		setModalOpen(false);
		setItemId(null);
	};

	const value = useMemo(
		() => ({
			isModalOpen,
			openModal,
			closeModal,
			itemId,
			setItemId,
		}),
		[isModalOpen, itemId]
	);

	return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
