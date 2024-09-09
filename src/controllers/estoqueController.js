import Estoque  from '../models/Estoque.js';

export const estoqueController = {
  create: async (req, res) => {
    try {
      const novoEstoque = await Estoque.create(req.body);
      res.status(201).json(novoEstoque);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const estoques = await Estoque.findAll();
      const retorno = {
        "estoque_disponivel": true
      }

      res.status(200).json(estoques);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  findById: async (req, res) => {
    try {
      const estoque = await Estoque.findByPk(req.params.id);
      if (estoque) {
        res.status(200).json(estoque);
      } else {
        res.status(404).json({ error: 'Estoque não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const [updated] = await Estoque.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedEstoque = await Estoque.findByPk(req.params.id);
        res.status(200).json(updatedEstoque);
      } else {
        res.status(404).json({ error: 'Estoque não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Estoque.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).json({ message: 'Estoque deletado' });
      } else {
        res.status(404).json({ error: 'Estoque não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
