export class Result<T> {
	private constructor(result: Partial<Result<T>>) {
		Object.assign(this, result);
	}
	
	static success<T> (code?: number): Result<T>;
	static success<T> (content: T): Result<T>;
	static success<T> (code: number, content: T): Result<T>;
	static success<T> (code = 200, content?: T) {
		if (typeof code === "number" && !content) {
			return new Result<T>({
				success: true,
				code: code
			});
		}

		if (typeof code !== "number" && !content) {
			return new Result<T>({
				success: true,
				content: code
			});
		}


		return new Result<T>({
			success: true,
			content,
			code: code ?? 200
		});
	}
	
	static fail<T> (code?: number): Result<T>;
	static fail<T> (content: T ): Result<T>;
	static fail<T> (code: number, content: T ): Result<T>;
	static fail<T> (code = 400, content?: T ) {
		if (typeof code === "number" && !content) {
			return new Result<T>({
				success: false,
				code: code
			});
		}

		if (typeof code !== "number" && !content) {
			return new Result<T>({
				success: false,
				content: code
			});
		}

		return new Result<T>({
			success: false,
			content,
			code
		})
	}

	success = true;
	code!: number;
	content?: T;
}