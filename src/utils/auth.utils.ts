import Cookies from "js-cookie";
import {AUTH_CONSTANT} from "../constants/auth.constant";

export const getToken = (): string => {
    return Cookies.get(AUTH_CONSTANT.TOKEN_KEY) as string;
}