const filter = {country: "Germany", age: 87, gender: "Male", favorite: false}; // example of the filter array :D

export function filterUsers(users, filters) {
    return users.filter(user => filterFields(user, filters))
}

function filterFields(user, filters) {
  return Object.keys(filters).every(key => {
    const usersValues = user[key];
    const filtersValues = filters[key];

    if (key === "age" && usersValues != null) {
      const { min, max } = filtersValues;
      if (usersValues < min || usersValues > max) return false;
      return true;
    }

    return filters[key] === user[key];
  });
}