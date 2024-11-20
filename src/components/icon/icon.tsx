import { Icon, IconProps } from '@iconify/react';

export const IconifyIcon = ({ icon, ...rest }: IconProps) => {
	return <Icon aria-hidden={false} icon={icon} fontSize="1.375rem" {...rest} />;
};
