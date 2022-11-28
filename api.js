const BASE_URL = "https://63807051786e112fe1afb6bf.mockapi.io/";
const mfetch = (path, option) =>
    fetch(BASE_URL + path, option).then((res) => {
        if (!res.ok) throw new Error("Fail");
        return res.json();
    });