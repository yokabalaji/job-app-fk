// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//     userId: string;
//     role: string;
//     exp: number;
// }

// export const isTokenExpired = (token: string): boolean => {
//     try {
//         const decoded = jwtDecode<DecodedToken>(token);
//         if (!decoded.exp) return true;
//         const currentTime = Math.floor(Date.now() / 1000);
//         return decoded.exp < currentTime;
//     } catch (e) {
//         console.error('Invalid token:', e);
//         return true;
//     }
// };
