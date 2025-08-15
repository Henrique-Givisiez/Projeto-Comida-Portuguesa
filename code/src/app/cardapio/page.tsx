'use client'
import { useMediaQuery } from "react-responsive";
import CardapioMobile from "./_components/Layouts/CardapioMobile";
import CardapioDesktop from "./_components/Layouts/CardapioDesktop";

export default function Cardapio() {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    return isMobile ? <CardapioMobile /> : <CardapioDesktop />;
}
