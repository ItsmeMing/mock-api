function renderTables(tables) {
    const tablesEle = document.querySelector(".tables");
    tablesEle.innerHTML = tables.map((data, index) => {
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