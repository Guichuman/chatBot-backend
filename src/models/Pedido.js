import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itensPedido: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  situacao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Pedidos',
  schema: 'public',
});

export default Pedido;
