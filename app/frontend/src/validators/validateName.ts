const validateName = (name: string, existingNames: string[]) => {
	const trimmedName = name.trim().toLowerCase();
	if (name.trim() === "") {
		return "Nimi ei voi olla tyhjä";
	} else if (name.length < 2 || name.length > 30) {
		return "Nimen pitää olla vähintään 2-30 merkkiä";
	} else if (existingNames.includes(trimmedName)) {
		return "Nimi on jo listassa";
	} else {
		return "";
	}
};

export default validateName;
