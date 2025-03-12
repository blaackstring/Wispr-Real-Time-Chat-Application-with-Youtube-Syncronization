export const SignupController = async (formdata) => {
  return await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formdata)
  }).then(res => res.json()).then(res => { return res });
}

export const LoginController = async (formdata) => {
  console.log(formdata);

console.log(import.meta.env.VITE_PORT+"")
  return await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(formdata)
  }).then(res => res.json())
}


export const LogoutController = async () => {
  return fetch(`/api/auth/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
}