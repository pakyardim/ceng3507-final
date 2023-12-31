class Lecture {
  constructor(name, grading) {
    this.name = name;
    this.grading = grading;
  }
}

class Student {
  constructor(id, name, surname, studentLectures) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.studentLectures = studentLectures;
  }
}

const lectures = [];
const students = [];

// UI Part
const addStudentModalBtn = document.getElementById("add-student-modal-btn");
const addLectureModalBtn = document.getElementById("add-lecture-modal-btn");
const overlay = document.querySelector(".overlay");

const addStudentModal = document.getElementById("student-modal");
const editStudentModal = document.getElementById("edit-student-modal");
const studentSearchModal = document.getElementById("student-search-modal");
const addLectureModal = document.getElementById("lecture-modal");
const searchStudent = document.getElementById("search-by-id");

const addLectureForm = document.getElementById("add-lecture-form");
const addStudentForm = document.getElementById("add-student-form");
const editStudentForm = document.getElementById("edit-student-form");

const selectLecture = document.getElementById("lecture-select");
const filterSelect = document.getElementById("filter-select");
const studentTable = document.getElementById("student-table");

const gradingSystemText = document.getElementById("grading-system-text");
const numberOfStudentsText = document.getElementById("num-of-studs");
const numberOfPassedText = document.getElementById("num-of-passed");
const numberOfFailedText = document.getElementById("num-of-failed");
const meanScoreText = document.getElementById("mean-score");
const studentDetailTable = document.getElementById("student-detail-table");
const lectureNameP = document.getElementById("add-student-modal-lecture-name");
const eLectureNameP = document.getElementById(
  "edit-student-modal-lecture-name"
);

const studentDetailName = document.getElementById("student-detail-name");
const gpa = document.getElementById("gpa");
const closeDetails = document.getElementById("close-details");

const renderLectures = () => {
  // reset the select options
  selectLecture.innerHTML = "";

  // render the lectures
  lectures.forEach((lecture) => {
    const option = document.createElement("option");
    option.value = lecture.name;
    option.innerHTML = lecture.name;
    selectLecture.appendChild(option);
  });
};

const renderStudentDetails = (studentLectures) => {
  // reset the table
  studentDetailTable.innerHTML = "";

  studentLectures.forEach((lecture) => {
    const row = document.createElement("tr");
    const tdLecture = document.createElement("td");
    tdLecture.textContent = lecture.name;
    row.appendChild(tdLecture);

    const tdMidterm = document.createElement("td");
    tdMidterm.textContent = lecture.midtermScore;
    row.appendChild(tdMidterm);

    const tdFinal = document.createElement("td");
    tdFinal.textContent = lecture.finalScore;
    row.appendChild(tdFinal);

    const tdGrade = document.createElement("td");
    tdGrade.textContent = lecture.grade;
    row.appendChild(tdGrade);

    studentDetailTable.appendChild(row);
  });
};

const renderStudents = (lectureName, passedSituation) => {
  // reset the table
  studentTable.innerHTML = "";

  //find the students who takes the selected lecture
  let studentsTakingTheLecture = students.filter((student) => {
    const studentLectures = student.studentLectures;
    const lectureIndex = studentLectures.findIndex(
      (l) => l.name === lectureName
    );

    // if the student doesn't take the lecture, gets filtered out
    return lectureIndex !== -1;
  });

  const passedStudents = studentsTakingTheLecture.filter((student) => {
    const studentLectures = student.studentLectures;
    const lectureIndex = studentLectures.findIndex(
      (l) => l.name === lectureName
    );
    // if the student failed the class, gets filtered out
    return studentLectures[lectureIndex].grade !== "F";
  });

  const failedStudents = studentsTakingTheLecture.filter((student) => {
    const studentLectures = student.studentLectures;
    const lectureIndex = studentLectures.findIndex(
      (l) => l.name === lectureName
    );

    // if the student passed the class, gets filtered out
    return studentLectures[lectureIndex].grade === "F";
  });

  if (studentsTakingTheLecture.length === 0) {
    numberOfStudentsText.innerHTML = 0;
    numberOfPassedText.innerHTML = 0;
    numberOfFailedText.innerHTML = 0;
    meanScoreText.innerHTML = 0;
    return;
  }

  numberOfStudentsText.innerHTML = studentsTakingTheLecture.length;
  numberOfPassedText.innerHTML = passedStudents.length;
  numberOfFailedText.innerHTML = failedStudents.length;

  // calculate the mean score
  const totalScore = studentsTakingTheLecture.reduce((acc, student) => {
    const midtermWeight = 0.4;
    const finalWeight = 0.6;

    // calculate the weighted average
    const studentLectures = student.studentLectures;
    const lectureIndex = studentLectures.findIndex(
      (l) => l.name === lectureName
    );

    const midtermScore = studentLectures[lectureIndex].midtermScore;
    const finalScore = studentLectures[lectureIndex].finalScore;

    const weightedPoint =
      midtermScore * midtermWeight + finalScore * finalWeight;
    return acc + weightedPoint;
  }, 0);

  const meanScore = totalScore / studentsTakingTheLecture.length;
  meanScoreText.innerHTML = meanScore.toFixed(2);

  if (passedSituation === "passed") {
    studentsTakingTheLecture = passedStudents;
  } else if (passedSituation === "failed") {
    studentsTakingTheLecture = failedStudents;
  }

  // render the students
  studentsTakingTheLecture.forEach((student) => {
    const studentLectures = student.studentLectures;
    const studentLectureIndex = studentLectures.findIndex(
      (l) => l.name === lectureName
    );

    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    tdId.textContent = student.id;
    tr.appendChild(tdId);

    const tdName = document.createElement("td");
    tdName.textContent = student.name;
    tr.appendChild(tdName);

    const tdSurname = document.createElement("td");
    tdSurname.textContent = student.surname;
    tr.appendChild(tdSurname);

    const tdMidterm = document.createElement("td");
    tdMidterm.textContent =
      student.studentLectures[studentLectureIndex].midtermScore;
    tr.appendChild(tdMidterm);

    const tdFinal = document.createElement("td");
    tdFinal.textContent =
      student.studentLectures[studentLectureIndex].finalScore;
    tr.appendChild(tdFinal);

    const tdGrade = document.createElement("td");
    tdGrade.textContent = student.studentLectures[studentLectureIndex].grade;
    tr.appendChild(tdGrade);

    const tdPassed = document.createElement("td");
    tdPassed.textContent =
      student.studentLectures[studentLectureIndex].grade === "F"
        ? "Failed"
        : "Passed";
    tr.appendChild(tdPassed);

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    editButton.onclick = editStudent;
    deleteButton.onclick = deleteStudent;

    const editDelCell = document.createElement("td");
    editDelCell.appendChild(editButton);
    editDelCell.appendChild(deleteButton);
    tr.appendChild(editDelCell);

    studentTable.appendChild(tr);
  });
};

const closeModals = () => {
  addStudentModal.classList.remove("active");
  studentSearchModal.classList.remove("active");
  editStudentModal.classList.remove("active");
  addLectureModal.classList.remove("active");
  overlay.classList.remove("active");
};

const openAddStudentModal = () => {
  lectureNameP.innerHTML = "For the lecture " + selectLecture.value;

  addStudentModal.classList.add("active");
  overlay.classList.add("active");
};

const openEditStudentModal = () => {
  eLectureNameP.innerHTML = "For the lecture " + selectLecture.value;

  editStudentModal.classList.add("active");
  overlay.classList.add("active");
};

const openAddLectureModal = () => {
  addLectureModal.classList.add("active");
  overlay.classList.add("active");
};

const deleteStudent = (e) => {
  // get the id of the student
  const id = e.target.parentElement.parentElement.firstChild.textContent;
  const studentIndex = students.findIndex((student) => student.id === id);

  // delete it and render students again
  students.splice(studentIndex, 1);
  renderStudents(selectLecture.value, filterSelect.value);
};

const editStudent = (e) => {
  // get the id of the student
  const id = e.target.parentElement.parentElement.firstChild.textContent;
  const student = students.find((student) => student.id === id);

  // fill the inputs with the student's info
  const idInput = document.getElementById("e-id");
  const nameInput = document.getElementById("e-name");
  const surnameInput = document.getElementById("e-surname");
  const midtermScoreInput = document.getElementById("e-midtermScore");
  const finalScoreInput = document.getElementById("e-finalScore");

  const lectureIndex = student.studentLectures.findIndex(
    (l) => l.name === selectLecture.value
  );

  idInput.value = student.id;
  nameInput.value = student.name;
  surnameInput.value = student.surname;
  midtermScoreInput.value = student.studentLectures[lectureIndex].midtermScore;
  finalScoreInput.value = student.studentLectures[lectureIndex].finalScore;

  openEditStudentModal();
};

const addStudent = (e) => {
  e.preventDefault();

  const idInput = document.getElementById("id");
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const midtermScoreInput = document.getElementById("midtermScore");
  const finalScoreInput = document.getElementById("finalScore");

  const id = idInput.value;
  const name = nameInput.value;
  const surname = surnameInput.value;
  const midtermScore = midtermScoreInput.value;
  const finalScore = finalScoreInput.value;
  const lecture = selectLecture.value;

  function resetInputs() {
    idInput.value = "";
    nameInput.value = "";
    surnameInput.value = "";
    midtermScoreInput.value = "";
    finalScoreInput.value = "";
  }

  // validation
  if (
    id === "" ||
    name === "" ||
    surname === "" ||
    lecture === "" ||
    midtermScore === "" ||
    finalScore === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  // check if the student already exists
  const studentIndex = students.findIndex((student) => student.id === id);
  if (studentIndex !== -1) {
    //existing lectures
    const studentLectures = students[studentIndex].studentLectures;
    
    // check if the student already has a grade for the selected lecture
    const lectureIndex = studentLectures.findIndex((l) => l.name === lecture);

    if (lectureIndex !== -1) {
      alert("This student already has a grade for this lecture");
      return;
    }

    // calculate the grade
    const grading = lectures.find((l) => l.name === lecture).grading;
    const grade = calculateGrade(midtermScore, finalScore, grading);

    // add the lecture to the student's lectures
    studentLectures.push({ name: lecture, midtermScore, finalScore, grade });

    // update the existing student object
    students[studentIndex] = new Student(id, name, surname, studentLectures);
    renderStudents(selectLecture.value, filterSelect.value);

    resetInputs();

    closeModals();
    return
  }

  //else, create a new student object
  const studentLectures = [];
  const grading = lectures.find((l) => l.name === lecture).grading;
  const grade = calculateGrade(midtermScore, finalScore, grading);
  studentLectures.push({ name: lecture, midtermScore, finalScore, grade });
  const student = new Student(id, name, surname, studentLectures);
  students.push(student);
  renderStudents(selectLecture.value, filterSelect.value);

  resetInputs();

  closeModals();
};

const editStudentSubmit = (e) => {
  e.preventDefault();

  const idInput = document.getElementById("e-id");
  const nameInput = document.getElementById("e-name");
  const surnameInput = document.getElementById("e-surname");
  const midtermScoreInput = document.getElementById("e-midtermScore");
  const finalScoreInput = document.getElementById("e-finalScore");

  const id = idInput.value;
  const name = nameInput.value;
  const surname = surnameInput.value;
  const midtermScore = midtermScoreInput.value;
  const finalScore = finalScoreInput.value;
  const lecture = selectLecture.value;

  // validation
  if (
    id === "" ||
    name === "" ||
    surname === "" ||
    lecture === "" ||
    midtermScore === "" ||
    finalScore === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const studentIndex = students.findIndex((student) => student.id === id);
  const student = students[studentIndex];
  const lectureIndex = student.studentLectures.findIndex(
    (l) => l.name === lecture
  );

  student.id = id;
  student.name = name;
  student.surname = surname;
  student.studentLectures[lectureIndex].midtermScore = midtermScore;
  student.studentLectures[lectureIndex].finalScore = finalScore;
  student.studentLectures[lectureIndex].grade = calculateGrade(
    midtermScore,
    finalScore,
    lectures.find((l) => l.name === lecture).grading
  );

  students[studentIndex] = student;

  renderStudents(selectLecture.value, filterSelect.value);

  closeModals();

  idInput.value = "";
  nameInput.value = "";
  surnameInput.value = "";
  midtermScoreInput.value = "";
  finalScoreInput.value = "";
};

const addLecture = (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("lecture-name");
  const gradingInput = document.getElementById("grading-select");

  const name = nameInput.value;
  const grading = gradingInput.value;

  // validation
  if (name === "" || grading === "") {
    alert("Please fill in all fields");
    return;
  }

  const lecture = new Lecture(name, grading);

  lectures.push(lecture);
  renderLectures();

  nameInput.value = "";
  gradingInput.value = "";

  gradingSystemText.innerHTML = grading;

  closeModals();
};

const calculateGrade = (midtermScore, finalScore, grading) => {
  const midtermWeight = 0.4;
  const finalWeight = 0.6;

  // calculate the weighted average
  const weightedAverage =
    midtermScore * midtermWeight + finalScore * finalWeight;

  // Return the calculated grade based on the lecture's grading system
  if (grading === "7 Scale") {
    return calculate7ScaleGrade(weightedAverage);
  } else {
    return calculate10ScaleGrade(weightedAverage);
  }
};

const calculate7ScaleGrade = (weightedAverage) => {
  if (weightedAverage <= 69) {
    return "F";
  } else if (weightedAverage <= 76) {
    return "D";
  } else if (weightedAverage <= 84) {
    return "C";
  } else if (weightedAverage <= 92) {
    return "B";
  } else if (weightedAverage <= 100) {
    return "A";
  }
};

const calculate10ScaleGrade = (weightedAverage) => {
  if (weightedAverage <= 59) {
    return "F";
  } else if (weightedAverage <= 69) {
    return "D";
  } else if (weightedAverage <= 79) {
    return "C";
  } else if (weightedAverage <= 89) {
    return "B";
  } else if (weightedAverage <= 100) {
    return "A";
  }
};

const calculateGPA = (studentLectures) => {
  const gpa = studentLectures.reduce((acc, lecture) => {
    if (lecture.grade === "F") {
      return 0;
    } else if (lecture.grade === "D") {
      return acc + 1;
    } else if (lecture.grade === "C") {
      return acc + 2;
    } else if (lecture.grade === "B") {
      return acc + 3;
    } else if (lecture.grade === "A") {
      return acc + 4;
    }
  }, 0) / studentLectures.length;

  return gpa;
};

// EVENT LISTENERS
addStudentModalBtn.addEventListener("click", openAddStudentModal);
addLectureModalBtn.addEventListener("click", openAddLectureModal);
overlay.addEventListener("click", closeModals);

selectLecture.addEventListener("change", (e) => {
  renderStudents(e.target.value, filterSelect.value);
  gradingSystemText.innerHTML = lectures.find(
    (lecture) => lecture.name === e.target.value
  ).grading;
});

addStudentForm.addEventListener("submit", addStudent);
editStudentForm.addEventListener("submit", editStudentSubmit);

addLectureForm.addEventListener("submit", addLecture);
filterSelect.addEventListener("change", (e) => {
  renderStudents(selectLecture.value, e.target.value);
});

searchStudent.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const id = e.target.value;
    const student = students.find((student) => student.id === id);

    if (!student) {
      alert("No student found");
      return;
    }

    studentDetailName.innerHTML =
      student.id + " " + student.name + " " + student.surname;

    studentSearchModal.classList.add("active");
    overlay.classList.add("active");

    const studentLectures = student.studentLectures;
    gpa.innerHTML = "GPA: " + calculateGPA(studentLectures).toFixed(2);

    renderStudentDetails(studentLectures);
  }
});

closeDetails.addEventListener("click", () => {
  studentSearchModal.classList.remove("active");
  overlay.classList.remove("active");
});
