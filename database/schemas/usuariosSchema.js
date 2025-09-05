import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
  nome_completo: { type: String },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  celular: { type: String },
  localizacao: { type: String },
  redes_sociais: {
    linkedin: { type: String },
    github: { type: String },
    site_pessoal: { type: String },
  },
  perfil_profissional: {
    titulo: { type: String },
    descricao: { type: String },
    experiencias: { type: String },
    habilidades: { type: String },
    objetivos: { type: String },
    projetos: { type: String },
    disponibilidade: { type: String },
    educacao: { type: String },
  },

  status: { type: String, default: "ativo" },
  data_criacao: { type: Date, default: Date.now },
  ultimo_acesso: { type: Date },

  plano: { type: String, default: "gratuito" },
  data_vencimento: { type: Date },
  pagamentos: [
    {
      valor: { type: Number },
      metodo: { type: Number },
      data: { type: Date },
    },
  ],
  buscas_realizadas: { type: Number, default: 0 },
  historico_buscas: [
    {
      busca: String,
      cidade: String,
      data: Date,
    },
  ],
});

const usuarios = mongoose.model("usuarios", usuariosSchema);

export default usuarios;
