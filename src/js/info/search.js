export function searchInfo(users, string) {
    let arrSearch = string.toLowerCase().split(' ');
    return users.filter(user => searchAllFields(user, arrSearch));
}

function searchAllFields(user, arrSearch) {
  const values = Object.values(user).map(val => (val != null ? val.toString().toLowerCase() : ""));
  return arrSearch.every(term => {
    let found = false;
    for (let value of values) {
      if (value.includes(term)) {
        found = true;
        break;
      }
    }
    return found;
  });
}

export function calculatePercentage(allUsers, string) {
    const userSearch = searchInfo(allUsers, string);
    return (userSearch.length * 100) / allUsers.length;
}