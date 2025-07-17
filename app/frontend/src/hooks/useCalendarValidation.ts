import { useEffect, useState } from "react";
import validateDate from "../validators/validateDate";
import validateComment from "../validators/validateComment";

const useCalendarValidation = (
	startDate: Date,
	endDate: Date,
	comment: string
) => {
	const [dateError, setDateError] = useState("");
	const [commentError, setCommentError] = useState("");
	const [formSubmitted, setFormSubmitted] = useState(false);
	const commentMaxLength = 200;

	useEffect(() => {
		setDateError(validateDate(startDate, endDate));
		setCommentError(validateComment(comment, commentMaxLength));
	}, [startDate, endDate, comment]);

	return { dateError, commentError, formSubmitted, setFormSubmitted };
};

export default useCalendarValidation;
