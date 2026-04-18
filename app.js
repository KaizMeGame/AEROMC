import { api } from "./api.js";

let token = localStorage.getItem("token") || "";

window.login = async () => {
  const data = await api.login({
    username: user.value,
    password: pass.value
  });

  token = data.token;
  localStorage.setItem("token", token);

  if (data.role === "admin") location.href = "admin.html";
  else loadPosts();
};

window.createPost = async () => {
  await api.create({
    title: title.value,
    content: content.value
  }, token);

  loadPosts();
};

window.loadPosts = async (isAdmin=false) => {
  const posts = await api.posts();
  postsDiv.innerHTML = posts.map(p => `
    <div class="post">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
      ${isAdmin ? `<button onclick="del('${p._id}')">Delete</button>` : ""}
    </div>
  `).join("");
};

window.del = async (id) => {
  await api.del(id, token);
  loadPosts(true);
};

loadPosts();