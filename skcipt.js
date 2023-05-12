const input = document.getElementById("file-input");
const carrierCount = document.getElementById("list-count");
const inputNotes = document.getElementById("input-notes");
const boxForText = document.getElementById("text-box");
const txtBtn = document.getElementById("txt-btn");
const recordsLimit = document.getElementById("max-phones");
const showNumbers = document.getElementById("print-numbers");
const carrierBox = document.getElementById("carrier-list");
const companiesTableBody = document.getElementById("companies-table-body");
const popup = document.getElementById("popup");

/// get numbers for txt messages
recordsLimit.addEventListener("change", (e) => {
	e.preventDefault();
	if (e.target.value > 99) e.target.value = 99;
	if (e.target.value < 2) e.target.value = 2;
});

txtBtn.addEventListener("click", (e) => {
	e.preventDefault();
	showNumbers.innerHTML = "";
	const myButtons = document.querySelectorAll("#phone-number");
	const phoneNumbers = [];
	Array.from(myButtons).forEach((button) => {
		if (!button.classList.contains("btn-danger") && phoneNumbers.length < recordsLimit.value) {
			button.classList.replace("btn-success", "btn-danger");
			phoneNumbers.push(button.textContent.trim());
		}
	});
	console.log(phoneNumbers.length);
	recordsLimit.value = phoneNumbers.length;
	const phoneNumbersString = phoneNumbers.join(", ");
	printNumbers(phoneNumbersString);
});

const printNumbers = (numbers) => {
	const print = document.createElement("a");
	print.innerHTML = numbers;
	showNumbers.appendChild(print);
	showNumbers.style.display = "block";
	print.addEventListener("click", (e) => {
		e.preventDefault();
		const myNum = numbers;
		navigator.clipboard
			.writeText(myNum)
			.then(() => console.log("Текст скопирован в буфер обмена"))
			.catch((error) => alert("Ошибка копирования текста: ", error));
		popup.style.display = "block";
		setTimeout(() => {
			popup.style.display = "none";
		}, 2000);
	});
};

/// print maim list
const carrierViwe = (company, count) => {
	const date = new Date(company.joinDate).toLocaleDateString();
	const row = document.createElement("tr");
	const countCell = document.createElement("td");
	const companyNameCell = document.createElement("td");
	const phoneCell = document.createElement("td");
	const emailCell = document.createElement("td");
	const addressCell = document.createElement("td");
	const joinDateCell = document.createElement("td");
	const getNum = document.createElement("button");

	row.className = "my-table";
	getNum.className = "num-link btn btn-success";
	getNum.id = "phone-number";
	getNum.type = "button";

	countCell.textContent = count;
	companyNameCell.textContent = company.companyName;
	getNum.innerHTML = company.phone;
	emailCell.textContent = company.email;
	addressCell.textContent = company.address;
	joinDateCell.textContent = date;

	getNum.addEventListener("click", (e) => {
		e.preventDefault();
		const myNum = company.phone;
		navigator.clipboard.writeText(myNum);
		popup.style.display = "block";
		getNum.className = getNum.className.replace("btn-success", "btn-danger");
		setTimeout(() => {
			popup.style.display = "none";
		}, 2000);
	});

	phoneCell.appendChild(getNum);
	row.appendChild(countCell);
	row.appendChild(companyNameCell);
	row.appendChild(phoneCell);
	row.appendChild(emailCell);
	row.appendChild(addressCell);
	row.appendChild(joinDateCell);

	return row;
};

const carrierList = (data) => {
	data.forEach((item, index) => {
		const row = carrierViwe(item, index + 1);
		companiesTableBody.appendChild(row);
	});
};

/// get file
input.addEventListener("change", () => {
	const file = input.files[0];
	const reader = new FileReader();

	reader.addEventListener("load", () => {
		const fileContent = reader.result;
		const parsedJson = JSON.parse(fileContent);
		inputNotes.style.display = "none";
		carrierBox.style.display = "flex";
		input.style.display = "none";
		boxForText.style.display = "flex";
		carrierList(parsedJson);
		carrierCount.innerHTML = parsedJson.length;
	});

	reader.readAsText(file);
});
