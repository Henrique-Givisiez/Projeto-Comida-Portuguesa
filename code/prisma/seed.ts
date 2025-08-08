// import { PrismaClient, FormaPagamento, StatusPedido, Turno } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Limpa o banco (apenas em ambiente de desenvolvimento)
//   await prisma.item.deleteMany();


//   // 1. Criar locais de entrega e mapear bairros para seus IDs
//   const locais = await Promise.all([
//     prisma.local.create({ data: { bairro: "Asa Sul", taxa: 5.0 } }),
//     prisma.local.create({ data: { bairro: "Asa Norte", taxa: 20.0 } }),
//     prisma.local.create({ data: { bairro: "Sudoeste", taxa: 10.0 } }),
//     prisma.local.create({ data: { bairro: "Lago Sul", taxa: 25.0 } }),
//     prisma.local.create({ data: { bairro: "Guará 1", taxa: 20.0 } }),
//   ]);
//   const bairroParaId = Object.fromEntries(locais.map(l => [l.bairro, l.local_id]));

//   // 2. Criar clientes manualmente associando ao local correspondente
//   const clientes = await Promise.all([
//     prisma.cliente.create({
//       data: {
//         telefone: "61912345670",
//         nome: "Valentina da Cruz",
//         cpf: "12345678901",
//         endereco: "SQS 217, Bloco X, Apto 100",
//         local_id: bairroParaId["Asa Sul"] ?? (() => { throw new Error("Local 'Asa Sul' não encontrado") })(),
//       }
//     }),
//     prisma.cliente.create({
//       data: {
//         telefone: "61912345671",
//         nome: "Cecília Ferreira",
//         cpf: "98765432109",
//         endereco: "SQN 321, Bloco Z, Apto 110",
//         local_id: bairroParaId["Asa Norte"]  ?? (() => { throw new Error("Local 'Asa Norte' não encontrado") })(),
//       }
//     }),
//     prisma.cliente.create({
//       data: {
//         telefone: "61912345672",
//         nome: "Fernando da Rosa Silva Santos Nogueira Ferreira Junior",
//         endereco: "SQSW 154, Bloco Y, Apto 120",
//         local_id: bairroParaId["Sudoeste"] ?? (() => { throw new Error("Local 'Sudoeste' não encontrado") })(),
//       }
//     }),
//   ]);

//   // 3. Criar itens do cardápio
//   await prisma.item.createMany({
//     data: [
//       { codigo_item: "PZ01", nome_item: "Pizza Margherita", preco: 35.9 },
//       { codigo_item: "RF01", nome_item: "Coca-Cola 2L", preco: 9.9 },
//       { codigo_item: "MS02", nome_item: "Macarrão à bolonhesa", preco: 25.9 },
//       { codigo_item: "PZ02", nome_item: "Pizza Calabresa", preco: 39.9 },
//       { codigo_item: "RF02", nome_item: "Guaraná 2L", preco: 9.9 },
//       { codigo_item: "ET03", nome_item: "Cesta de Pães", preco: 19.9 },
//     ]
//   });

//   // 4. Criar pedidos com itens associados
//   const pedido1 = await prisma.pedido.create({
//     data: {
//       telefone_cliente: clientes[0].telefone,
//       turno: Turno.almoco,
//       local_id: clientes[0].local_id,
//       forma_pagamento: FormaPagamento.dinheiro,
//       endereco: clientes[0].endereco,
//       status: StatusPedido.entregue,
//       pedidoCardapio: {
//         create: [
//           { codigo_item: "PZ01", quantidade: 2 },
//           { codigo_item: "RF01", quantidade: 1 },
//         ]
//       }
//     }
//   });

//   const pedido2 = await prisma.pedido.create({
//     data: {
//       telefone_cliente: clientes[1].telefone,
//       turno: Turno.jantar,
//       local_id: clientes[1].local_id,
//       forma_pagamento: FormaPagamento.pix,
//       endereco: clientes[1].endereco,
//       observacao: "Sem cebola, por favor",
//       status: StatusPedido.pendente,
//       pedidoCardapio: {
//         create: [
//           { codigo_item: "PZ02", quantidade: 1 },
//         ]
//       }
//     }
//   });

//   const pedido3 = await prisma.pedido.create({
//     data: {
//       telefone_cliente: clientes[2].telefone,
//       turno: Turno.almoco,
//       local_id: clientes[2].local_id,
//       forma_pagamento: FormaPagamento.pendente,
//       endereco: clientes[2].endereco,
//       observacao: "Deixar na portaria",
//       status: StatusPedido.cancelado,
//       pedidoCardapio: {
//         create: [
//           { codigo_item: "MS02", quantidade: 1, observacao: "Sem queijo" },
//           { codigo_item: "RF02", quantidade: 1 },
//         ]
//       }
//     }
//   });

//   // 5. Inserir variáveis do sistema
//   await prisma.variavel.createMany({
//     data: [
//       { nome: "senhaOperador", valor: "1234" },
//       { nome: "senhaAdmin", valor: "admin123" },
//     ]
//   });

//   console.log("Seed executada com sucesso.");
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });