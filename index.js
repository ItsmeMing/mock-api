const BASE_URL = "https://63807051786e112fe1afb6bf.mockapi.io/";
const mfetch = (path, option) =>
    fetch(BASE_URL + path, option).then((res) => {
        if (!res.ok) throw new Error("Fail");
        return res.json();
    });
async function getData() {
    const promise = await Promise.all([mfetch("users"), mfetch("articles")]);
    const body = document.querySelector("body");
    body.innerHTML = promise.map((data, index) => {
        return `<h1>table ${index + 1}</h1>
                  <table>
                      <thead>
                          <tr>
                              <th>Avatar</th>
                              <th>CreateAt</th>
                              <th>Id</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Edit</th>
                              <th>Delete</th>
                          </tr>
                      </thead>
                  <tbody>
                      ${data
                          .map((d) => {
                              return `<tr id="${index}-${d.id}">
                                      <td><img src="${d.avatar}"></td>
                                      <td>${d.createdAt.slice(0, 10)}</td>
                                      <td>${d.id}</td>
                                      <td id="${index}-${d.id}-userName">${d.name}</td>
                                      <td id="${index}-${d.id}-email">${d.email}</td>
                                      <td><button onclick="handleEdit(${
                                          d.id
                                      },  ${index}, '${JSON.stringify(d).replace(/"/g, "`")}')">Edit</button></td>
                                      <td><button onclick="handleDelete(${
                                          d.id
                                      }, ${index})">Delete</button></td>
                                  </tr>`;
                          })
                          .join("")}
                  </tbody>
              </table>`;
    });
}

getData();

const handleEdit = async (id, index, g) => {
    const collection = !index ? "users" : "articles";
    const data =(JSON.parse(g.replace(/`/g, `"`)));
    const name = Math.random().toFixed(5);
    const email = `h_${Math.random().toFixed(5)}.${data.email}`;
    try {
        await mfetch(`${collection}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...data,
                name,
                email
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        document.getElementById(`${index}-${id}-userName`).innerText = name;
        document.getElementById(`${index}-${id}-email`).innerText = email;
    } catch (e) {
        console.log(e.message);
    }
};

const handleDelete = async (id, index) => {
    const collection = !index ? "users" : "articles";
    try {
        await mfetch(`${collection}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        document.getElementById(`${index}-${id}`).remove();
    } catch (e) {
        console.log(e.message);
    }
};
