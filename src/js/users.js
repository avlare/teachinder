import { getFormattedUsers } from "./info/format.js";
import { validateUsersFields } from "./info/validate.js";
import { renderTeachers } from "./ui/addTeacher.js";

const url = "https://randomuser.me/api/";

export let validUsers = [];

async function fetchTeachers(num) {
  try {
    const response = await fetch(`${url}?results=${num}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function loadTeachers(count = 50) {
  let validatedTeachers = [];

  while (validatedTeachers.length < count) {
    const teachers = await fetchTeachers(count);

    if (!teachers || teachers.length === 0) {
      await new Promise(r => setTimeout(r, 500));
      continue;
    }

    const formatted = getFormattedUsers(teachers, "");
    const validated = validateUsersFields(formatted);

    validatedTeachers = validatedTeachers.concat(validated);
  }

  validUsers = validUsers.concat(validatedTeachers.slice(0, count));
  renderTeachers(validUsers);
  return validUsers;
}
