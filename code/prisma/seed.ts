import { PrismaClient, Categoria } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from "bcryptjs";

async function main() {
  // Limpa o banco (apenas em ambiente de desenvolvimento)
  await prisma.variavel.deleteMany();
  await prisma.pedidoItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.comanda.deleteMany();
  await prisma.chamado.deleteMany();

  const senhaHash = await hash("garcom123", 10);
  // 1. Criar variaveis
  await prisma.variavel.create({
    data : {
        chave: "senhaGarcom",
        valor: senhaHash
    }
  })

  // 2. Criar itens do cardapio
  await prisma.item.createMany({
    data: [
      { 
        nome: "Bacalhau à Zé do Pipo", 
        descricao: `Lascas generosas de bacalhau do Porto dessalgado, 
        cuidadosamente envolvidas em um refogado suave de 
        cebolas douradas no azeite, cobertas por um cremoso 
        purê de batatas amanteigado e um toque de maionese gratinada.
        Finalizado com azeitonas pretas e servido levemente gratinado, 
        esse clássico da cozinha portuguesa encanta pelo equilíbrio entre tradição e conforto.`,
        preco: 159.90,
        categoria: Categoria.PRATOS_CASA,
        imageURL: "/bacalhau.jpg"
      },
      { 
        nome: "Alcatra Açoriana", 
        descricao: `Tradicional receita da Ilha Terceira, nos Açores: corte nobre de alcatra bovina, 
        lentamente assada em vinho tinto, toucinho defumado, cebolas, alho e especiarias selecionadas. 
        Cozida em panela de barro para intensificar os sabores, resulta em uma carne macia que desmancha 
        na boca, envolta por um molho aromático e profundo. Uma homenagem à autenticidade e ao calor da cozinha açoriana.`,
        preco: 119.90,
        categoria: Categoria.PRATOS_CASA,
        imageURL: "/alcatra.jpg"
      },
      { 
        nome: "Sopa do Divino", 
        descricao: `Símbolo da generosidade e da fé açoriana, essa receita ancestral é preparada com 
        cortes nobres de carne bovina e suína, pão caseiro embebido em um caldo rico e aromático, 
        lentamente cozido com alho, especiarias e folhas de repolho. Servida em porções abundantes e 
        com sabor profundo, essa sopa celebra a união e a partilha à mesa.`,
        preco: 59.90,
        categoria: Categoria.PRATOS_CASA,
        imageURL: "/sopa.jpg"
      },
      { 
        nome: "Bacalhau Tradicional", 
        descricao: `Postas altas de bacalhau cuidadosamente dessalgadas, cozidas até atingir maciez perfeita 
        e regadas com um generoso fio de azeite extra virgem. Acompanhado de batatas ao murro douradas, cebolas 
        caramelizadas lentamente e azeitonas portuguesas, este prato exala tradição e sabor autêntico de Portugal.`,
        preco: 139.90,
        categoria: Categoria.PEIXES,
        imageURL: "/bacalhau_tradicional.jpg"
      },
      { 
        nome: "Bolinho de Bacalhau", 
        descricao: `Clássico e irresistível petisco português: bolinhos crocantes por fora e incrivelmente 
        macios por dentro, feitos com lascas de bacalhau do Porto, batatas selecionadas e temperos frescos. 
        Fritos no ponto certo para preservar a leveza e o sabor, perfeitos para abrir o apetite com um toque de nostalgia.`,
        preco: 39.90,
        categoria: Categoria.ENTRADAS,
        imageURL: "/bolinho_bacalhau.jpg"
      },
      { 
        nome: "Pastel de Belém", 
        descricao: `Famosa iguaria lisboeta com massa folhada finíssima e crocante, recheada com um creme 
        aveludado de ovos e leite, levemente aromatizado com baunilha e canela. Servido morno e polvilhado 
        com açúcar e canela, este doce é uma verdadeira viagem sensorial à doçaria tradicional portuguesa.`,
        preco: 14.90,
        categoria: Categoria.ENTRADAS,
        imageURL: "/pastel_belem.jpg"
      },
      { 
        nome: "Frango à Portuguesa", 
        descricao: `Suculentos pedaços de frango marinados em vinho branco, alho, louro e pimentão-doce, 
        lentamente assados até ficarem dourados e aromáticos. Servidos com batatas coradas e legumes da estação, 
        é um prato que exala o sabor caseiro e acolhedor da cozinha lusitana.`,
        preco: 84.90,
        categoria: Categoria.PRATOS_CASA,
        imageURL: "/frango_portuguesa.jpg"
      },
      { 
        nome: "Polvo à Lagareiro", 
        descricao: `Polvo macio cozido lentamente e depois levado ao forno, regado com azeite extra virgem, 
        alho e ervas frescas. Acompanhado de batatas ao murro e finalizado com sal grosso, 
        é uma especialidade que une simplicidade e sabor intenso.`,
        preco: 174.90,
        categoria: Categoria.PEIXES,
        imageURL: "/polvo_lagareiro.jpg"
      },
      { 
        nome: "Arroz de Marisco", 
        descricao: `Arroz cremoso e perfumado, preparado com caldo de peixe e mariscos frescos — camarões, 
        mexilhões, amêijoas e lagostins. Enriquecido com pimentão, tomate e coentros, 
        é servido ainda húmido, como manda a tradição das tascas portuguesas.`,
        preco: 149.90,
        categoria: Categoria.PEIXES,
        imageURL: "/arroz_marisco.jpg"
      },
      { 
        nome: "Refrigerante Guaraná", 
        descricao: `Lata de refrigerante Guaraná 350 ml.`,
        preco: 6.90,
        categoria: Categoria.BEBIDAS,
        imageURL: "/guarana.jpg"
      },
      { 
        nome: "Refrigerante Coca-Cola", 
        descricao: `Lata de refrigerante Coca-Cola 350 ml.`,
        preco: 6.90,
        categoria: Categoria.BEBIDAS,
        imageURL: "/coca_cola.png"
      },
      { 
        nome: "Toucinho do Céu", 
        descricao: `Deliciosa sobremesa conventual feita com gemas de ovos, açúcar e amêndoas moídas, 
        resultando em uma textura macia e úmida. Aromatizada com canela e limão, é um pedaço 
        do doce legado dos mosteiros portugueses.`,
        preco: 24.90,
        categoria: Categoria.SOBREMESAS,
        imageURL: "/toucinho_ceu.jpg"
      },
      {
        nome: "Leitão à Bairrada", 
        descricao: `Leitão jovem temperado com alho, sal e uma marinada especial de vinho e especiarias, 
        assado lentamente em forno de lenha até atingir pele crocante e carne extremamente macia. 
        Servido com batatas assadas e laranja, é um ícone gastronômico da região da Bairrada.`,
        preco: 189.90,
        categoria: Categoria.CARNES,
        imageURL: "/leitao_bairrada.jpg"
      },
      { 
        nome: "Cozido à Portuguesa", 
        descricao: `Prato robusto e reconfortante, composto por diversas carnes — vaca, porco e aves — 
        acompanhadas de enchidos como chouriço, farinheira e morcela, além de legumes e batatas cozidos 
        no mesmo caldo aromático. Uma explosão de sabores que traduz a alma da cozinha portuguesa.`,
        preco: 129.90,
        categoria: Categoria.CARNES,
        imageURL: "/cozido_portuguesa.jpg"
      },
      { 
        nome: "Feijoada à Transmontana", 
        descricao: `Feijão encorpado cozido com carnes suínas defumadas, chouriço, orelha e pé de porco, 
        temperado com alho, cebola e louro. Um prato rústico e saboroso, típico da região de Trás-os-Montes, 
        ideal para dias frios.`,
        preco: 119.90,
        categoria: Categoria.CARNES,
        imageURL: "/feijoada_transmontana.jpg"
      },
      { 
        nome: "Pão de Ló de Ovar", 
        descricao: `Bolo conventual de massa leve e fofa, com interior ligeiramente cremoso, preparado com ovos frescos, 
        açúcar e farinha de trigo. Servido ainda morno, mantém a umidade característica que derrete na boca.`,
        preco: 22.90,
        categoria: Categoria.SOBREMESAS,
        imageURL: "/pao_lo_ovar.jpg"
      },
      { 
        nome: "Sericaia com Ameixa de Elvas", 
        descricao: `Sobremesa alentejana feita com massa suave à base de ovos, açúcar e leite, 
        aromatizada com canela e assada até formar uma crosta dourada. Servida com ameixas em calda da região de Elvas, 
        oferece contraste perfeito entre doçura e acidez.`,
        preco: 26.90,
        categoria: Categoria.SOBREMESAS,
        imageURL: "/sericaia_ameixa.jpg"
      } 
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });