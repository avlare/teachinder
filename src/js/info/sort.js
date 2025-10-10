import _ from "lodash";

export function sortUsers(users, sortKey, sortCondition) {
  const sorted = _.orderBy(
    users,
    [(user) => {
      let value = _.get(user, sortKey);
      if (sortKey === "b_date" && !_.isNil(value)) {
        value = new Date(value);
      }
      return _.isString(value) ? _.toLower(value) : value;
    }],
    [sortCondition === "asc" ? "asc" : "desc"]
  );

  return sorted;
}
