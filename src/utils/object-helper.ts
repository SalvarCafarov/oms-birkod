// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepOmit<T, K extends keyof any> = {
	[P in keyof T as P extends K ? never : P]: T[P] extends object ? DeepOmit<T[P], K> : T[P];
};

export function deepOmit<T, K extends keyof T>(obj: T, keys: K[]): DeepOmit<T, K> {
	if (typeof obj !== 'object' || obj === null) {
		return obj as DeepOmit<T, K>;
	}

	const result = Array.isArray(obj) ? [] : {};

	Object.entries(obj).forEach(([key, value]) => {
		if (!keys.includes(key as K)) {
			result[key] = typeof value === 'object' ? deepOmit(value, keys) : value;
		}
	});

	return result as DeepOmit<T, K>;
}

export const deepReplaceNullWithUndefined = <T>(input: T): T => {
	if (!input) {
		return input;
	}

	const replacer = (key: string, value) => {
		if (key && value === null) {
			return undefined;
		}

		return value;
	};

	return JSON.parse(JSON.stringify(input, replacer));
};
