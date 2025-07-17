const validateDate = (startDate: Date, endDate: Date) => {
	if (endDate < startDate) {
		return "Lähtöpäivä ei voi olla ennen saapumista";
	} else {
		return "";
	}
};

export default validateDate;
