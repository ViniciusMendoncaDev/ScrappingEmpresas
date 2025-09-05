import UsuariosSchema from "../database/schemas/usuariosSchema.js";

class Usuarios {

  async atualizarPerfil(dados) {
    try {
      // Busca o usuário pelo ID
      const {
        id,
        nome_completo,
        celular,
        localizacao,
        linkedin,
        github,
        site_pessoal,
        titulo,
        descricao,
        experiencias,
        habilidades,
        objetivos,
        projetos,
        disponibilidade,
        educacao,
      } = dados;

      const usuario = await UsuariosSchema.findOne({ email: "emailteste4r@gmail.com" });

      if (!usuario) {
        return { success: false, message: "Usuário não encontrado" };
      }

      // Atualiza os campos com os dados fornecidos, ou mantém os dados atuais
      usuario.nome_completo = nome_completo || usuario.nome_completo;
      usuario.celular = celular || usuario.celular;
      usuario.localizacao = localizacao || usuario.localizacao;

      // Atualiza as redes sociais
      usuario.redes_sociais.linkedin =linkedin || usuario.redes_sociais.linkedin;
      usuario.redes_sociais.github = github || usuario.redes_sociais.github;
      usuario.redes_sociais.site_pessoal = site_pessoal || usuario.redes_sociais.site_pessoal;

      // Atualiza o perfil profissional
      usuario.perfil_profissional.titulo = titulo || usuario.perfil_profissional.titulo;
      usuario.perfil_profissional.descricao = descricao || usuario.perfil_profissional.descricao;
      usuario.perfil_profissional.experiencias = experiencias || usuario.perfil_profissional.experiencias;
      usuario.perfil_profissional.habilidades = habilidades || usuario.perfil_profissional.habilidades;
      usuario.perfil_profissional.objetivos = objetivos || usuario.perfil_profissional.objetivos;
      usuario.perfil_profissional.projetos = projetos || usuario.perfil_profissional.projetos;
      usuario.perfil_profissional.disponibilidade = disponibilidade || usuario.perfil_profissional.disponibilidade;
      usuario.perfil_profissional.educacao = educacao || usuario.perfil_profissional.educacao;

      // Salva as alterações no banco de dados
      const resultado = await usuario.save();

      if (resultado) {
        return { success: true, message: "Perfil atualizado com sucesso" };
      } else {
        return { success: false, message: "Erro ao atualizar perfil" };
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      return { success: false, message: "Erro interno ao atualizar perfil" };
    }
  }

  async pegarUsuarioPorEmail(email){
    try {
      const result = await UsuariosSchema.findOne({ email: email });
      
      if(!result){
        return {success: false, message: "Nenhum usuário encontrado para esse email."}
      }
      return {success:true, dados:result}
    } catch (error) {
      
    }
  }

  async criarUsuario(email,senhaHash){
    try {
      const result = await UsuariosSchema.create({email, senha: senhaHash });
      if(!result){
        return {success: false, message: "Falha ao criar usuário."}
      }
      return {success:true}
    } catch (error) {
      
    }
  }
}

export default new Usuarios();
