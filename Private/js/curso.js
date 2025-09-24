
const formulario = document.getElementById('formCurso');
const btnCadastrar = document.getElementById('btnCadastrar');

formulario.onsubmit = salvarCurso;
exibirTabelaCursos();

function salvarCurso(evento) {
    evento.preventDefault();
    evento.stopPropagation();

    if (validarFormulario()) {
        const id = document.getElementById("id").value;
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const professor = document.getElementById("professor").value;
        const carga_horaria = document.getElementById("carga_horaria").value;
        const nivel = document.getElementById("nivel").value;
        const vagas = document.getElementById("vagas").value;
        const preco = document.getElementById("preco").value;
        const precoFormatado = preco.replace(',', '.');
        const imagem = document.getElementById("imagem").value;

        
        fetch("http://localhost:4000/cursos", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id, nome, descricao, professor, carga_horaria, nivel, vagas,
                preco: precoFormatado,
                imagem
            })
        })
        .then(resposta => resposta.json())
        .then(dados => {
            alert(dados.message);
            if (dados.status) {
                formulario.reset();
                exibirTabelaCursos();
            }
        })
        .catch(erro => {
            alert(`Erro ao salvar o curso: ${erro.message}`);
        });
    }
}

function validarFormulario() {
    if (formulario.checkValidity()) {
        formulario.classList.remove('was-validated');
        return true;
    }
    formulario.classList.add('was-validated');
    return false;
}

function excluirCurso(id) {
    if (confirm(`Deseja realmente excluir o curso com ID ${id}?`)) {
        fetch(`http://localhost:4000/cursos/${id}`, { method: "DELETE" })
            .then(resposta => resposta.json())
            .then(dados => {
                if (dados.status) {
                    exibirTabelaCursos();
                }
                alert(dados.message);
            })
            .catch(erro => {
                alert("Erro ao excluir o curso: " + erro.message);
            });
    }
}

function editarCurso(id) { 
    fetch(`http://localhost:4000/cursos/${id}`, { method: "GET" })
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.status && dados.cursos && dados.cursos.length > 0) {
                const curso = dados.cursos[0];
                
                document.getElementById("id").value = curso.id;
                document.getElementById("nome").value = curso.nome;
                document.getElementById("descricao").value = curso.descricao;
                document.getElementById("professor").value = curso.professor;
                document.getElementById("carga_horaria").value = curso.carga_horaria;
                document.getElementById("nivel").value = curso.nivel;
                document.getElementById("vagas").value = curso.vagas;
                document.getElementById("preco").value = curso.preco.toString().replace('.', ',');
                document.getElementById("imagem").value = curso.imagem;
                
                btnCadastrar.textContent = 'Atualizar';
               
                document.getElementById('id').readOnly = true;
                window.scrollTo(0, 0);
            } else {
                alert(dados.message);
            }
        })
        .catch(erro => {
            alert("Erro ao buscar dados do curso: " + erro.message);
        });
}

function exibirTabelaCursos() {
    const espacoTabela = document.getElementById("tabela");
    espacoTabela.innerHTML = "";

    fetch("http://localhost:4000/cursos", { method: "GET" })
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.status) {
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table-hover";
                tabela.innerHTML = `
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.cursos.map(curso => `
                            <tr>
                                <td>${curso.id}</td>
                                <td>${curso.nome}</td>
                                <td>${curso.descricao}</td>
                                <td>${parseFloat(curso.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td>
                                    <button type="button" class="btn btn-warning btn-sm" onclick="editarCurso(${curso.id})">Editar</button>
                                    <button type="button" class="btn btn-danger btn-sm" onclick="excluirCurso(${curso.id})">Excluir</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                espacoTabela.appendChild(tabela);
            }
        })
        .catch(erro => {
            espacoTabela.innerHTML = `<p class="text-danger">Erro ao carregar cursos: ${erro.message}</p>`;
        });
}