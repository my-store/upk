import { Error, Log, Warn } from './console';
import { JSONGet, JSONPost } from './requests';

export const cred_name: string = 'UPK.Login.Credentials';

export function setLoginCredentials(data: any): void {
  // Dispay progress message
  Log('Save login credentials');

  localStorage.setItem(cred_name, JSON.stringify(data));
}

export function getLoginCredentials(): any {
  // Dispay progress message
  Log('Find login credentials');

  // Login data exist
  let jsonData: any = localStorage.getItem(cred_name);
  if (jsonData) {
    try {
      jsonData = JSON.parse(jsonData);
    } catch {
      // Dispay error message
      Error('Failed to parse login credentials');
    }
  }

  // No login data is founded
  else {
    // Display warning message
    Warn('No login credentials found');
  }

  return jsonData;
}

export function removeLoginCredentials(): void {
  localStorage.removeItem(cred_name);
}

export async function getUserData(tlp: string, loginToken: any): Promise<any> {
  // Dispay progress message
  Log('Find user data');

  let userData: any = null;
  const getProfileURL: string = `/api/${loginToken.role.toLowerCase()}/${tlp}`;

  try {
    userData = await JSONGet(getProfileURL, {
      headers: { Authorization: `Bearer ${loginToken.access_token}` },
    });
  } catch (error) {
    // Dispay error message
    Error('Failed to get user data');
  }

  return userData;
}

export async function getAuthProfile(access_token: string): Promise<any> {
  // Dispay progress message
  Log('Get auth profile');

  let profile: any = null;
  try {
    // Melakukan pengecekan ke server apakah token masih aktif
    profile = await JSONGet('/api/auth', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    // Jika token expired, response dari server adalah:
    // message dan statusCode.
    // message = Unauthorized
    // statusCode = 401
    // ----------------------------------------------------
    // Namun jika token masih aktif, response server adalah:
    // [iat, exp, sub, role]
    // iat = Issued At (where the token is created)
    // exp = Expired
    // sub = No Tlp. User/Admin/Kasir
    // role = User/Admin/Kasir
  } catch {
    // Dispay error message
    Error('Failed to get auth profile');
  }

  return profile;
}

export async function refreshToken(tlp: string): Promise<boolean> {
  // Dispay progress message
  Log('Refreshing token');

  let tokenRefreshed: any = false;
  try {
    // Melakukan permintaan ke server untuk dibuatkan token baru
    const getNewToken = await JSONPost('/api/auth/refresh', {
      body: JSON.stringify({ tlp }),
    });
    // Jika refresh token berhasil dibuat, maka response darai server
    // adalah sama dengan ketika login yaitu berisi:
    // access_token dan role
    // access_token yang akan digunakan pada headers.Authorization
    // role = Admin, Kasir atau User, ini server yang menentukan saat proses login
    // server akan mencari tahu siapa yang sedang login.

    // Get user data
    const userData = await getUserData(tlp, getNewToken);

    // Update credentials on local storage
    await setLoginCredentials({ ...getNewToken, data: userData });

    /*
        | Token sudah expired, namun berhasil mendapatkan token baru
        | Step selanjutnya adalah membuka halaman default sesuai role:
        | Admin | User | Kasir
        */
    tokenRefreshed = true;
  } catch {
    // Dispay error message
    Error('Token refresh failed');
  }

  // Dispay progress message
  Log('Token refresh succeeded');

  return tokenRefreshed;
}
