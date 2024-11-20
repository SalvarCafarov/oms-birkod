import MuiChip from '@mui/material/Chip';
import clsx from 'clsx';
import { useBgColor, UseBgColorType } from 'utils/use-bg-color';

import { CustomChipProps } from './types';

export const CustomChip = (props: CustomChipProps) => {
	const { sx, skin, color, rounded } = props;

	const bgColors = useBgColor();

	const colors: UseBgColorType = {
		primary: { ...bgColors.primaryLight },
		secondary: { ...bgColors.secondaryLight },
		success: { ...bgColors.successLight },
		error: { ...bgColors.errorLight },
		warning: { ...bgColors.warningLight },
		info: { ...bgColors.infoLight },
	};

	const propsToPass = { ...props };

	propsToPass.rounded = undefined;

	return (
		<MuiChip
			{...propsToPass}
			variant="filled"
			className={clsx({
				'MuiChip-rounded': rounded,
				'MuiChip-light': skin === 'light',
			})}
			sx={skin === 'light' && color ? Object.assign(colors[color], sx) : sx}
		/>
	);
};
