import db from "../../config/db.js";

import {
  selecionarUnicoProjeto,
  selectTodosProjetos,
  adicionarNovoProjeto,
  alterarUmProjeto,
  deletarUmProjeto,
  deletarMovimentacao,
  selecionarProjetoCriado,
} from "./queriesProjeto.js";

//VERIFICAR E INFORMAR SE NÃO EXISTEM PROJETOS
export const getProjetos = (req, res) => {
  db.query(selectTodosProjetos, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ message: "Nenhum projeto encontrado" });
    }
    res.status(200).json(result);
  });
};

//VERIFICAR E INFORMAR SE NÃO EXISTE O PROJETO
export const getUmProjeto = (req, res) => {
  const { id } = req.params;

  db.query(selecionarUnicoProjeto, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ message: `Projeto com ID = ${id} não encontrado` });
    }
    res.status(200).json(result);
  });
};

//VERIFICAR E INFORMAR SE OS DADOS SAO VALIDOS
//ARRUMAR FORMATAÇÃO DA DATA
export const adicionarProjeto = (req, res) => {
  const { nome } = req.body;
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ message: "Nome inválido" });
  }
  const novaData = new Date();
  //const novaData = new Date().toISOString().slice(0, 19).replace('T', ' ');

  //fazer verificação de id existente
  db.query(adicionarNovoProjeto, [nome, novaData, 0], (err, result) => {
    if (err) throw err;
    db.query(selecionarProjetoCriado,(err,result) => {
      if(err) throw err;
      res.status(200).json(result[0]);
    })
  });
};

//VERIFICAR E INFORMAR SE O ID EXISTE
export const deletarProjeto = (req, res) => {
  const { id } = req.params;

  //fazer verificação de projeto existente
  db.query(selecionarUnicoProjeto, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ message: `Projeto com ID = ${id} não encontrado` });
    }
    db.query(deletarMovimentacao, [id], (err,result) => {
      if(err) throw err;
      db.query(deletarUmProjeto, [id], (err, result) => {
        if (err) throw err;
        res.status(201).json(`Projeto de ID = ${id} foi DELETADO`);
      });
    })
  });
};

//VERIFICAR E INFORMAR SE OS DADOS SAO VALIDOS
//ASSIM COMO VERIFICAR E INFORMAR SE ID EXISTE
export const alterarProjeto = (req, res) => {
  const { id } = req.params;
  const { nome, saldo } = req.body;

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ message: "Nome inválido" });
  }

  if (saldo == null || typeof saldo !== 'number') {
    return res.status(400).json({ message: "Saldo inválido" });
  }
  
  //fazer verificação de projeto existente
  db.query(selecionarUnicoProjeto, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ message: `Projeto com ID = ${id} não encontrado` });
    }
    db.query(alterarUmProjeto, [nome, saldo, id], (err, result) => {
      if (err) throw err;
      res.status(201).send({ id, nome, saldo });
    });
  });
};
