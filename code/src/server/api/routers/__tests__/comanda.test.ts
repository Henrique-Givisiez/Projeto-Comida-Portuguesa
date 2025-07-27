import { beforeEach, describe, expect, test } from 'vitest';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import { Headers } from 'undici';

beforeEach(async () => {
  await db.comanda.deleteMany();
});

describe('Comanda Router', () => {
    const caller = appRouter.createCaller({ db, session: null, headers: new Headers(), });
    
    test('cria uma nova comanda com sucesso', async () => {
        const novaComanda = await caller.comanda.create({
        nomeCliente: 'Henrique',
        numeroMesa: 10,
        });

        expect(novaComanda).toHaveProperty('id');
        expect(novaComanda.nomeCliente).toBe('Henrique');
        expect(novaComanda.numeroMesa).toBe(10);
        expect(novaComanda.finalizada).toBe(false);
    });

    test("falha ao criar comanda duplicada para mesma mesa e cliente", async () => {
        await caller.comanda.create({
            nomeCliente: "Duplicado",
            numeroMesa: 2,
        });

        await expect(() =>
            caller.comanda.create({
            nomeCliente: "Duplicado",
            numeroMesa: 2,
            })
        ).rejects.toThrow("Comanda já existe");
    });

    test("retorna lista de comandas em aberto", async () => {
        await caller.comanda.create({ nomeCliente: "Ana", numeroMesa: 1 });
        await caller.comanda.create({ nomeCliente: "Beto", numeroMesa: 2 });

        const comandas = await caller.comanda.getAll();

        expect(comandas.length).toBeGreaterThanOrEqual(2);
        expect(comandas[0]).toHaveProperty("id");
    });

    test("busca comanda por nome e número da mesa", async () => {
        await caller.comanda.create({ nomeCliente: "Carlos", numeroMesa: 5 });

        const resultado = await caller.comanda.getByParam({
            nomeCliente: "Carlos",
            numeroMesa: 5,
        });

        expect(resultado.length).toBe(1);
        expect(resultado[0]!.nomeCliente).toBe("Carlos");
    });

    test("atualiza nome e mesa da comanda", async () => {
        const comanda = await caller.comanda.create({
            nomeCliente: "Update",
            numeroMesa: 9,
        });

        const atualizada = await caller.comanda.update({
            id: comanda.id,
            nomeCliente: "Updateado",
            numeroMesa: 10,
            finalizada: true,
        });

        expect(atualizada.nomeCliente).toBe("Updateado");
        expect(atualizada.numeroMesa).toBe(10);
        expect(atualizada.finalizada).toBe(true);
    });

    test("remove uma comanda existente", async () => {
        const comanda = await caller.comanda.create({
            nomeCliente: "Deletar",
            numeroMesa: 15,
        });

        const deletada = await caller.comanda.delete(comanda.id);

        expect(deletada.id).toBe(comanda.id);

        await expect(() =>
            caller.comanda.delete(comanda.id)
        ).rejects.toThrow("Comanda não encontrada.");
    });
});
