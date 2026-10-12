import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  telefone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  cpfCnpj: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
});

export const veiculoSchema = z.object({
  placa: z
    .string()
    .min(7, "Placa inválida")
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "")),
  marca: z.string().min(2, "Informe a marca"),
  modelo: z.string().min(1, "Informe o modelo"),
  ano: z.coerce.number().int().min(1950).max(2100).optional(),
  cor: z.string().optional().or(z.literal("")),
  clienteId: z.string().min(1, "Selecione o cliente"),
});

export const pecaSchema = z.object({
  codigo: z.string().min(1, "Informe o código"),
  nome: z.string().min(2, "Informe o nome da peça"),
  quantidade: z.coerce.number().int().min(0),
  quantidadeMinima: z.coerce.number().int().min(0),
  precoCusto: z.coerce.number().min(0),
  precoVenda: z.coerce.number().min(0),
});

export const funcionarioSchema = z.object({
  nome: z.string().min(3, "Informe o nome"),
  cargo: z.string().min(2, "Informe o cargo"),
  telefone: z.string().optional().or(z.literal("")),
});

export const ordemSchema = z.object({
  clienteId: z.string().min(1, "Selecione o cliente"),
  veiculoId: z.string().min(1, "Selecione o veículo"),
  funcionarioId: z.string().optional().or(z.literal("")),
  descricaoProblema: z.string().min(5, "Descreva o problema relatado"),
  observacoes: z.string().optional().or(z.literal("")),
});

export const itemOrdemSchema = z.object({
  ordemId: z.string().min(1),
  descricao: z.string().min(2, "Descreva o item"),
  quantidade: z.coerce.number().int().min(1),
  valorUnitario: z.coerce.number().min(0),
  pecaId: z.string().optional().or(z.literal("")),
});

export const usuarioSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
  role: z.enum(["MASTER", "PADRAO"]).default("PADRAO"),
});
