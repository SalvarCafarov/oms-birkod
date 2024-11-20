import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Icon from 'components/icon';
import { Settings } from 'configs/context/types';
import { useTranslation } from 'react-i18next';

import { NavSectionTitle as NavSectionTitleType } from '../../types';

interface Props {
	settings: Settings;
	item: NavSectionTitleType;
	collapsedNavWidth: number;
	navigationBorderWidth: number;
}

const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component="li" {...props} />)(
	({ theme }) => ({
		lineHeight: 1,
		display: 'flex',
		position: 'static',
		marginTop: theme.spacing(3.5),
		paddingTop: theme.spacing(1.5),
		backgroundColor: 'transparent',
		paddingBottom: theme.spacing(1.5),
		transition: 'padding-left .25s ease-in-out',
	}),
);

const NavSectionTitle = (props: Props) => {
	const { t } = useTranslation();

	const { item, settings, collapsedNavWidth, navigationBorderWidth } = props;

	const { navCollapsed } = settings;

	return (
		<ListSubheader
			className="nav-section-title"
			sx={{
				...(navCollapsed ? { py: 0.5, px: (collapsedNavWidth - navigationBorderWidth - 22) / 8 } : { px: 7.5 }),
				'& .MuiTypography-root, & svg': {
					color: 'text.disabled',
				},
			}}
		>
			{navCollapsed ? (
				<Icon icon="tabler:separator" />
			) : (
				<Typography noWrap variant="caption" sx={{ textTransform: 'uppercase' }}>
					{t(`navigation:${item.sectionTitle}`)}
				</Typography>
			)}
		</ListSubheader>
	);
};

export default NavSectionTitle;
