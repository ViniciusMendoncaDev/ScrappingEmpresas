import Usuarios from "../model/UsuariosModel.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'; 

dotenv.config()
const secret = process.env.JWT_SECRET; 
class UsuariosController {

   async cadastroUsuario(req, res){
        try {
          const { email, senha } = req.body;
      
          const usuarioExistente = await Usuarios.pegarUsuarioPorEmail(email);
          console.log(usuarioExistente)

          if (usuarioExistente.success) {
            return res.status(400).json({ erro: "E-mail já cadastrado" });
          }
      
          const senhaHash = await bcrypt.hash(senha, 10);
      
          const novoUsuario = await Usuarios.criarUsuario(email,senhaHash);
          console.log(novoUsuario)
          if (!novoUsuario.success) {
            return res.status(400).json({ erro: "Erro ao cadastrar usuário" });
          }

          res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
          
        } catch (err) {
          res.status(500).json({ erro: "Erro ao registrar usuário" });
        }
    }

    async loginUsuario(req, res){
        try {
          const { email, senha } = req.body;
      
          console.log(secret)
          const usuario = await Usuarios.pegarUsuarioPorEmail(email);
          if (!usuario.success) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
          }
      
          const senhaValida = await bcrypt.compare(senha, usuario.dados.senha);
          if (!senhaValida) {
            return res.status(400).json({ erro: "Senha inválida" });
          }
          console.log(usuario.dados)

          const token = jwt.sign({ id: usuario.dados._id }, secret, { expiresIn: "1h" });
          console.log(token)
          res.json({ token });

        } catch (err) {
            console.error("Erro ao gerar token:", err);

          res.status(500).json({ erro: "Erro ao fazer login" });
        }
    }

    async acessarPefil (req, res){
        try {
            var email = req.body.email
          const usuario = await Usuarios.pegarUsuarioPorEmail(email) 
          res.json(usuario);
        } catch (err) {
          res.status(500).json({ erro: "Erro ao buscar perfil" });
        }
    }

    async atualizarPerfil(req, res){

        const schema = Joi.object({
            nome_completo: Joi.string().min(3).max(100).required(),
            celular: Joi.string().pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/).required(), 
            localizacao: Joi.string().max(255).allow(""),
            linkedin: Joi.string().uri().allow(""),
            github: Joi.string().uri().allow(""),
            site_pessoal: Joi.string().uri().allow(""),
            titulo: Joi.string().max(100).allow(""),
            descricao: Joi.string().max(500).allow(""),
            experiencias: Joi.string().max(2000).allow(""),
            habilidades: Joi.string().max(1000).allow(""),
            objetivos: Joi.string().max(1000).allow(""),
            projetos: Joi.string().max(2000).allow(""),
            disponibilidade: Joi.string().valid("Integral", "Parcial", "Freelancer").allow(""),
            educacao: Joi.string().max(1000).allow("")
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                status: "erro",
                mensagem: "Dados inválidos",
                detalhes: error.details.map(err => err.message)
            });
        }
    
        try {
            const resultado = await Usuarios.atualizarPerfil(value);
            console.log(resultado)
            if(!resultado.success){
                return res.json({ status: "false", mensagem: resultado.message });

            }
            return res.json({ status: "sucesso", mensagem: "Perfil atualizado" });
        } catch (err) {
            return res.status(500).json({ status: "erro", mensagem: "Erro interno ao atualizar perfil", erro: err.message });
        }

        // var {nome_completo, celular, localizacao, linkedin, github,
        //      site_pessoal, titulo, descricao, experiencias, habilidades,
        //       objetivos, projetos, disponibilidade, educacao } = req.body

        //       console.log(nome_completo, celular, localizacao, linkedin, github,
        //         site_pessoal, titulo, descricao, experiencias, habilidades,
        //          objetivos, projetos, disponibilidade, educacao)


    }
    // async loginGoogle(req, res, next) {
    //     passport.authenticate('google', { scope: ['email'] })(req, res, next);
    //   }
    
    //   async loginGoogleCallback(req, res, next) {
    //     passport.authenticate('google', { failureRedirect: '/login' })(req, res, async (err, user) => {
    //       if (err) {
    //         return res.status(500).send("Erro ao autenticar com o Google");
    //       }
    
    //       req.login(user, (err) => {
    //         if (err) return next(err);
    //         res.redirect('/dashboard'); 
    //       });
    //     });
    //   }
    
}

export default new UsuariosController();
