import "../css/app.css";
import { randomUserMock, additionalUsers } from "./info/FE4U-Lab2-mock.js"
import { getFormattedUsers } from "./info/format.js"
import { validateUsersFields } from "./info/validate.js"
import { renderTeachers, teachers } from "./addTeacher.js";
import "./filterUsers.js"
import { initSort, renderTable } from "./sortTable.js";
import { searchTeachers } from "./searchTeachers.js";
import "./formAddTeacher.js";

let result = getFormattedUsers(randomUserMock, additionalUsers);
export let validUsers = validateUsersFields(result);

renderTeachers(validUsers);
searchTeachers(validUsers);