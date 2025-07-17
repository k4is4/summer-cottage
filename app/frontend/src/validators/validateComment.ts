const validateComment = (comment: string, maxLength: number) => {
	if (comment.length > maxLength) {
		return `Kommentti voi olla enintään ${maxLength} merkkiä`;
	} else {
		return "";
	}
};

export default validateComment;
