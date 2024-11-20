import { styled } from '@mui/material/styles';
import { forwardRef, ReactNode, useEffect } from 'react';

type PageProps = {
	children: ReactNode;
	title?: string;
	className?: string;
};

const Root = styled('div')(() => ({
	minHeight: '100%',
}));

export const Page = forwardRef<HTMLDivElement, PageProps>(({ children, title, ...props }, ref) => {
	const pageTitle = `${import.meta.env.VITE_PROJECT_NAME}${title ? ' | ' + title : ''}`;

	useEffect(() => {
		document.title = pageTitle;
	}, [pageTitle]);

	return (
		<Root ref={ref} {...props}>
			{children}
		</Root>
	);
});

Page.displayName = 'Page';
