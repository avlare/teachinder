export function sortUsers(users, sortKey, sortCondition) {
  return users.sort((curr, next) => {
    let currVal = curr[sortKey];
    let nextVal = next[sortKey];

    if (sortKey === "b_date") {
      currVal = new Date(currVal);
      nextVal = new Date(nextVal);
    }

    if (typeof currVal === "string" && typeof nextVal === "string") {
      const compare = currVal.localeCompare(nextVal);
      return sortCondition === "asc" ? compare : -compare;
    }

    if (sortCondition === "asc") {
      return currVal > nextVal ? 1 : currVal < nextVal ? -1 : 0;
    } else {
      return currVal < nextVal ? 1 : currVal > nextVal ? -1 : 0;
    }
  });
}
