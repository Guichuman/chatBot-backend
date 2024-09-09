import Pedido from "../models/Pedido.js";
import Estoque from "../models/Estoque.js";
import { Sequelize } from "sequelize";

const pizzas = {
  calabresa: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "molho de tomate", quantidade: 1 },
      { nomeIngrediente: "mussarela", quantidade: 5 },
      { nomeIngrediente: "calabresa", quantidade: 3 },
    ],
  },
  portuguesa: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "molho de tomate", quantidade: 1 },
      { nomeIngrediente: "mussarela", quantidade: 4 },
      { nomeIngrediente: "presunto", quantidade: 2 },
      { nomeIngrediente: "ervilha", quantidade: 1 },
    ],
  },
  frangoComCatupiry: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "molho de tomate", quantidade: 1 },
      { nomeIngrediente: "mussarela", quantidade: 4 },
      { nomeIngrediente: "frango", quantidade: 100 },
      { nomeIngrediente: "catupiry", quantidade: 1 },
    ],
  },
  mussarela: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "molho de tomate", quantidade: 1 },
      { nomeIngrediente: "mussarela", quantidade: 4 },
      { nomeIngrediente: "manjeiricao", quantidade: 1 },
    ],
  },
  calabacon: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "molho de tomate", quantidade: 1 },
      { nomeIngrediente: "mussarela", quantidade: 4 },
      { nomeIngrediente: "calabresa", quantidade: 2 },
      { nomeIngrediente: "bacon", quantidade: 1 },
    ],
  },
  chocolate: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "chocolate", quantidade: 4 },
    ],
  },
  chocolateBranco: {
    ingredientes: [
      { nomeIngrediente: "massa", quantidade: 1 },
      { nomeIngrediente: "chocolateBranco", quantidade: 1 },
    ],
  },
};

function transformToArray(itensPedido) {
  if (Array.isArray(itensPedido)) {
    return itensPedido;
  }

  if (typeof itensPedido === "object") {
    return Object.keys(itensPedido).map((key) => itensPedido[key]);
  }

  throw new Error("itensPedido is neither an array nor an object with items.");
}

const verificarEstoque = async (pizza, quantidadePedido) => {
  for (const ingrediente of pizza.ingredientes) {
    const estoqueItem = await Estoque.findOne({
      where: { nomeIngrediente: ingrediente.nomeIngrediente },
    });

    if (
      !estoqueItem ||
      estoqueItem.quantidadeDisponivel <
        ingrediente.quantidade * quantidadePedido
    ) {
      return false;
    }
  }
  return true;
};

export const pedidoController = {
  create: async (req, res) => {
    let { itensPedido, dataHora, situacao } = req.body;
    try {
      for (const item of itensPedido) {
        const saborPedido = item.sabor;
        const quantidadePedido = item.quantidade;
        const pizza = pizzas[saborPedido];

        
        if (pizza) {
          const estoqueSuficiente = await verificarEstoque(
            pizza,
            quantidadePedido
          );

          if (!estoqueSuficiente) {
            return res.status(400).json({
              error: `Estoque insuficiente para o sabor: ${saborPedido}`,
            });
          }
        } else {
          return res
            .status(400)
            .json({ error: `Pizza '${item.sabor}' não encontrada` });
        }
      }

      for (const item of itensPedido) {
        const saborPedido = item.sabor;
        const quantidadePedido = item.quantidade;
        const pizza = pizzas[saborPedido];

        if (pizza) {
          for (const ingrediente of pizza.ingredientes) {
            await Estoque.update(
              {
                quantidadeDisponivel: Sequelize.literal(
                  `quantidadeDisponivel - ${
                    ingrediente.quantidade * quantidadePedido
                  }`
                ),
              },
              { where: { nomeIngrediente: ingrediente.nomeIngrediente } }
            );
          }
        }
      }

      const novoPedido = await Pedido.create({
        itensPedido: itensPedido,
        dataHora: Date.now(),
        situacao: "pendente",
      });
      if (novoPedido) {
        res.status(201).json({ pedidoRealizado: true });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const pedidos = await Pedido.findAll();
      res.status(200).json(pedidos);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  findById: async (req, res) => {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (pedido) {
        res.status(200).json(pedido);
      } else {
        res.status(404).json({ error: "Pedido não encontrado" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const [updated] = await Pedido.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedPedido = await Pedido.findByPk(req.params.id);
        res.status(200).json(updatedPedido);
      } else {
        res.status(404).json({ error: "Pedido não encontrado" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Pedido.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).json({ message: "Pedido deletado" });
      } else {
        res.status(404).json({ error: "Pedido não encontrado" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
