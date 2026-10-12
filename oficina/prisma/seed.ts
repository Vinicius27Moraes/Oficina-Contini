import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------
  // Usuário master — sempre garantido (upsert), usando as credenciais do
  // .env. Rode este seed de novo a qualquer momento para redefinir a senha
  // do master caso a perca.
  // ---------------------------------------------------------------------
  const masterEmail = (process.env.MASTER_EMAIL ?? "admin@oficina.com").toLowerCase();
  const masterSenha = process.env.MASTER_PASSWORD ?? "TrocarSenha123!";
  const senhaHash = await bcrypt.hash(masterSenha, 10);

  await prisma.usuario.upsert({
    where: { email: masterEmail },
    update: { senhaHash, role: "MASTER", ativo: true },
    create: { nome: "Administrador", email: masterEmail, senhaHash, role: "MASTER" },
  });

  console.log(`Usuário master pronto: ${masterEmail}`);
  if (!process.env.MASTER_PASSWORD) {
    console.log(`Senha padrão usada: ${masterSenha} — troque assim que fizer login.`);
  }

  // ---------------------------------------------------------------------
  // Configuração padrão da oficina (usada no cabeçalho dos PDFs)
  // ---------------------------------------------------------------------
  await prisma.configuracaoOficina.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", nome: "Minha Oficina" },
  });

  // ---------------------------------------------------------------------
  // Dados de exemplo (só na primeira vez, se ainda não houver clientes)
  // ---------------------------------------------------------------------
  const jaTemDados = await prisma.cliente.findFirst();
  if (jaTemDados) {
    console.log("Dados de exemplo já existem, pulando.");
    return;
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: "Maria Oliveira",
      telefone: "(11) 98888-1234",
      email: "maria@example.com",
      veiculos: {
        create: { placa: "ABC1D23", marca: "Volkswagen", modelo: "Gol", ano: 2019, cor: "Prata" },
      },
    },
    include: { veiculos: true },
  });

  const funcionario = await prisma.funcionario.create({
    data: { nome: "João Mecânico", cargo: "Mecânico chefe", telefone: "(11) 97777-5555" },
  });

  const peca = await prisma.peca.create({
    data: {
      codigo: "PC-0001",
      nome: "Filtro de óleo",
      quantidade: 12,
      quantidadeMinima: 4,
      precoCusto: 18.5,
      precoVenda: 39.9,
    },
  });

  await prisma.ordemServico.create({
    data: {
      clienteId: cliente.id,
      veiculoId: cliente.veiculos[0].id,
      funcionarioId: funcionario.id,
      descricaoProblema: "Troca de óleo e filtro, revisão dos freios.",
      itens: {
        create: [
          { descricao: "Filtro de óleo", quantidade: 1, valorUnitario: 39.9, pecaId: peca.id },
          { descricao: "Mão de obra — troca de óleo", quantidade: 1, valorUnitario: 60 },
        ],
      },
      valorTotal: 99.9,
    },
  });

  console.log("Dados de exemplo criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
