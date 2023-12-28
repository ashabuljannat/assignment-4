/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createToken = (
  jwtPayload: any,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export function pushUnique(arr: any, value: string) {
  if (!arr.includes(value)) {
    arr.push(value);
    if (arr.length > 3) {
      arr.shift(); // Remove the oldest element
    }
  }
}

export function pushUniqueByPass(arr: any, newObj: any) {
  const index = arr.findIndex((obj: any) => obj.pass === newObj.pass);

  if (index === -1) {
    arr.push(newObj);

    if (arr.length > 3) {
      arr.shift(); // Remove the oldest element
    }

    return false; // Successfully added
  } else {
    return true; // Matching pass found, not added
  }
}

export async function pushUniqueByPassHash(newObj: any, array: any) {
  // console.log(newObj,array)
  for (let index = 0; index < array.length; index++) {
    const hash = array[index];
    // console.log(11, index, hash);
    const match = await bcrypt.compare(newObj.pass, hash.pass);
    // console.log('pass match', match);
    if (!match) {
      array.push(newObj);
      if (array.length > 3) {
        array.shift(); // Remove the oldest element
      }
      //   // return false; // Successfully added
    }
  }
  console.log(newObj, 'arr', array);
}

export function formatToDate(inputDate: any) {
  const dateObject = new Date(inputDate);

  const formattedDate = `${dateObject.getFullYear()}-${String(
    dateObject.getMonth() + 1,
  ).padStart(2, '0')}-${String(dateObject.getDate()).padStart(
    2,
    '0',
  )} at ${String(dateObject.getHours() % 12 || 12).padStart(2, '0')}:${String(
    dateObject.getMinutes(),
  ).padStart(2, '0')} ${dateObject.getHours() < 12 ? 'AM' : 'PM'}`;

  return formattedDate;
}
