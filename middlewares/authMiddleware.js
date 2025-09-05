import jwt from "jsonwebtoken";
import dotenv from 'dotenv'; 
dotenv.config()

export default  (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Guarda o usuário autenticado
    next();
  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
  }
};
