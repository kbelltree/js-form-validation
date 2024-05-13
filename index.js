const errorMessages = {
  email: {
    required: "Please enter a valid e-mail address.",
    type: "Valid format is 'example@email.com'",
    pattern:
      "Please enter a valid email address in the format 'example@email.com'.",
  },

  country: {
    required: "Please select a country.",
  },

  zip: {
    required: "Please enter a valid zip-code.",
    pattern:
      "Zip code must be up to 10 alphanumeric characters and may include spaces and/or a hyphen.",
  },

  password1: {
    required: "Please set up a password between 8 and 20 characters.",
    pattern:
      "Password must be 8-20 characters long and can include uppercase, lowercase letters, numbers, and special characters (#?!@$%^&*-).",
    length: "Please enter within 8 to 20 characters.",
  },

  password2: {
    required: "Please re-enter your password for confirmation.",
    mismatch: "Passwords do not match. Please try again.",
  },
};

function getMatchingErrorMessages(controlEl, messageObj) {
  const errorMessageArr = [];
  if (controlEl.validity.valueMissing) {
    errorMessageArr.push(messageObj.required);
  }
  if (controlEl.validity.typeMismatch) {
    errorMessageArr.push(messageObj.type);
  }
  if (controlEl.validity.patternMismatch) {
    errorMessageArr.push(messageObj.pattern);
  }
  if (controlEl.validity.tooShort || controlEl.validity.tooLong) {
    errorMessageArr.push(messageObj.length);
  }
  if (controlEl.dataset.password === "invalid") {
    errorMessageArr.push(messageObj.mismatch);
  }
  return errorMessageArr;
}

function confirmPasswordsMatch(pw2ControlEl) {
  const pw1Value = document.getElementById("password1").value;
  const pw2Value = pw2ControlEl.value;
  const isMatch = pw1Value === pw2Value;
  if (!isMatch) {
    pw2ControlEl.dataset.password = "invalid";
  } else {
    pw2ControlEl.dataset.password = "";
  }
  return isMatch;
}

function accessErrorMessageDiv(controlElId) {
  if (!controlElId) {
    console.warn(`controlElId can not be found: ${controlElId}.`);
    return;
  }
  return document.querySelector(`#${controlElId} + .error-message`);
}

function emptyErrorMessageDiv(errorMessageDivEl) {
  while (errorMessageDivEl.firstChild) {
    errorMessageDivEl.removeChild(errorMessageDivEl.firstChild);
  }
}

function displayErrorMessage(errorMessageDiv, messageArr) {
  if (messageArr.length === 0) {
    console.warn(`There are not any validation error messages to display.`);
    return;
  } else {
    errorMessageDiv;
    messageArr.forEach((message) => {
      const para = document.createElement("p");
      para.textContent = message;
      errorMessageDiv.appendChild(para);
    });
  }
  return errorMessageDiv;
}

function notifyInvalidEntry(controlEl) {
  const controlElId = controlEl.id;
  const errorMessageDiv = accessErrorMessageDiv(controlElId);
  const messagesArr = getMatchingErrorMessages(
    controlEl,
    errorMessages[controlElId],
  );

  emptyErrorMessageDiv(errorMessageDiv);
  displayErrorMessage(errorMessageDiv, messagesArr);
  controlEl.classList.remove("is-valid");
}

function validateEntry(e) {
  e.preventDefault();
  const controlEl = e.target;
  let doPasswordsMatch = false;
  if (controlEl.id === "password2") {
    doPasswordsMatch = confirmPasswordsMatch(controlEl);
  }
  if (!controlEl.checkValidity() || !doPasswordsMatch) {
    notifyInvalidEntry(controlEl);
  } else {
    controlEl.classList.add("is-valid");
  }
}

function validateForm(e) {
  const form = e.target;
  const formControls = form.querySelectorAll("input, select");
  const pw2ControlEl = form.querySelector("#password2");
  const doPasswordsMatch = confirmPasswordsMatch(pw2ControlEl);

  if (!form.checkValidity() || !doPasswordsMatch) {
    formControls.forEach((controlEl) => notifyInvalidEntry(controlEl));
    console.warn(`Submission cancelled.`);
    // set preventDefault() to keep from submitting the form
    e.preventDefault();
  }
}

function refreshForm(formEl) {
  errorMessageDivs.forEach((div) => emptyErrorMessageDiv(div));
  formEl.reset();
}

const errorMessageDivs = document.querySelectorAll(".error-message");
const formControls = document.querySelectorAll("input, select");
const form = document.querySelector("form");
const resetButton = document.querySelector("#form-reset");

refreshForm(form);

formControls.forEach((controlEl) => {
  controlEl.addEventListener("blur", validateEntry);
  controlEl.addEventListener("input", () => {
    const errorMessageDiv = accessErrorMessageDiv(controlEl.id);
    emptyErrorMessageDiv(errorMessageDiv);
  });
});
form.addEventListener("submit", validateForm);
resetButton.addEventListener("click", () => {
  refreshForm(form);
});
