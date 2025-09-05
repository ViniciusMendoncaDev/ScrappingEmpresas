import express from "express"
var app = express();
var router = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js"

import InformacoesEmpresasController from "../controller/InformacoesEmpresasController.js"
import UsuariosController from "../controller/UsuariosController.js"
import EmailsController from "../controller/EmailsController.js"

// INFORMAÇÕES EMPRESA ----------
router.get("/informacoesEmpresas", InformacoesEmpresasController.retornarInformacoesEmpresas)
router.get("/informacoesEmpresas/:email?", InformacoesEmpresasController.retornarInformacoesEmpresas)
router.post("/informacoesEmpresas", InformacoesEmpresasController.salvarInformacoesEmpresa)
router.delete("/informacoesEmpresas/:email", InformacoesEmpresasController.deletarInformacoesEmpresa)
router.get("/emailsEmpresas/:cidade?", InformacoesEmpresasController.retornarEmailsEmpresas)
router.get("/informacoesEmpresas/todos/emails", InformacoesEmpresasController.retornarTodosEmailsEmpresas)

// ENVIO EMAILS ----------
router.post("/enviarEmails", EmailsController.enviarEmails)


// USUARIOS ----------
router.post("/cadastro/usuario", UsuariosController.cadastroUsuario)
router.post("/atualizar/perfil",authMiddleware, UsuariosController.atualizarPerfil)
router.get("/perfil/usuario", authMiddleware, UsuariosController.acessarPefil)
router.post("/login/usuario", UsuariosController.loginUsuario)


export default router;