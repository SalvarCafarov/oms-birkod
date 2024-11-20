import { ConfirmDialog, ConfirmDialogType } from 'components/confirm-dialog';
import { createContext, ReactNode, useContext, useState } from 'react';

type ConfirmType = {
	open: boolean;
	confirmText?: string;
	confirmButtonText?: string;
	description?: string;
	name?: string;
	onConfirm: () => void;
	type?: ConfirmDialogType;
};

type ConfirmationContextProps = {
	confirm: ({
		confirmText,
		confirmButtonText,
		description,
		name,
		onConfirm,
		type,
	}: Omit<ConfirmType, 'open'>) => void;
};

const ConfirmationContext = createContext<ConfirmationContextProps>({
	confirm: () => {},
});

const DEFAULT_CONFIRM_STATE: ConfirmType = {
	type: 'error',
	open: false,
	confirmText: '',
	confirmButtonText: '',
	onConfirm: () => {},
};

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
	const [confirmProp, setConfirmProps] = useState<ConfirmType>(DEFAULT_CONFIRM_STATE);

	const confirm = ({
		confirmText,
		confirmButtonText,
		description,
		type,
		onConfirm,
		name,
	}: Omit<ConfirmType, 'open'>): void => {
		const newState = {
			open: true,
			confirmText: confirmText || DEFAULT_CONFIRM_STATE.confirmText,
			confirmButtonText: confirmButtonText || DEFAULT_CONFIRM_STATE.confirmText,
			description: description || DEFAULT_CONFIRM_STATE.description,
			name: name,
			type: type,
			onConfirm: (): void => {
				setConfirmProps(DEFAULT_CONFIRM_STATE);
				onConfirm();
			},
		};
		setConfirmProps(newState);
	};

	const onDialogClose = (): void => {
		setConfirmProps({ ...DEFAULT_CONFIRM_STATE });
	};

	return (
		<ConfirmationContext.Provider value={{ confirm }}>
			{children}
			<ConfirmDialog {...confirmProp} onClose={onDialogClose} />
		</ConfirmationContext.Provider>
	);
};

export const useConfirmation = (): ConfirmationContextProps =>
	useContext<ConfirmationContextProps>(ConfirmationContext);
