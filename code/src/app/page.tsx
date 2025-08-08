'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './_components/dialog';
import { Settings, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from './_components/input';
import Button from "./_components/button";
import React, { useState } from 'react';
import { api } from '~/utils/api';
import { toast } from 'sonner';
import Image from 'next/image';

export default function Home() {
  const createComanda = api.comanda.create.useMutation();
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [tempTableNumber, setTempTableNumber] = useState('1');
  const [password, setPassword] = useState('');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const router = useRouter();

  const handleOpenComanda = async () => {
    if (!customerName.trim()) {
      toast.error('Por favor, digite seu nome para abrir a comanda.');
      return;
    }

    try {
      const comanda = await createComanda.mutateAsync({
        nomeCliente: customerName.trim(),
        numeroMesa: Number(tableNumber),
      });

      router.push(`/cardapio/${comanda.id}`)

    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Erro ao abrir comanda";
      toast.error(errMsg);
    }
  };


  const verificarSenhaGarcom = api.variavel.verificar.useQuery(
    { chave: "senhaGarcom", valor: password },
    { enabled: false }
  );

  const handleTableNumberChange = async () => {
    if (!password.trim()) return;

    try {
      const { data: senhaValida } = await verificarSenhaGarcom.refetch();

      if (!senhaValida) {
        toast.error("Senha incorreta. Tente novamente.");
        setPassword("");
        return;
      }

      setTableNumber(tempTableNumber);
      toast.success(`Mesa alterada para ${tempTableNumber}`);
      setIsTableDialogOpen(false);
      setPassword("");
    
    } catch {
      toast.error("Erro ao verificar a senha. Tente novamente.");
      setPassword("");
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-b from-[#f5e6da] to-[#fff5cc] flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="relative">
          <Image
            src="/Logo.png"
            alt="Comida Portuguesa Com Certeza"
            width={480}
            height={270}
            className="absolute top-[-15rem] left-1/2 -translate-x-1/2"
            priority
            style={{ objectFit: 'contain' }}  
          />
        </div>

        {/* Card Boas Vindas */}
        <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] p-8 mb-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#002b5c] mb-2">
              Bem-vindo!
            </h1>
            <p className="text-[#6c757d]">
              Digite seu nome para começar seu pedido
            </p>
          </div>

          {/* Nome Cliente Input */}
          <div className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Digite seu nome para abrir a comanda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-14 text-lg border-2 border-[#729bbf] focus:border-[#f4c542] transition-colors"
                aria-label="Nome do cliente"
                />
            </div>

            {/* Abrir Comanda Button */}
            <Button
              onClick={handleOpenComanda}
              disabled={!customerName.trim()}
              variant="restaurant"
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              aria-label="Abrir comanda"
              >
              <UtensilsCrossed className="mr-2 w-5 h-5" />
              Abrir Comanda
            </Button>
          </div>
        </div>
      </div>

      {/* Alterar mesa Modal */}
      <div className="flex justify-center">
        <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="settings" className="h-12 w-12">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações da Mesa {tableNumber}</DialogTitle>
            </DialogHeader>
          <div className="space-y-4 pt-4">
                <div>
                  <label htmlFor="table-number" className="text-sm font-medium text-portuguese-blue mb-2 block">
                    Número da Mesa
                  </label>
                  <Input
                    id="table-number"
                    type="number"
                    min="1"
                    max="50"
                    value={tempTableNumber}
                    onChange={(e) => setTempTableNumber(e.target.value)}
                    className="border-azulejo-medium focus:border-portuguese-gold"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-portuguese-blue mb-2 block">
                    Senha do Funcionário
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-azulejo-medium focus:border-portuguese-gold"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleTableNumberChange();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTableDialogOpen(false);
                      setPassword('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="restaurant"
                    onClick={handleTableNumberChange}
                    disabled={!password.trim()}
                    className='font-semibold'
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
