class Cliente {
    constructor(id, nome, email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}
class ClienteRepository {
    constructor() {
        this.dbKey = '@AppDesktop:clientes';
    }
    salvar(cliente) {
        const clientes = this.listarTodos();
        const index = clientes.findIndex(c => c.id == cliente.id);
        if (index >= 0) {
            clientes[index] = cliente; 
        } else {
            cliente.id = Date.now(); 
            clientes.push(cliente);  
        }
        localStorage.setItem(this.dbKey, JSON.stringify(clientes));
    }
    listarTodos() {
        const dados = localStorage.getItem(this.dbKey);
        return dados ? JSON.parse(dados) : [];
    }
    excluir(id) {
        const clientes = this.listarTodos().filter(c => c.id != id);
        localStorage.setItem(this.dbKey, JSON.stringify(clientes));
    }
}
const repo = new ClienteRepository();
const form = document.querySelector('#clienteForm');
const tabela = document.querySelector('#tabelaClientes');
const renderizarTabela = () => {
    const clientes = repo.listarTodos();
    tabela.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td class="text-center">
                <button class="btn-secondary" onclick="app.prepararEdicao(${cliente.id})">Editar</button>
                <button class="btn-danger" onclick="app.remover(${cliente.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
};
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.querySelector('#clienteId').value;
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const cliente = new Cliente(id, nome, email);
    repo.salvar(cliente);
    form.reset();
    document.querySelector('#clienteId').value = '';
    renderizarTabela();
});
window.app = {
    remover: (id) => {
        if (confirm("Deseja realmente excluir este cliente?")) {
            repo.excluir(id);
            renderizarTabela();
        }
    },
    prepararEdicao: (id) => {
        const cliente = repo.listarTodos().find(c => c.id == id);
        document.querySelector('#clienteId').value = cliente.id;
        document.querySelector('#nome').value = cliente.nome;
        document.querySelector('#email').value = cliente.email;
        document.querySelector('#nome').focus();
    }
};
document.addEventListener('DOMContentLoaded', renderizarTabela);