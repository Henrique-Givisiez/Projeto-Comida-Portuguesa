"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/app/_components/dialog";
import { Input } from "~/app/_components/input";
import Button from "~/app/_components/button";
import { LogOut } from "lucide-react";

import React, { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "sonner";

export function EncerrarAtendimento() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const verificarSenhaGarcom = api.variavel.verificar.useQuery(
    { chave: "senhaGarcom", valor: adminPassword },
    { enabled: false }
    );
    
    const handleEncerrarAtendimento = async () => {
        try {
            const { data: senhaValida } = await verificarSenhaGarcom.refetch();

            if (!senhaValida) {
                toast.error("Senha incorreta. Tente novamente.");
                setAdminPassword("");
                return;
            }

            toast.success(`Atendimento encerrado com sucesso!`);
            setDialogOpen(false);
            setAdminPassword("");
        } catch {
            toast.error("Erro ao verificar a senha. Tente novamente.");
            setAdminPassword("");
        }
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <button
                        className="flex items-center rounded-md bg-red-600 px-4 py-2 
                                   text-white hover:bg-red-700 transition-colors 
                                   focus:outline-none focus:ring-2 focus:ring-red-500 
                                   focus:ring-offset-2 shadow-md cursor-pointer"
                        onClick={() => {
                            setDialogOpen(true);
                        }}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Encerrar Atendimento
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Senha do Administrador</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-gray-600">
                            Digite a senha do administrador para encerrar o atendimento.
                        </p>
                        <div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Digite a senha..."
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="border-azulejo-medium focus:border-portuguese-gold"
                            onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                void handleEncerrarAtendimento();
                            }
                            }}
                        />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                            setDialogOpen(false);
                            setAdminPassword('');
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="restaurant"
                            onClick={handleEncerrarAtendimento}
                            disabled={!adminPassword.trim()}
                            className="font-semibold"
                        >
                            Confirmar
                        </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}