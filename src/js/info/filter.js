const filter = {country: "Germany", age: 87, gender: "Male", favorite: false}; // example of the filter array :D

export function filterUsers(users, filters) {
    return users.filter(user => filterFields(user, filters))
}

function filterFields(user, filters) {
  return Object.keys(filters).every(key => {
    const filterValue = filters[key];
    const userValue = user[key];

    if (filterValue === null) return true;

    if (key === "age") {
      const { min, max } = filterValue;
      return userValue >= min && userValue <= max;
    }

    if (key === "favorite") {
      return !!userValue === filterValue;
    }

if (key === "photo") {
  if (filterValue === null) return true;
  return typeof user.picture_large === "string" && user.picture_large.trim() !== "";
}

if (key === "country") {
  return filterValue === getRegionByCountry(user.country);
}

    if (typeof userValue === "string") {
      return userValue.toLowerCase() === filterValue.toLowerCase();
    }

    return userValue === filterValue;
  });
}

function getRegionByCountry(country) {
  country = country.trim();
  for (const [region, countries] of Object.entries(regionsMap)) {
    if (countries.includes(country)) {
      return region;
    }
  }
  return null;
}

const regionsMap = {
  europe: ["Ukraine", "Ireland", "Finland", "Germany", "Norway", "France", "Denmark", "Switzerland", "Spain", "Netherlands", "Turkey"],
  asia: ["Iran", "India", "China", "Japan", "South Korea"],
  america: ["United States", "Canada", "Brazil", "Mexico", "Argentina"],
  africa: ["Egypt", "South Africa", "Nigeria", "Kenya", "Morocco"],
  australia: ["Australia", "New Zealand"]
};