/* eslint-disable prettier/prettier */
export const extractRGB = (rgbString: string): string => {
	return rgbString.replace(/[^\d,]/g, '');
};
