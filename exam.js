let isUpdate = null;
//open modal 
const modal = new bootstrap.Modal(document.getElementById('formModal'));

document.getElementById("btn-modal").addEventListener("click", () => {
    modal.show();
});

// Login
document.getElementById("form-login").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const getAccount = async () => {
        try {
            const url = "https://67079f348e86a8d9e42c337a.mockapi.io/v1/user";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Error");
            }
            return response.json();
        } catch (error) {
            throw new Error(`Call api failed: ${error}`);
        }
    }

    getAccount().then((data) => {
        const user = data.find((user) => user.username === username && user.password === password);
        localStorage.setItem("username", username);
        if (user) {
            alert("Login success");
            document.getElementById("login-box").style.display = "none";
            document.getElementById("crud-box").style.display = "block";
        } else {
            alert("Login failed");
        }
    })
})

//crud

const getProduct = async () => {
    try {
        const url = "https://67079f348e86a8d9e42c337a.mockapi.io/v1/products";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const getDetailProduct = async (id) => {
    try {
        const url = `https://67079f348e86a8d9e42c337a.mockapi.io/v1/products/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const addProduct = async (data) => {
    try {
        const url = "https://67079f348e86a8d9e42c337a.mockapi.io/v1/products";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const deleteProduct = async (id) => {
    try {
        const url = `https://67079f348e86a8d9e42c337a.mockapi.io/v1/products/${id}`;
        const response = await fetch(url, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const updateProduct = async (data, id) => {
    try {
        const url = `https://67079f348e86a8d9e42c337a.mockapi.io/v1/products/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const searchProduct = async (keyword) => {
    try {
        const url = `https://67079f348e86a8d9e42c337a.mockapi.io/v1/products?name=${keyword}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error");
        }
        return response.json();
    } catch (error) {
        throw new Error(`Call api failed: ${error}`);
    }
}

const ListViewProduct = (data) => {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    if (data && data.length > 0) {
        data.forEach((product) => {
            tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}$</td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-primary" onclick="showUpdateForm(${product.id})"><i class="bi bi-pencil-square"></i> Update</button>
                    <button class="btn btn-danger" onclick="deleteProductAction(${product.id})"><i class="bi bi-trash"></i> Delete</button>
                </td>
            </tr>
            `;
        });
    } else {
        tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">Không có dữ liệu</td>
        </tr>
        `;
    }
}

getProduct().then((data) => {
    ListViewProduct(data);
})

const reloadview = () => {
    getProduct().then((data) => {
        ListViewProduct(data);
    });
}

const deleteProductAction = async (id) => {
    await deleteProduct(id);
    reloadview();
}

const showUpdateForm = async (id) => {
    const detail = await getDetailProduct(Number(id));
    document.getElementById("name").value = detail?.name;
    document.getElementById("price").value = detail?.price;
    document.getElementById("description").value = detail?.description;
    isUpdate = Number(id);
    modal.show();
}

const createProduct = document.getElementById("btn-create");
createProduct.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;

    if (name && price && description !== "") {
        if(isUpdate) {
            const update = updateProduct({ name, price, description }, isUpdate);
            if(update) {
                document.getElementById("btn-create").innerHTML = "Them moi";
                alert("Update thanh cong");
                modal.hide();
                reloadview();
            }
        } else {
            const post = addProduct({ name, price, description });
            if(post) {
                alert("Them thanh cong");
                modal.hide();
                reloadview();
            }
        }
    } else {
        alert("Vui long nhap day du thong tin");
    }
})

document.getElementById("search").addEventListener("keyup", async () => {
    const keyword = document.getElementById("search").value;
    if (keyword !== "") {
        const result = await searchProduct(keyword);
        if (result.length > 0) {
            ListViewProduct(result);
        }
    } else {
        reloadview();
    }
})

const logout = () => {
    localStorage.removeItem("username");
    document.getElementById("login-box").style.display = "block";
    document.getElementById("crud-box").style.display = "none";
}

window.onload = () => {
    if (localStorage.getItem("username")) {
        document.getElementById("login-box").style.display = "none";
        document.getElementById("crud-box").style.display = "block";
    }
}