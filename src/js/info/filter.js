import _ from "lodash";

const filter = {
  country: "Germany",
  age: { min: 50, max: 90 },
  gender: "Male",
  favorite: false,
  photo: true,
};

export function filterUsers(users, filters) {
  return _.filter(users, (user) => filterFields(user, filters));
}

function filterFields(user, filters) {
  return _.every(_.keys(filters), (key) => {
    const filterValue = _.get(filters, key);
    const userValue = _.get(user, key);

    if (_.isNil(filterValue)) return true;
 
    if (key === "age") {
      const min = _.get(filterValue, "min", 0);
      const max = _.get(filterValue, "max", Infinity);
      return userValue >= min && userValue <= max;
    }

    if (key === "favorite") {
      return Boolean(userValue) === filterValue;
    }

    if (key === "photo") {
      if (_.isNil(filterValue)) return true;
      const picture = _.get(user, "picture_large", "");
      return _.isString(picture) && !_.isEmpty(_.trim(picture));
    }

    if (key === "country") {
      return filterValue === getRegionByCountry(user.country);
    }

    if (_.isString(userValue)) {
      return _.toLower(userValue) === _.toLower(filterValue);
    }

    return _.isEqual(userValue, filterValue);
  });
}

function getRegionByCountry(country) {
  if (!_.isString(country)) return null;
  const cleanCountry = _.trim(country);

  return _.findKey(regionsMap, (countries) =>
    _.includes(countries, cleanCountry)
  );
}

const regionsMap = {
  europe: [
    "Ukraine",
    "Ireland",
    "Finland",
    "Germany",
    "Norway",
    "France",
    "Denmark",
    "Switzerland",
    "Spain",
    "Netherlands",
    "Turkey",
  ],
  asia: ["Iran", "India", "China", "Japan", "South Korea"],
  america: ["United States", "Canada", "Brazil", "Mexico", "Argentina"],
  africa: ["Egypt", "South Africa", "Nigeria", "Kenya", "Morocco"],
  australia: ["Australia", "New Zealand"],
};
