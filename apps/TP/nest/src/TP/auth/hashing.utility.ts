import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function comparePasswords(
  password: string,
  storedHash: string,
): boolean {
  const [salt, hash] = storedHash.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const testHash = scryptSync(password, salt, KEY_LENGTH);
  return timingSafeEqual(hashBuffer, testHash);
}

export function getRecentKeyStructure(val:string) {
  const keys = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
  const result = {};

  keys.forEach((key, index) => {
    const regex = new RegExp(`${key}:(\\w+)`);
    const match = val.match(regex);
    if (match) {
      result[key] = match[1];
    }
  });
  result["AFSK"] = val.split(":")[val.split(":").length-1];

  return result;
}

export function getKeyArrayStructure(val: string) {
  const keys = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
  const result: any = {};

  // Split the string using ":" as the delimiter
  const parts = val.split(":");

  // Iterate through the predefined keys and assign corresponding values
  let index = 0;
  for (const key of keys) {
    if (index < parts.length - 1) {
      if(key === 'CATK' || key === 'AFGK' || key === 'AFK' || key === 'AFVK'){
        result[key] = [parts[index + 1]]; 
        index += 2;
      }else{
        result[key] = parts[index + 1]; 
        index += 2; 
      }     
    }
  }

  // Special handling for 'AFSK' if it's at the end of the string
  result["AFSK"] = parts[parts.length - 1];

  return result;
}

export function pushArtifactKeyStructure(val:string) {
 
  const keys = ['CK', 'FNGK', 'FNK', 'CATK', 'AFGK', 'AFK', 'AFVK', 'AFSK'];
  const result: any = {};
 
  const parts = val.split(":");   
  let index = 0;
  for (const key of keys) {
    if (index < parts.length - 1) {      
        result[key] = parts[index + 1]; 
        index += 2;           
    }
  } 
 return result 
}

