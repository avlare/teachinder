import _ from "lodash";

export function searchInfo(users, string) {
  const arrSearch = _.words(_.toLower(string));
  return _.filter(users, (user) => searchAllFields(user, arrSearch));
}

function searchAllFields(user, arrSearch) {
  const values = _.map(_.values(user), (val) =>
    _.isNil(val) ? "" : _.toLower(val.toString())
  );

  return _.every(arrSearch, (term) =>
    _.some(values, (value) => _.includes(value, term))
  );
}

export function calculatePercentage(allUsers, string) {
  const userSearch = searchInfo(allUsers, string);
  return (userSearch.length * 100) / allUsers.length;
}
