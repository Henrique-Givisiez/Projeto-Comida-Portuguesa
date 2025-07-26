'use client'
import React, { useState } from 'react';
import Button from "./_components/button";
import { Input } from './_components/input';
import { Settings, UtensilsCrossed } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './_components/dialog';

export default function Home() {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [password, setPassword] = useState('');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  const handleOpenComanda = () => {
    if (!customerName.trim()) {
      return;
    }

  };

  const handleTableNumberChange = () => {
    if (password !== 'garcom123') {
      setPassword('');
      return;
    }
    
    setIsTableDialogOpen(false);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#f5e6da] flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="relative">
          <img 
            src="/Logo.png" 
            alt="Comida Portuguesa Com Certeza" 
            className="absolute top-[-15rem] left-1/2 -translate-x-1/2 h-60 w-auto object-contain z-20"
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
              className="w-full h-14 text-lg"
              aria-label="Abrir comanda"
              >
              <UtensilsCrossed className="mx-1 w-5 h-5" />
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
              <DialogTitle>Configurações da Mesa</DialogTitle>
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
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleTableNumberChange()}
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
