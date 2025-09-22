export function sortUsers(users, sortKey, sortCondition) {
    return users.sort(function(curr, next) {
        let currVal = curr[sortKey];
        let nextVal = next[sortKey];

        if(sortKey === "b_date") {
            currVal = new Date(currVal);
            nextVal = new Date(nextVal);
            // console.log(currVal);
            // console.log(nextVal);
        }

        if (sortCondition === "asc") {
            return currVal > nextVal ? 1 : currVal < nextVal ? -1 : 0;
        } else {
            return currVal < nextVal ? 1 : currVal > nextVal ? -1 : 0;
        }
    });
}