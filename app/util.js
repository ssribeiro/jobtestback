const util = {
  //function to add days to a given date.
  addDays: (startDate,numberOfDays) => {
		let returnDate = new Date(
      startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate()+numberOfDays,
			startDate.getHours(),
			startDate.getMinutes(),
			startDate.getSeconds()
    );
		return returnDate;
	}
};

module.exports = util;
