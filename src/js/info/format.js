import _ from "lodash";
import { countryToAlpha2 } from "country-to-iso";
import { parsePhoneNumberWithError } from "libphonenumber-js";

const courses = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics",
];

function capitalizeWord(word) {
  return _.isString(word) ? _.upperFirst(word) : null;
}

function normalize(value) {
  return _.isNil(value) || value === "" ? null : value;
}

function normalizeId(id, login) {
  if (!id) return login ?? crypto.randomUUID();
  if (_.isString(id)) return id;
  if (_.isObject(id) && id.name && id.value) return `${id.name}${id.value}`;
  return crypto.randomUUID();
}

export function formatUser(user) {
  return {
    id: normalize(normalizeId(_.get(user, "id") ?? _.get(user, "login.uuid"))),
    gender: normalize(capitalizeWord(_.get(user, "gender"))),
    title: normalize(_.get(user, "title") ?? _.get(user, "name.title")),
    full_name: normalize(
      _.get(user, "full_name") ??
        `${_.get(user, "name.first", "")} ${_.get(user, "name.last", "")}`.trim()
    ),
    city: normalize(_.get(user, "city") ?? _.get(user, "location.city")),
    state: normalize(_.get(user, "state") ?? _.get(user, "location.state")),
    country: normalize(_.get(user, "country") ?? _.get(user, "location.country")),
    postcode: normalize(_.get(user, "postcode") ?? _.get(user, "location.postcode")),
    coordinates: {
      latitude: normalize(_.get(user, "coordinates.latitude") ?? _.get(user, "location.coordinates.latitude")),
      longitude: normalize(_.get(user, "coordinates.longitude") ?? _.get(user, "location.coordinates.longitude")),
    },
    timezone: {
      offset: normalize(_.get(user, "timezone.offset") ?? _.get(user, "location.timezone.offset")),
      description: normalize(_.get(user, "timezone.description") ?? _.get(user, "location.timezone.description")),
    },
    email: normalize(_.get(user, "email")),
    b_date: normalize(_.get(user, "b_day") ?? _.get(user, "b_date") ?? _.get(user, "dob.date")),
    age: normalize(_.get(user, "age") ?? _.get(user, "dob.age")),
    phone: normalize(setPhoneWithCountryCode(_.get(user, "phone"), _.get(user, "country") ?? _.get(user, "location.country"))),
    picture_large: normalize(_.get(user, "picture_large") ?? _.get(user, "picture.large")),
    picture_thumbnail: normalize(_.get(user, "picture_thumbnail") ?? _.get(user, "picture.thumbnail")),
    favorite: normalize(_.get(user, "favorite") ?? false),
    course: normalize(_.get(user, "course") ?? _.sample(courses)),
    bg_color: normalize(_.get(user, "bg_color") ?? "#F89582"),
    note: normalize(_.get(user, "note") ?? "Note"),
  };
}

function setPhoneWithCountryCode(phone, country) {
  if (_.isString(phone) && _.isString(country)) {
    try {
      const isoCountry = countryToAlpha2(country);
      const formattedPhone = parsePhoneNumberWithError(phone, isoCountry);
      return formattedPhone.number;
    } catch {
      return null;
    }
  }
  return null;
}

export function getFormattedUsers(randomUserMock, additionalUsers) {
  const allUsers = _.map([...randomUserMock, ...additionalUsers], formatUser);
  const mergedMap = new Map();

  _.forEach(allUsers, (user) => {
    const key = `${user.id} ${user.full_name}`;
    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);
      mergedMap.set(key, mergeUsers(existing, user));
    } else {
      mergedMap.set(key, user);
    }
  });

  return Array.from(mergedMap.values());
}

function mergeUsers(oldUser, newUser) {
  const merged = _.clone(oldUser);
  _.forOwn(newUser, (value, key) => {
    const current = merged[key];
    if (
      _.isNil(current) ||
      current === "" ||
      (_.isObject(current) && _.every(_.values(current), (v) => _.isNil(v) || v === ""))
    ) {
      merged[key] = value;
    }
  });
  return merged;
}
