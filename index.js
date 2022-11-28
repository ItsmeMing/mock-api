const BASE_URL = "https://63807051786e112fe1afb6bf.mockapi.io/";
const mfetch = (path, option) =>
    fetch(BASE_URL + path, option).then((res) => {
        if (!res.ok) throw new Error("Fail");
        return res.json();
    });
async function getData() {
    const promise = await Promise.all([mfetch("users"), mfetch("articles")]);
    console.log(promise);
    const tables = document.querySelector(".tables");
    tables.innerHTML = promise.map((data, index) => {
        return `<h1>table ${index + 1}</h1>
                  <table id="table${index}">
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
                                      <td id="${index}-${d.id}-userName">${
                                  d.name
                              }</td>
                                      <td id="${index}-${d.id}-email">${
                                  d.email
                              }</td>
                                      <td><button onclick="handleEdit(${
                                          d.id
                                      },  ${index}, '${JSON.stringify(
                                  d
                              ).replace(/"/g, "`")}')">Edit</button></td>
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

let userImgURL;
let userName;
let userEmail;

const handleImg = () => {
    userImgURL = document.getElementById("input__img").value;
};

const handleUserName = () => {
    userName = document.getElementById("input__name").value;
};

const handleUserEmail = () => {
    if (
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            document.getElementById("input__email").value
        )
    ) {
        document.getElementById("submit__btn").disabled = false;
        userEmail = document.getElementById("input__email").value;
        document.getElementById("input__email").style.border =
            "5px solid transparent";
        document.getElementById("error-mess").style.color = "green";
        document.getElementById("error-mess").innerText = "valid email";
    } else {
        document.getElementById("submit__btn").disabled = true;
        document.getElementById("error-mess").style.color = "red";
        document.getElementById("error-mess").innerText = "invalid email";
        document.getElementById("input__email").style.border = "5px solid red";
    }
};

const clearInput = () => {
    document.getElementById("input__img").value = "";
    document.getElementById("input__name").value = "";
    document.getElementById("input__email").value = "";
};

const changeSubmitBtn = (disabled, innerText, onClickFn) => {
    document.getElementById("submit__btn").disabled = disabled;
    document.getElementById("submit__btn").innerText = innerText;
    document
        .getElementById("submit__btn")
        .setAttribute("onclick", onClickFn);
}

const handleAdd = async (event) => {
    event.preventDefault();
    const users = await mfetch("users");
    const data = {
        avatar: userImgURL,
        createdAt: new Date(),
        email: userEmail,
        id: users.length + 1,
        name: userName,
    };
    try {
        await mfetch("users", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        clearInput();
        getData();
    } catch (e) {
        console.log(e.message);
    }
};

const handleEdit = (id, index, g) => {
    // const collection = !index ? "users" : "articles";
    const data = JSON.parse(g.replace(/`/g, `"`));
    // const name = Math.random().toFixed(5);
    // const email = `h_${Math.random().toFixed(5)}.${data.email}`;
    document.getElementById("form__header").innerText = `Edit User ${id}`;
    changeSubmitBtn(false, "Edit", `submitEdit(${id}, event)`)
    document.getElementById("input__img").value = data.avatar;
    document.getElementById("input__name").value = data.name;
    document.getElementById("input__email").value = data.email;
};

const submitEdit = async (id, event) => {
    event.preventDefault();
    const editedData = {
        avatar: userImgURL,
        createdAt: new Date(),
        email: userEmail,
        id: id,
        name: userName,
    };
    console.log(editedData);
    try {
        await mfetch(`users/${id}`, {
            method: "PUT",
            body: JSON.stringify(editedData),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        document.getElementById("form__header").innerText = "Add User";
        clearInput();
        document.getElementById("error-mess").innerText = "";
        changeSubmitBtn(true, "Add", "handleAdd(event)")
        getData();
    } catch (e) {
        console.log(e.message);
    }
};
