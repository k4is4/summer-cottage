import { useEffect, useState } from "react";
import validateName from "../validators/validateName";
import validateComment from "../validators/validateComment";

const useItemValidation = (
	name: string,
	comment: string,
	existingNames: string[]
) => {
	const [nameError, setNameError] = useState("");
	const [commentError, setCommentError] = useState("");
	const [formSubmitted, setFormSubmitted] = useState(false);
	const commentMaxLength = 100;

	useEffect(() => {
		const existingNamesLowercase = existingNames.map((item) =>
			item.toLowerCase()
		);

		setNameError(validateName(name, existingNamesLowercase));
		setCommentError(validateComment(comment, commentMaxLength));
	}, [name, comment, existingNames]);

	return { nameError, commentError, formSubmitted, setFormSubmitted };
};

export default useItemValidation;
