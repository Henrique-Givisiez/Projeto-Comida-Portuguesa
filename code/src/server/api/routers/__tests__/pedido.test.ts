import { beforeEach, describe, expect, test } from "vitest";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { Headers } from "undici";

// Helpers de criação
async function criaComanda(nomeCliente = "Cliente", numeroMesa = 1) {
  return db.comanda.create({
    data: { nomeCliente, numeroMesa, finalizada: false },
  });
}

async function criaItem(
  nome = "Bacalhau à Zé do Pipo",
  preco = 99.9,
  categoria: any = "PEIXES",
) {
  return db.item.create({
    data: {
      nome,
      descricao: "Clássico português",
      preco,
      imageURL: "/bacalhau.jpg",
      categoria,
      disponivel: true,
    },
  });
}

beforeEach(async () => {
  // Ordem importa por FK
  await db.pedidoItem.deleteMany();
  await db.pedido.deleteMany();
  await db.comanda.deleteMany();
  await db.item.deleteMany();
});

describe("Pedido Router", () => {
  const caller = appRouter.createCaller({ db, session: null, headers: new Headers() });

  test("cria um novo pedido com itens e status padrão EM_ANDAMENTO", async () => {
    const comanda = await criaComanda("Henrique", 10);
    const item = await criaItem();

    const pedido = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [
        { itemId: item.id, quantidade: 2, observacao: "sem sal" },
        { itemId: item.id, quantidade: 1 }
      ],
    });

    expect(pedido).toHaveProperty("id");
    expect(pedido.comandaId).toBe(comanda.id);
    expect(pedido.status).toBe("EM_ANDAMENTO");
    expect(pedido.itens).toHaveLength(2);
    const semObs = pedido.itens.find((i) => i.observacao === "");
    expect(semObs).toBeTruthy();
  });

  test("getByID retorna o pedido com comanda e itens populados", async () => {
    const comanda = await criaComanda("Ana", 1);
    const item = await criaItem("Pastel de Belém", 12.5, "SOBREMESAS");

    const criado = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 3 }],
    });

    const carregado = await caller.pedido.getByID({ id: criado.id });

    expect(carregado.id).toBe(criado.id);
    expect(carregado.comanda?.numeroMesa).toBe(1);
    expect(carregado.comanda?.nomeCliente).toBe("Ana");
    expect(carregado.itens[0]?.item?.nome).toBe("Pastel de Belém");
    expect(carregado.itens[0]?.item?.preco).toBe(12.5);
  });

  test("getByID lança NOT_FOUND quando o pedido não existe", async () => {
    await expect(() =>
      caller.pedido.getByID({ id: "nao-existe" })
    ).rejects.toThrow("Pedido não encontrado.");
  });

  test("getByParam filtra por numeroMesa via relação com comanda", async () => {
    const c1 = await criaComanda("Mesa1", 1);
    const c2 = await criaComanda("Mesa2", 2);
    const item = await criaItem();

    await caller.pedido.create({
      comandaId: c1.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });
    await caller.pedido.create({
      comandaId: c2.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });

    const apenasMesa2 = await caller.pedido.getByParam({ numeroMesa: 2 });

    expect(apenasMesa2.length).toBeGreaterThanOrEqual(1);
    expect(apenasMesa2.every((p) => p.comanda?.numeroMesa === 2)).toBe(true);
  });

  test("getByParam filtra por status", async () => {
    const comanda = await criaComanda("Status", 3);
    const item = await criaItem();

    const p1 = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });

    // atualiza um para ENTREGUE
    await caller.pedido.update({ id: p1.id, status: "ENTREGUE" });

    const emAndamento = await caller.pedido.getByParam({ status: "EM_ANDAMENTO" });
    const entregues = await caller.pedido.getByParam({ status: "ENTREGUE" });

    expect(entregues.every((p) => p.status === "ENTREGUE")).toBe(true);
    expect(emAndamento.every((p) => p.status === "EM_ANDAMENTO")).toBe(true);
  });

  test("getByParam filtra por dataCriacao (intervalo do dia)", async () => {
    const comanda = await criaComanda("Data", 4);
    const item = await criaItem();

    // cria dois pedidos
    const p1 = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });
    const p2 = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 2 }],
    });

    // força p1 para ontem e p2 para hoje (dependendo do schema, o campo é `dataCriacao`)
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    await db.pedido.update({
      where: { id: p1.id },
      data: { dataCriacao: ontem },
    });
    await db.pedido.update({
      where: { id: p2.id },
      data: { dataCriacao: hoje },
    });

    const apenasHoje = await caller.pedido.getByParam({ dataCriacao: hoje });
    expect(apenasHoje.every((p) => {
      const d = new Date(p.dataCriacao);
      return d.getDate() === hoje.getDate() &&
             d.getMonth() === hoje.getMonth() &&
             d.getFullYear() === hoje.getFullYear();
    })).toBe(true);
  });

  test("getByParam ordena por dataCriacao ASC", async () => {
    const comanda = await criaComanda("Ordem", 5);
    const item = await criaItem();

    const pA = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });
    const pB = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [{ itemId: item.id, quantidade: 1 }],
    });

    // Garante pA mais antigo do que pB
    const t0 = new Date();
    const tMenos1h = new Date(t0.getTime() - 60 * 60 * 1000);
    await db.pedido.update({ where: { id: pA.id }, data: { dataCriacao: tMenos1h } });
    await db.pedido.update({ where: { id: pB.id }, data: { dataCriacao: t0 } });

    const lista = await caller.pedido.getByParam({});
    // deve estar em ordem asc: pA, pB
    const ids = lista.map((p) => p.id);
    const idxA = ids.indexOf(pA.id);
    const idxB = ids.indexOf(pB.id);
    expect(idxA).toBeLessThan(idxB);
  });

  test("update altera status e permite trocar a comanda (connect)", async () => {
    const c1 = await criaComanda("Origem", 6);
    const c2 = await criaComanda("Destino", 7);
    const item = await criaItem();

    const pedido = await caller.pedido.create({
      comandaId: c1.id,
      itens: [{ itemId: item.id, quantidade: 2 }],
    });

    const atualizado = await caller.pedido.update({
      id: pedido.id,
      status: "FINALIZADO",
      comandaId: c2.id,
    });

    expect(atualizado.status).toBe("FINALIZADO");
    expect(atualizado.comanda?.id).toBe(c2.id);
    expect(atualizado.comanda?.numeroMesa).toBe(7);
  });

  test("delete remove pedido e seus itens; repetir delete lança erro", async () => {
    const comanda = await criaComanda("Del", 8);
    const item = await criaItem();

    const pedido = await caller.pedido.create({
      comandaId: comanda.id,
      itens: [
        { itemId: item.id, quantidade: 1 },
        { itemId: item.id, quantidade: 2 },
      ],
    });

    // Confere que existem itens associados
    const qtdAntes = await db.pedidoItem.count({ where: { pedidoId: pedido.id } });
    expect(qtdAntes).toBe(2);

    const deletado = await caller.pedido.delete({ id: pedido.id });
    expect(deletado.id).toBe(pedido.id);
    expect(deletado.comanda?.numeroMesa).toBe(8);

    const qtdDepois = await db.pedidoItem.count({ where: { pedidoId: pedido.id } });
    expect(qtdDepois).toBe(0);

    await expect(() => caller.pedido.delete({ id: pedido.id })).rejects.toThrow();
  });

  test("create falha com quantidade inválida (<1)", async () => {
    const comanda = await criaComanda("Inválido", 11);
    const item = await criaItem();

    await expect(() =>
      caller.pedido.create({
        comandaId: comanda.id,
        itens: [{ itemId: item.id, quantidade: 0 }],
      })
    ).rejects.toThrow(); // validação zod
  });

  test("create falha quando comandaId é vazio", async () => {
    const item = await criaItem();
    await expect(() =>
      caller.pedido.create({
        // comandaId vazio
        comandaId: "",
        itens: [{ itemId: item.id, quantidade: 1 }],
      })
    ).rejects.toThrow();
  });
});
