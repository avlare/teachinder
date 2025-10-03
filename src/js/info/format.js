import { countryToAlpha2 } from "country-to-iso";
import { parsePhoneNumberWithError } from 'libphonenumber-js';

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
    if (typeof word === "string") {
        return word[0].toUpperCase() + word.slice(1);
    }
    return null;
}

function normalize(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function normalizeId(id, login) {
  if (!id) return login ?? crypto.randomUUID();
  if (typeof id === "string") return id;
  if (typeof id === "object" && id.name && id.value) {
    return `${id.name}${id.value}`;
  }
  return crypto.randomUUID();
}


export function formatUser(user) {
  return {
    id: normalize(normalizeId(user.id ?? user.login?.uuid)),
    gender: normalize(capitalizeWord(user.gender)),
    title: normalize(user.title ?? user.name?.title),
    full_name: normalize(
      user.full_name ?? `${user.name?.first ?? ""} ${user.name?.last ?? ""}`.trim()
    ),
    city: normalize(user.city ?? user.location?.city),
    state: normalize(user.state ?? user.location?.state),
    country: normalize(user.country ?? user.location?.country),
    postcode: normalize(user.postcode ?? user.location?.postcode),
    coordinates: {
      latitude: normalize(user.coordinates?.latitude ?? user.location?.coordinates?.latitude),
      longitude: normalize(user.coordinates?.longitude ?? user.location?.coordinates?.longitude),
    },
    timezone: {
      offset: normalize(user.timezone?.offset ?? user.location?.timezone?.offset),
      description: normalize(user.timezone?.description ?? user.location?.timezone?.description),
    },
    email: normalize(user.email),
    b_date: normalize(user.b_day ?? user.dob?.date),
    age: normalize(user.dob?.age),
    phone: normalize(setPhoneWithCountryCode(user.phone, user.country ?? user.location?.country)),
    picture_large: normalize(user.picture_large ?? user.picture?.large),
    picture_thumbnail: normalize(user.picture_thumbnail ?? user.picture?.thumbnail),
    favorite: normalize(user.favorite ?? false),
    course: normalize(user.course ?? courses[Math.floor(Math.random() * courses.length)]),
    bg_color: normalize(user.bg_color ?? "#ff00e1ff"),
    note: normalize(user.note ?? "Note"), // there is only 4 people with notes and none of them starts with a capital letter (task2), so added "Note"
  };
}

function setPhoneWithCountryCode(phone, country) {
  if (typeof phone === "string" && typeof country === "string") {
    try {
      const isoCountry = countryToAlpha2(country);
      const formattedPhone = parsePhoneNumberWithError(phone, isoCountry);
      return formattedPhone.number;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function getFormattedUsers(randomUserMock, additionalUsers) {
    const allUsers = [...randomUserMock, ...additionalUsers].map(formatUser);

    const mergedMap = new Map();

    for (const user of allUsers) {
        // const key = user.full_name; there's no people with identical id and full_name as asking in the task. so, i used this line for testing
        const key = `${user.id} ${user.full_name}`;
        if (mergedMap.has(key)) {
            let userAlreadyInMap = mergedMap.get(key);
            // console.log("=================");
            // console.log(user);
            // console.log(userAlreadyInMap);
            mergedMap.set(key, mergeUsers(userAlreadyInMap, user));
        } else {
            mergedMap.set(key, user);
        }
    }

    return Array.from(mergedMap.values());
}

function mergeUsers(oldUser, newUser) {
    const merged = { ...oldUser };
    for (const key in newUser) {
        if (
            merged[key] === undefined || // just in case but all undefined values should be preprocessed as null
            merged[key] === null ||
            merged[key] === "" ||
            (typeof merged[key] === "object" &&
                Object.values(merged[key]).every(value => value === null || value === "" || value === undefined))
        ) {
            merged[key] = newUser[key];
        }
    }
    return merged;
}


