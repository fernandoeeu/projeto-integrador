const express = require("express");

const Receita = require("../models/Receita");

const auth = require("../middleware/auth");

const router = express.Router();

/*
  
*/
// router.post("/receitas", async (req, res) => {
//   try {
//     //const receita = await Receita.create(req.body);

//     return res.send({ a: 'a' });
//   } catch (err) {
//     return res.status(400).send({ error: "Query failed..." });
//   }
// });

router.post("/receitas", async (req, res) => {
  let ingQ = []
  let queryF = ''
  // { $and: [{ "ingredientes": { $regex: 'sa' } }, { "ingredientes": { $regex: 'cc' } }] }
  const query = req.body

  // console.log('body', req.body)
  query.map(i => {
    ingQ.push(`{"ingredientes": {"$regex": "${i}"} }`)
  })
  queryF = `{"$and": [ ${ingQ} ]}`
  queryF = JSON.parse(queryF)
  if (query.length > 0) {
    try {
      const receitas = await Receita.find(queryF)
        .limit(20)
        .sort({ id: 1 });
      return res.json(receitas);
    } catch (err) {
      console.log(err)
      return res.status(400).send({ error: "Query Failed..." });
    }
  }
});

router.get("/receitas/all", async (req, res) => {
  try {
    const receitas = await Receita.find({}).sort({ id: 1 });

    return res.json(receitas);
  } catch (err) {
    return res.status(400).send({ error: "Query Failed..." });
  }
});

router.get("/receitas/busca/:id", async (req, res) => {
  try {
    const receita = await Receita.findById(req.params.id);

    return res.json(receita);
  } catch (err) {
    return res.status(400).send({ error: "Receita não encontrada..." });
  }
});

router.post("/receitas/busca/:uid", async (req, res) => {
  try {
    const receitas = await Receita.find({ createdBy: req.params.uid })

    return res.json(receitas)
  } catch (err) {
    return res.status(400).send({ error: "usuario não encontrado" })
  }
});

router.post("/receitas/atualizar/:rid", (req, res) => {
  try {
    // const res = await req.body
    return res.json(req.body)
    // const receitaAtualizada = await Receita.updateOne(
    //   { _id: req.body.rid},
    //   {

    //   }
    // )
  } catch (err) {
    return res.status(400).send({ error: "receita não encontrado" })
  }
})


router.post("/receitas/criar", async (req, res) => {
  let { titulo, categoriasPrincipais, categoriasSecundarias, custo, dificuldade, passos, tempo, ingredientes, uid } = req.body;
  // console.log(req.body)
  // try {
  //   categoriasPrincipais = categoriasPrincipais.map(categoria => categoria.trim());
  //   categoriasSecundarias = categoriasSecundarias.map(categoria => categoria.trim());
  //   ingredientes = ingredientes.map(ingrediente => ingrediente.trim());
  // } catch (e) {
  //   return res.status(400).send({ error: "Por favor, entre com os ingredientes e categorias" })
  // }
  let cpf = []
  let iqtd = []
  let inome = []
  categoriasPrincipais.map(cp => cpf.push(cp.nome))
  ingredientes.map(ing => {
    iqtd.push(ing.qtd)
    inome.push(ing.nome)
  })

  let receita = new Receita()
  receita.nome = titulo
  receita.ingredientes = inome
  receita.ingredientesQtd = iqtd
  receita.categoriasPrincipais = cpf
  receita.categoriasSecundarias = categoriasSecundarias
  receita.createdBy = uid
  custo.length > 0 ? receita.custo = custo : null
  tempo.length > 0 ? receita.tempo = tempo : null
  dificuldade.length > 0 ? receita.dificuldade = dificuldade : null
  receita.passos = passos
  receita.save(function (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({ error: "receita não encontrado" })
    } else {
      console.log(receita)
      res.send({ msg: 'ok' })
    }
  })
  //res.send({ data: req.body.user.id });
  // return console.log(req.body);
  //let receita = res.json({ body: req.body })
});

module.exports = app => app.use("/api", router);
