const API = "https://YOUR_BACKEND";

let access = localStorage.getItem("access");
let refresh = localStorage.getItem("refresh");

async function request(url, opt={}) {
  opt.headers = {
    ...(opt.headers || {}),
    Authorization: access
  };

  let res = await fetch(API + url, opt);

  if (res.status === 403) {
    const r = await fetch(API + "/api/refresh", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ token: refresh })
    });

    const data = await r.json();
    access = data.access;
    localStorage.setItem("access", access);
    return request(url, opt);
  }

  return res.json();
}

export const api = {
  login: async (data) => {
    const res = await fetch(API + "/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    const d = await res.json();
    access = d.access;
    refresh = d.refresh;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  },

  posts: () => request("/api/posts"),

  create: (data) => request("/api/post", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(data)
  })
};