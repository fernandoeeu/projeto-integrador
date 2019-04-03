const express = require("express");

const Receita = require("../models/Receita");

const auth = require("../middleware/auth");

const router = express.Router();

/*
  
*/
router.post("/receitas", async (req, res) => {
  try {
    const receita = await Receita.create(req.body);

    return res.send({ receita });
  } catch (err) {
    return res.status(400).send({ error: "Query failed..." });
  }
});

router.get("/receitas", async (req, res) => {
  try {
    const receitas = await Receita.find({
      ing: {
        $all: ["cebola roxa", "banana", "açucar", "ovos"]
      }
    })
      .limit(20)
      .sort({ id: 1 });

    return res.json(receitas);
  } catch (err) {
    return res.status(400).send({ error: "Query Failed..." });
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

router.get("/busca/receita/:id", async (req, res) => {
  try {
    const receita = await Receita.findById(req.params.id);

    return res.json(receita);
  } catch (err) {
    return res.status(400).send({ error: "Receita não encontrada..." });
  }
});

router.post("/receitas/criar", auth, (req, res) => {
  let { titulo, categorias, ingredientes } = req.body;
  categorias = categorias.map(categoria => categoria.trim());
  ingredientes = ingredientes.map(ingrediente => ingrediente.trim());
  const receita = {
    titulo,
    categorias,
    ingredientes
  };
  res.send({ data: receita });
  // return console.log(req.body);
  //let receita = res.json({ body: req.body })
});

module.exports = app => app.use("/api", router);
