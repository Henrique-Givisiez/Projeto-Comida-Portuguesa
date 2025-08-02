import { beforeEach, describe, expect, test } from 'vitest';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import { Headers } from 'undici';

beforeEach(async () => {
  await db.variavel.deleteMany();
});

describe('Variavel Router', () => {
    const caller = appRouter.createCaller({ db, session: null, headers: new Headers(), });
    
    test('cria uma nova variavel com sucesso', async () => {
        const novaVariavel = await caller.variavel.create({
        chave: 'senhaGarcom',
        valor: "senha123",
        });

        expect(novaVariavel).toHaveProperty('id');
        expect(novaVariavel.chave).toBe('senhaGarcom');
        expect(novaVariavel.valor).toBeDefined();
    });

    test("falha ao criar variavel duplicada para mesma chave", async () => {
        await caller.variavel.create({
            chave: "senhaGarcom",
            valor: "senha1234",
        });

        await expect(() =>
            caller.variavel.create({
            chave: "senhaGarcom",
            valor: "senha1234",
            })
        ).rejects.toThrow("Variável já existe");
    });

    test("verifica se valor da chave confere com sucesso", async () => {
        await caller.variavel.create({ chave: "senhaGarcom", valor: "senha123" });
        const resultado = await caller.variavel.verificar({
            chave: "senhaGarcom",
            valor: "senha123",
        });

        expect(resultado).toBe(true);
    });

    test("falha quando valor da chave é diferente", async () => {
        await caller.variavel.create({ chave: "senhaGarcom", valor: "senha123" });
        const resultado = await caller.variavel.verificar({
            chave: "senhaGarcom",
            valor: "senha1234",
        });

        expect(resultado).toBe(false);
    });


    test("falha ao buscar variavel inexistente", async () => {
        await expect(() =>
            caller.variavel.verificar({
                chave: "inexistente",
                valor: "qualquer",
            })
        ).rejects.toThrow("Variável não configurada.");
    });

    test("atualiza variavel com sucesso", async () => {
        const variavel = await caller.variavel.create({
            chave: "senhaGarcom",
            valor: "senha123",
        });

        const atualizada = await caller.variavel.update({
            id: variavel.id,
            valor: "senha456",
        });

        expect(atualizada.id).toBe(variavel.id);
        
        const resultado = await caller.variavel.verificar({
            chave: "senhaGarcom",
            valor: "senha456",
        });
        expect(resultado).toBe(true);
    });

    test("remove uma variavel existente", async () => {
        const variavel = await caller.variavel.create({
            chave: "senhaGarcom",
            valor: "senha123",
        });

        const deletada = await caller.variavel.delete(variavel.id);

        expect(deletada.id).toBe(variavel.id);

        await expect(() =>
            caller.variavel.delete(variavel.id)
        ).rejects.toThrow("Variável não encontrada.");
    });
});
