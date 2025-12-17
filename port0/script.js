let valid_inputs = false;
let has_local_storage = false;
const prod_name = document.getElementById('prod_name');
const prod_desc = document.getElementById('prod_desc');
const confirm = document.getElementById('modal_prod_confirm');
const prod_price = document.getElementById('prod_price');
const add_confirmation = document.getElementById('prod_confirm');
const btn_prod_register = document.getElementById('btn_prod_register');
const table = document.querySelector('tbody');
const show_prod = document.getElementById('prod_list');
const modal = document.getElementById('modal_prod');
let prod_list = [];

//LocalStorage area
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    has_local_storage = true;
} catch (error) {
    alert('Ocorreu um erro ao tentar acessar o localStorage!');
}

if (has_local_storage) {
    if (localStorage.getItem('prod_list') !== null) {
        prod_list = JSON.parse(localStorage.getItem('prod_list'));
    }
    show_prod_list();
}

//Botão de cadastro de produto
btn_prod_register.addEventListener('click', () => {
    const name = prod_name.value;
    const desc = prod_desc.value;
    const val = prod_price.value;
    const id = Date.now().toString();
    const prod = clear_input(name, desc, val, add_confirmation);
    if (!valid_inputs) {
        return;
    }
    salvar_prod(id, name, desc, val);
    add_confirmation.textContent = `${prod_list[prod_list.length - 1].name} adicionado com sucesso!`;
    setTimeout(() => {
        add_confirmation.textContent = '';
    }, 4000);
    show_prod_list();

    valid_inputs = false;
    prod_desc.value = '';
    prod_name.value = '';
    prod_price.value = '';
});

//Função para limpeza de entrada
function clear_input(name, desc, val, text) {
    name = name.trim();
    desc = desc.trim();
    val = val.trim();
    if (name === '' || desc === '' || val === '') {
        alert('Campos inválidos!');
        text.textContent = `Algum campo está vazio!`;
        setTimeout(() => {
            text.textContent = '';
        }, 10000);
        return;
    } else if (val.includes(',')) {
        val = val.split(',').join('.');
    } else if (name.includes('<script>') || desc.includes('<script>')) {
        alert('Campos inválidos!');
        text.textContent = `O que você está tentando fazer...?`;
        setTimeout(() => {
            text.textContent = '';
        }, 10000);
        return;
    } else if (isNaN(Number(val))) {
        alert('Campos inválidos!');
        text.textContent = `O valor não é adequado.`;
        setTimeout(() => {
            text.textContent = '';
        }, 10000);
        return;
    } else if (!isNaN(Number(name)) || !isNaN(Number(desc))) {
        alert('Campos inválidos!');
        text.textContent = `Os campos "NOME" e "DESCRIÇÃO" não devem conter apenas números.`;
        setTimeout(() => {
            text.textContent = '';
        }, 10000);
        return;
    }
    valid_inputs = true;
    return { name, desc, val };
}

//Função para validação do preço
function price_valid(field) {
    if (Number(field.value) <= 0) {
        field.placeholder = 'Deve ser MAIOR que 0';
        field.value = '';
    }
}

prod_price.addEventListener('change', () => price_valid(prod_price));
document.querySelector('#modal_prod_price').addEventListener('change', () => price_valid(document.querySelector('#modal_prod_price')));

//Botão salvar do modal
const modal_btn_save = document.getElementById('modal_btn_save');
if (modal_btn_save) {
    modal_btn_save.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = document.getElementById('modal_prod_id').value;
        const name = document.getElementById('modal_prod_name').value;
        const desc = document.getElementById('modal_prod_desc').value;
        const val = document.getElementById('modal_prod_price').value;

        clear_input(name, desc, val, confirm);
        if (!valid_inputs) {
            return;
        }

        salvar_prod(id, name, desc, val);
        modal.classList.remove('active');
        show_prod_list();
        valid_inputs = false;
    });
}

//Função para mostrar a lista de produtos
function show_prod_list() {
    if (prod_list.length === 0) {
        show_prod.classList.remove('active');
        return;
    }
    show_prod.classList.add('active');
    table.innerHTML = '';
    prod_list.forEach((prod) => {
        const tr = document.createElement('tr');

        const td0 = document.createElement('td');
        td0.textContent = prod.name;
        td0.addEventListener('click', (e) => {
            e.stopPropagation();
            const inputs = modal.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                input.disabled = true;
            });
            modal.classList.add('active');
            document.getElementById('modal_action').textContent = 'Detalhes produto';
            document.getElementById('modal_prod_id').value = prod.id;
            document.getElementById('modal_prod_name').value = prod.name;
            document.getElementById('modal_prod_desc').value = prod.desc;
            document.getElementById('modal_prod_price').value = prod.val;
            modal_btn_save.style.display = 'none';
            document.getElementById('modal_prod_confirm').style.display = 'none';

        });

        const td1 = document.createElement('td');
        td1.textContent = `R$${prod.val}`;

        const td2 = document.createElement('td');
        const btn_edit = document.createElement('button');
        btn_edit.innerHTML = `<img src="./icon/edit.svg" alt="Editar">`;
        btn_edit.addEventListener('click', (e) => {
            e.stopPropagation();
            const inputs = modal.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                input.disabled = false;
            });
            modal.classList.add('active');
            document.getElementById('modal_action').textContent = 'Editar produto';
            document.getElementById('modal_prod_id').value = prod.id;
            document.getElementById('modal_prod_id').disabled = true;
            document.getElementById('modal_prod_name').value = prod.name;
            document.getElementById('modal_prod_desc').value = prod.desc;
            document.getElementById('modal_prod_price').value = prod.val;
            document.getElementById('modal_prod_confirm').style.display = 'block';
            modal_btn_save.style.display = 'block';
        });

        const td3 = document.createElement('td');
        const btn_delete = document.createElement('button');
        btn_delete.innerHTML = `<img src="./icon/delete.svg" alt="Deletar">`;
        btn_delete.addEventListener('click', (e) => {
            e.stopPropagation();
            for (let i = 0; i < prod_list.length; i++) {
                if (prod_list[i].id === prod.id) {
                    prod_list.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem('prod_list', JSON.stringify(prod_list));
            show_prod_list();
            modal.classList.remove('active');
        });

        tr.appendChild(td0);
        tr.appendChild(td1);
        td2.appendChild(btn_edit);
        td3.appendChild(btn_delete);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    })
}

function salvar_prod(id, nome, desc, val) {
    let edit = false;
    for (let i = 0; i < prod_list.length; i++) {
        if (prod_list[i].id === id) {
            prod_list[i].name = nome;
            prod_list[i].desc = desc;
            prod_list[i].val = val;
            edit = true;
            break;
        }
    }
    if (!edit) {
        prod_list.push({
            'id': id,
            'name': nome,
            'desc': desc,
            'val': val
        });
    }
    localStorage.setItem('prod_list', JSON.stringify(prod_list));
}

modal.addEventListener('click', (e) => {
    if (e.target.id === 'modal_prod') {
        modal.classList.remove('active');
    }
});