const firebaseConfig = {
    apiKey: "AIzaSyAq_prIeX49TqGM6U-2HfNkO_eRW8Du5Cc",
    authDomain: "pet-impedimentos.firebaseapp.com",
    databaseURL: "https://pet-impedimentos-default-rtdb.firebaseio.com",
    projectId: "pet-impedimentos",
    storageBucket: "pet-impedimentos.appspot.com",
    messagingSenderId: "954522036021",
    appId: "1:954522036021:web:87bbe3b635cbcbb113ce7c",
    measurementId: "G-5VR17YG7BM"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


function gerarLista(){
    const div = document.getElementById("petianos");
    
    const collectionRef = db.collection('users');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        const nome = doc.data().nome;
        const ul = document.createElement("ul");
        ul.textContent = nome;
        div.appendChild(ul);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}


function gerarDropdown(){
    const collectionRef = db.collection('projetos');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            const petiano = doc.data();
            const nome = petiano.nome;
            const membros = petiano.membros;

            const dropdown = document.createElement("div");
            dropdown.className = "dropdown";
            const button = document.createElement("button");
            button.className = "dropdown-btn";
            button.textContent = nome;
            const dropCont = document.createElement("div");
            dropCont.className = "dropdown-content";
            const ul = document.createElement("ul");

            for(const dados of membros){
                const li = document.createElement("li");
                const span = document.createElement("span");
                span.textContent = dados;
                const bt = document.createElement("button");
                bt.className = "item-btn";
                bt.textContent = "X";

                li.appendChild(span);
                li.appendChild(bt);
                ul.appendChild(li);
            }
            const divBT = document.createElement("div");
            divBT.className = "divBT";
            const novoMembro = document.createElement("button");
            novoMembro.textContent = "+ Novo Membro";
            novoMembro.className = "novoMembro";
            const excluirProj = document.createElement("button");
            excluirProj.textContent = "Excluir Projeto";
            excluirProj.className = "excluirProj";
            divBT.appendChild(novoMembro);
            divBT.appendChild(excluirProj);
            dropCont.appendChild(divBT);
            dropCont.appendChild(ul);
            dropdown.appendChild(button);
            dropdown.appendChild(dropCont);
            const lista = document.querySelector("#lista");
            lista.appendChild(dropdown);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}


function excluirPetiano(nomeProjeto, nomePetiano, li) {
    db.collection('projetos')
      .where('nome', '==', nomeProjeto)
      .get()
      .then(snapshot => {
          if (snapshot.empty) {
              console.error('Projeto não encontrado');
              return;
          }

          const doc = snapshot.docs[0];
          const membros = doc.data().membros;

          const novoArrayMembros = membros.filter(membro => membro !== nomePetiano);

          doc.ref.update({
              membros: novoArrayMembros
          })
          .then(() => {
              console.log('Membro excluído com sucesso!');
          })
          .catch(error => {
              console.error('Erro ao excluir membro:', error);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar projeto:', error);
      });

      li.remove();
}


function cadastro(){
    const nomeProj = document.getElementById("nomeProj").value;
    const corProj = document.getElementById("corProj").value;

    db.collection("projetos").add({
        nome: nomeProj,
        cor: corProj,
        membros: []
    })
    .then(() => {
        console.log("Cadastro Realizado!");
    })
    .catch((error) => {
        console.error("Erro no cadastro: ", error);
    });
    closeModal();
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    const button = document.createElement("button");
    button.className = "dropdown-btn";
    button.textContent = nomeProj;
    const dropCont = document.createElement("div");
    dropCont.className = "dropdown-content";
    const ul = document.createElement("ul");
    const divBT = document.createElement("div");
    const novoMembro = document.createElement("button");
    novoMembro.textContent = "+ Novo Membro";
    novoMembro.className = "novoMembro";
    const excluirProj = document.createElement("button");
    excluirProj.textContent = "Excluir Projeto";
    excluirProj.className = "excluirProj";
    divBT.appendChild(novoMembro);
    divBT.appendChild(excluirProj);
    dropCont.appendChild(divBT);
    dropCont.appendChild(ul);
    dropdown.appendChild(button);
    dropdown.appendChild(dropCont);
    const lista = document.querySelector("#lista");
    lista.appendChild(dropdown);     
}

function confirmarDelete(mensagem, callback) {
    const confirmacao = window.confirm(mensagem);
    if (confirmacao) {
      callback();
    }
}

function deleteProj(projID, dropdown){
    const mensagem = "Tem certeza que deseja deletar esse projeto?";
  
    confirmarDelete(mensagem, () => { 
        const docRef = db.collection('projetos').doc(projID);

        docRef.delete()
            .then(() => {
                console.log("Documento deletado com sucesso!");                
            })
            .catch((error) => {
                console.error("Erro ao deletar documento:", error);
            });
        dropdown.remove();
    });    
}

function excluirProjeto(nomeProj, dropdown){
    const projRef = db.collection('projetos');    

    projRef.where('nome', '==', nomeProj)
    .get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('Nenhum projeto encontrado com esse nome.');
        } else {
            snapshot.docs.forEach(doc => {
                deleteProj(doc.id, dropdown);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar projeto:', error);
    });
}

function findDropdownByButtonText(buttonText) {   
    const buttons = document.querySelectorAll('.dropdown-btn');   
    for (let button of buttons) {
      if (button.textContent.trim() === buttonText) {       
        const dropdown = button.closest('.dropdown');
        return dropdown;
      }
    }
    return null;
}

function addMembro(idProj, nomeMem, nomeProj) {
    const docRef = db.doc(`projetos/${idProj}`);

    docRef.update({
        membros: firebase.firestore.FieldValue.arrayUnion(nomeMem)
    })
    .then(() => {
        console.log('Membro adicionado com sucesso!');

    })
    .catch((error) => {
        console.error('Erro ao adicionar membro:', error);
    });

    const dropdown = findDropdownByButtonText(nomeProj);
    const ul = dropdown.querySelector('ul');
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = nomeMem;    
    const btn = document.createElement('button');
    btn.textContent = 'X';
    btn.classList.add('item-btn');   
    li.appendChild(span);
    li.appendChild(btn);  
    ul.appendChild(li);
}


function closeModal() {    
    const mod = document.getElementById("addProj");    
    mod.classList.remove('active')
}
function closeModal2() {
    const mod = document.getElementById("addMembro");    
    mod.classList.remove('active')
}
document.getElementById("salvarBT").onclick = function()
{cadastro()};
document.getElementById("cancelarBT").onclick = function()
{closeModal()};


document.getElementById("fecharModalMem").onclick = function()
{closeModal2()};

document.getElementById("newProj").onclick = function()
{openModal("addProj")};


function openModal(modalNome){
    const modal = document.getElementById(modalNome);
    modal.classList.add('active');
}

function openModalMem(nomeProjeto){
    const modal = document.getElementById("addMembro");
    const title = document.getElementById("addMemTitle");
    title.textContent = nomeProjeto;
    modal.classList.add('active');
}

const lista = document.getElementById("lista");
lista.addEventListener('click', (event) => {

  if (event.target.classList.contains('dropdown-btn')) {
    const content = event.target.nextElementSibling;
    content.classList.toggle('show');

  }else if(event.target.classList.contains('item-btn')){
    const li = event.target.parentNode;
    const nomePetiano = li.querySelector('span').textContent;
    const nomeProjeto = li.closest('.dropdown').querySelector('.dropdown-btn').textContent;
    alert(`Você deseja excluir o petiano ${nomePetiano} do projeto ${nomeProjeto}?`);
    excluirPetiano(nomeProjeto, nomePetiano, li);

  }else if(event.target.classList.contains('excluirProj')){
    const nomeProjeto = event.target.closest('.dropdown').querySelector('.dropdown-btn').textContent;
    const dropdown = event.target.closest('.dropdown');
    excluirProjeto(nomeProjeto, dropdown);

  }else if (event.target.classList.contains('novoMembro')) {
    //const projeto = event.target.closest('.dropdown').querySelector('.dropdown-btn').textContent;
    const li = event.target.parentNode;
    const nomeProjeto = li.closest('.dropdown').querySelector('.dropdown-btn').textContent;
    openModalMem(nomeProjeto);
  }
});

const petianos = document.getElementById('petianos');
petianos.addEventListener('click', (event) => {    
    const ul = event.target;     
    const nomeProj = ul.closest('.modal').querySelector('#addMemTitle').textContent;    

    const projRef = db.collection('projetos');
    projRef.where('nome', '==', nomeProj)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('Nenhum projeto encontrado com esse nome.');
            } else {
                snapshot.docs.forEach(doc => {
                    addMembro(doc.id, ul.textContent, nomeProj);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar projeto:', error);
        });
});

gerarDropdown();
gerarLista();