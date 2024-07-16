import setCookie from "./setCookie";

export default function deleteCookie(name, path = '/') {
    setCookie(name, '', -1, path);
}