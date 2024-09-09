import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import estoqueRoutes from "../src/routes/estoqueRoutes.js";
import pedidoRoutes from "../src/routes/pedidosRoutes.js";
import cors from "cors"
import Estoque from "./models/Estoque.js";
import bodyParser from "body-parser";

dotenv.config();


const app = express();
app.use(express.json());
app.use(bodyParser.json()); 
app.use("/estoques", estoqueRoutes);
app.use("/pedidos", pedidoRoutes);

app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
