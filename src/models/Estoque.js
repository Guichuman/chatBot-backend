import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Estoque = sequelize.define('Estoque', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomeIngrediente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantidadeDisponivel: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'quantidadedisponivel'
  },
  unidadeMedida: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Estoques',
  schema: 'public',
});

export default Estoque;
