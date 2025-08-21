import { beforeEach, describe, expect, test } from 'vitest';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import { Headers } from 'undici';

beforeEach(async () => {
  await db.pedidoItem.deleteMany();
  await db.item.deleteMany();
});


describe("itemRouter", () => {
    const caller = appRouter.createCaller({ db, session: null, headers: new Headers(), });

    test("cria um item com sucesso", async () => {
        const item = await caller.item.create({
        nome: "Bacalhau à Zé do Pipo",
        descricao: "Bacalhau gratinado com purê e maionese",
        preco: 219.9,
        imageURL: "http://localhost:3000/uploads/bacalhau.jpg",
        categoria: "PEIXES",
        });
        
        expect(item).toHaveProperty("id");
        expect(item.nome).toBe("Bacalhau à Zé do Pipo");
    });
    
    test("busca item por ID", async () => {
        const item = await caller.item.create({
        nome: "Bacalhau à Zé do Pipo",
        descricao: "Bacalhau gratinado com purê e maionese",
        preco: 219.9,
        imageURL: "http://localhost:3000/uploads/bacalhau.jpg",
        categoria: "PEIXES",
        });

        const itemID = await caller.item.getByID(item.id);
        expect(itemID.nome).toBe("Bacalhau à Zé do Pipo");
    });

    test("retorna erro ao buscar ID inexistente", async () => {
        await expect(caller.item.getByID("id_invalido")).rejects.toThrow("Item não encontrado.");
    });

    test("busca por categoria", async () => {
        await caller.item.create({
        nome: "Bacalhau à Zé do Pipo",
        descricao: "Bacalhau gratinado com purê e maionese",
        preco: 219.9,
        imageURL: "http://localhost:3000/uploads/bacalhau.jpg",
        categoria: "PEIXES",
        });
        
        await caller.item.create({
        nome: "Alcatra Açoriana",
        descricao: "Alcatra cozida lentamente ao estilo dos Açores",
        preco: 109.9,
        imageURL: "http://localhost:3000/uploads/bacalhau.jpg",
        categoria: "CARNES",
        });

        const itens_peixes = await caller.item.getByCategoria("PEIXES");
        expect(itens_peixes.length).toEqual(1);
        expect(itens_peixes[0]?.categoria).toBe("PEIXES");
    });

    test("retorna erro se categoria não tiver itens", async () => {
        await expect(caller.item.getByCategoria("SOBREMESAS")).rejects.toThrow("Nenhum item encontrado.");
    });

    test("atualiza item existente", async () => {
        const criado = await caller.item.create({
        nome: "Item Original",
        descricao: "Descrição original",
        preco: 10.0,
        imageURL: "https://example.com/original.jpg",
        categoria: "BEBIDAS",
        });

        const atualizado = await caller.item.update({
        id: criado.id,
        nome: "Item Atualizado",
        });

        expect(atualizado.nome).toBe("Item Atualizado");
    });

    test("deleta item existente", async () => {
        const item = await caller.item.create({
        nome: "Item a ser deletado",
        descricao: "Será removido",
        preco: 50,
        imageURL: "https://example.com/delete.jpg",
        categoria: "CARNES",
        });

        const deletado = await caller.item.delete(item.id);
        expect(deletado.id).toBe(item.id);

        await expect(caller.item.getByID(item.id)).rejects.toThrow("Item não encontrado.");
    });
});